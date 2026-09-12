import type { CollectionConfig } from 'payload'

import { orderAccess } from '../access/roles'
import { auditLogAfterChange, auditLogAfterDelete } from '../hooks/auditLogHook'
import { cancelPayment } from '@/lib/iyzico'

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: 'Sipariş',
    plural: 'Siparişler',
  },
  admin: {
    useAsTitle: 'orderNumber',
    group: 'Kullanıcı Bilgi Deposu',
    defaultColumns: ['orderNumber', 'orderType', 'status', 'totalAmount', 'createdAt'],
    defaultSort: '-createdAt',
  },
  access: {
    read: orderAccess,
    create: ({ req: { user } }) => Boolean(user?.collection === 'users'),
    update: ({ req: { user } }) => Boolean(user?.collection === 'users'),
    delete: ({ req: { user } }) => Boolean(user?.collection === 'users'),
  },
  hooks: {
    afterDelete: [
      async (args) => auditLogAfterDelete('Siparişler')(args)
    ],
    beforeChange: [
      async ({ data, originalDoc, operation, req }) => {
        // İptal onaylandığında İyzico API üzerinden iade yapılması
        if (operation === 'update' && originalDoc) {
          if (
            data.cancellationRequest?.decision === 'approved' &&
            originalDoc.cancellationRequest?.decision !== 'approved' &&
            originalDoc.paymentStatus === 'paid' &&
            originalDoc.iyzicoPaymentId &&
            originalDoc.refundStatus !== 'success'
          ) {
            try {
              req.payload.logger.info(`İptal onaylandı, İyzico'ya iade isteği gönderiliyor. PaymentID: ${originalDoc.iyzicoPaymentId}`);
              
              const cancelResult = await cancelPayment(originalDoc.iyzicoPaymentId);
              
              if (cancelResult.status === 'success') {
                data.refundStatus = 'success';
                data.status = 'cancelled'; // Siparişi direkt iptal edildiye çek
                req.payload.logger.info(`İade başarılı: ${originalDoc.iyzicoPaymentId}`);
              } else {
                throw new Error(`İade başarısız: ${cancelResult.errorMessage}`);
              }
            } catch (err: any) {
              req.payload.logger.error(`İade işlemi sırasında hata: ${err.message}`);
              throw new Error(`İyzico İade Hatası: ${err.message}`);
            }
          }
        }
        return data;
      }
    ],
    afterChange: [
      async (args) => auditLogAfterChange('Siparişler')(args),
      async ({ doc, previousDoc, operation, req }) => {
        if (operation === 'update' && previousDoc) {
          // 1. STOK DÜŞÜRME OTOMASYONU
          // Eğer ödeme durumu 'unpaid' den 'paid' e geçmişse, stokları düşür.
          if (doc.paymentStatus === 'paid' && previousDoc.paymentStatus !== 'paid') {
            const currentPayload = req?.payload;
            if (currentPayload && Array.isArray(doc.orderItems)) {
              for (const item of doc.orderItems) {
                if (item.product) {
                  try {
                    const productId = typeof item.product === 'object' ? item.product.id : item.product;
                    const productDoc = await currentPayload.findByID({
                      collection: 'products',
                      id: productId,
                      req, // DEADLOCK FIX
                    });
                    if (productDoc && typeof productDoc.stock === 'number') {
                      const newStock = Math.max(0, productDoc.stock - (item.quantity || 1));
                      await currentPayload.update({
                        collection: 'products',
                        id: productDoc.id,
                        data: {
                          stock: newStock,
                        },
                        req, // DEADLOCK FIX
                      });
                    }
                  } catch (e) {
                    currentPayload.logger.error(`Stok düşürme hatası: Ürün ID ${item.product}`);
                  }
                }
              }
            }
            
            // Ödeme başarılı maili gönder (Müşteriye)
            try {
              if (currentPayload && doc.customerInfo?.email) {
                const customerHtml = `
                  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #FF8A00; padding: 20px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Dilim Pastaneleri</h1>
                    </div>
                    <div style="padding: 30px; background-color: #ffffff;">
                      <h2 style="color: #333333; margin-top: 0;">Merhaba ${doc.customerInfo.firstName},</h2>
                      <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                        <strong>${doc.orderNumber}</strong> numaralı siparişinizin ödemesi başarıyla alınmıştır.
                      </p>
                      <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                        Siparişiniz şu an <strong>hazırlanıyor</strong> durumundadır. Teslimat için yola çıktığında size tekrar bilgi vereceğiz.
                      </p>
                      <div style="margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-radius: 6px;">
                        <p style="margin: 0; color: #777777; font-size: 14px;">Bizi tercih ettiğiniz için teşekkür ederiz.</p>
                      </div>
                    </div>
                  </div>
                `;

                await currentPayload.sendEmail({
                  to: doc.customerInfo.email,
                  from: 'noreply@dilim.com.tr',
                  subject: `Ödemeniz Alındı - Sipariş No: ${doc.orderNumber}`,
                  html: customerHtml
                }).catch(e => console.error("Email gonderim hatasi", e));
              }
            } catch (e) {}

            // Admin Alert Maili Gönder (Mağaza Yöneticisine)
            try {
              if (currentPayload) {
                const adminHtml = `
                  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #1a1a1a; padding: 20px; text-align: center;">
                      <h1 style="color: #FF8A00; margin: 0; font-size: 20px;">🚨 YENİ SİPARİŞ ALINDI</h1>
                    </div>
                    <div style="padding: 30px; background-color: #ffffff;">
                      <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Sipariş No:</strong></td>
                          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${doc.orderNumber}</td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Müşteri:</strong></td>
                          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${doc.customerInfo?.firstName} ${doc.customerInfo?.lastName}</td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Telefon:</strong></td>
                          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${doc.customerInfo?.phone}</td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Tutar:</strong></td>
                          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${doc.totalAmount} TL</td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>İlçe:</strong></td>
                          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${doc.customerInfo?.district}</td>
                        </tr>
                      </table>
                      <div style="margin-top: 20px; text-align: center;">
                        <a href="https://dilim.com.tr/admin/collections/orders/${doc.id}" style="display: inline-block; background-color: #FF8A00; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">Siparişi Panele Git</a>
                      </div>
                    </div>
                  </div>
                `;

                await currentPayload.sendEmail({
                  to: 'cuneydsahin@dilim.com.tr',
                  from: 'noreply@dilim.com.tr',
                  subject: `🚨 Yeni Sipariş: ${doc.orderNumber} - ${doc.customerInfo?.firstName} ${doc.customerInfo?.lastName}`,
                  html: adminHtml
                }).catch(e => console.error("Admin mail gonderim hatasi", e));
              }
            } catch (e) {}
          }

          // 2. İPTAL TALEBİ BİLDİRİMİ (Admin'e bilgi maili)
          if (
            doc.cancellationRequest?.requested === true && 
            previousDoc.cancellationRequest?.requested !== true
          ) {
            try {
              const cancelHtml = `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                  <h2 style="color: #FF0000; text-align: center;">🚨 Yeni İptal Talebi</h2>
                  <p><strong>Sipariş No:</strong> ${doc.orderNumber}</p>
                  <p><strong>Müşteri:</strong> ${doc.customerInfo?.firstName} ${doc.customerInfo?.lastName}</p>
                  <p>Müşteri bu sipariş için iptal talebi oluşturdu. Lütfen yönetici panelinden inceleyip işlemi onaylayın veya reddedin.</p>
                  <div style="text-align: center; margin-top: 20px;">
                    <a href="https://dilim.com.tr/admin/collections/orders/${doc.id}" style="background-color: #FF8A00; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Siparişi İncele</a>
                  </div>
                </div>
              `;
              await req.payload.sendEmail({
                to: 'cuneydsahin@dilim.com.tr',
                from: 'noreply@dilim.com.tr',
                subject: `🚨 İptal Talebi: ${doc.orderNumber}`,
                html: cancelHtml
              }).catch(e => console.error("Admin iptal talep mail gonderim hatasi", e));
            } catch (e) {}
          }

          // 3. SİPARİŞ DURUMU OTOMASYONU (Müşteriye bilgi maili)
          if (doc.status !== previousDoc.status) {
            let subject = '';
            let message = '';
            
            if (doc.status === 'shipped') {
              subject = `Siparişiniz Yola Çıktı - Sipariş No: ${doc.orderNumber}`;
              message = `<p style="color: #555555; font-size: 16px; line-height: 1.6;">Siparişiniz teslim edilmek üzere yola çıkmıştır. En kısa sürede adresinize ulaşacaktır.</p>`;
            } else if (doc.status === 'delivered') {
              subject = `Siparişiniz Teslim Edildi - Sipariş No: ${doc.orderNumber}`;
              message = `<p style="color: #555555; font-size: 16px; line-height: 1.6;">Siparişiniz başarıyla teslim edilmiştir. Afiyet olsun!</p>
                         <div style="margin-top:30px; padding:20px; background-color:#fff5eb; border-left:4px solid #FF8A00; border-radius:4px;">
                           <strong style="color:#333;">Bizi Değerlendirin:</strong><br/>
                           <p style="margin-top:8px; color:#666;">Deneyiminizi Google Haritalar'da paylaşarak bize destek olabilirsiniz.</p>
                         </div>`;
            }

            if (subject && message && doc.customerInfo?.email) {
              try {
                const statusHtml = `
                  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #FF8A00; padding: 20px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Dilim Pastaneleri</h1>
                    </div>
                    <div style="padding: 30px; background-color: #ffffff;">
                      <h2 style="color: #333333; margin-top: 0;">Merhaba ${doc.customerInfo.firstName},</h2>
                      ${message}
                    </div>
                  </div>
                `;

                await req.payload.sendEmail({
                  to: doc.customerInfo.email,
                  from: 'noreply@dilim.com.tr',
                  subject: subject,
                  html: statusHtml
                }).catch(e => console.error("Durum maili gonderilemedi", e));
              } catch (e) {
                req.payload.logger.error(`Durum maili hatasi: ${doc.orderNumber}`);
              }
            }
          }
        }
      }
    ]
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Müşteri Bilgileri',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'customer',
                  type: 'relationship',
                  relationTo: 'customers',
                  label: 'Müşteri',
                  admin: {
                    placeholder: 'Misafir Müşteri (Kayıtsız Sipariş)',
                  }
                },
                {
                  name: 'orderType',
                  type: 'select',
                  defaultValue: 'standard',
                  label: 'Sipariş Türü',
                  admin: {
                    components: {
                      Cell: '@/components/Admin/OrderTypeCell#OrderTypeCell',
                    },
                  },
                  options: [
                    { label: 'Standart Sepet Siparişi', value: 'standard' },
                    { label: 'Özel Tasarım Pasta Talebi', value: 'custom' },
                  ],
                },
              ]
            },
            {
              name: 'customerInfo',
              type: 'group',
              label: 'Sipariş Veren Bilgileri',
              fields: [
                { type: 'row', fields: [{ name: 'firstName', type: 'text', required: true, label: 'Ad' }, { name: 'lastName', type: 'text', required: true, label: 'Soyad' }] },
                { type: 'row', fields: [{ name: 'email', type: 'text', required: true, label: 'E-Posta' }, { name: 'phone', type: 'text', required: true, label: 'Telefon' }] },
                { type: 'row', fields: [{ name: 'district', type: 'text', required: true, label: 'İlçe' }] },
                { name: 'address', type: 'textarea', required: true, label: 'Açık Adres' },
                { name: 'isCorporate', type: 'checkbox', defaultValue: false, label: 'Kurumsal Müşteri' },
                { 
                  type: 'row',
                  fields: [
                    { 
                      name: 'companyName', 
                      type: 'text', 
                      label: 'Firma Adı',
                      admin: { condition: (data, siblingData) => Boolean(siblingData?.isCorporate) }
                    },
                    { 
                      name: 'taxOffice', 
                      type: 'text', 
                      label: 'Vergi Dairesi',
                      admin: { condition: (data, siblingData) => Boolean(siblingData?.isCorporate) }
                    },
                    { 
                      name: 'taxNumber', 
                      type: 'text', 
                      label: 'Vergi Numarası',
                      admin: { condition: (data, siblingData) => Boolean(siblingData?.isCorporate) }
                    },
                  ]
                }
              ],
            },
          ]
        },
        {
          label: 'Teslimat Bilgileri',
          fields: [
            {
              name: 'deliveryAddressUI',
              type: 'ui',
              admin: {
                components: {
                  Field: '@/components/Admin/DeliveryAddressDisplay#DeliveryAddressDisplay',
                }
              }
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'deliveryType',
                  type: 'select',
                  label: 'Teslimat Yöntemi',
                  defaultValue: 'delivery',
                  options: [
                    { label: 'Kapıya Teslim', value: 'delivery' },
                    { label: 'Şubeden Gel-Al', value: 'pickup' },
                  ]
                },
                {
                  name: 'timeSlot',
                  type: 'relationship',
                  relationTo: 'time-slots',
                  label: 'İstenen Teslimat Aralığı',
                }
              ]
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'deliveryZone',
                  type: 'relationship',
                  relationTo: 'delivery-zones',
                  label: 'Teslimat Bölgesi (Kapıya Teslim)',
                  admin: { condition: (data) => Boolean(data?.deliveryType === 'delivery') }
                },
                {
                  name: 'pickupBranch',
                  type: 'relationship',
                  relationTo: 'branches',
                  label: 'Teslim Alınacak Şube (Gel-Al)',
                  admin: { condition: (data) => Boolean(data?.deliveryType === 'pickup') }
                }
              ]
            },
            {
              name: 'isGift',
              type: 'checkbox',
              label: 'Bu Sipariş Hediye mi?',
              defaultValue: false,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'giftRecipientName',
                  type: 'text',
                  label: 'Alıcı Adı Soyadı',
                  admin: { condition: (data) => Boolean(data?.isGift) }
                },
                {
                  name: 'giftRecipientPhone',
                  type: 'text',
                  label: 'Alıcı Telefon Numarası',
                  admin: { condition: (data) => Boolean(data?.isGift) }
                }
              ]
            }
          ]
        },
        {
          label: 'Sipariş Detayları',
          fields: [
            {
              name: 'orderItems',
              type: 'array',
              label: 'Sepet İçeriği',
              admin: {
                condition: (data) => Boolean(data?.orderType !== 'custom'),
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'product',
                      type: 'relationship',
                      relationTo: 'products' as any,
                      label: 'Ürün'
                    },
                    {
                      name: 'quantity',
                      type: 'number',
                      label: 'Adet'
                    },
                    {
                      name: 'price',
                      type: 'number',
                      label: 'Birim Fiyat'
                    },
                  ]
                },
                {
                  name: 'options',
                  type: 'text',
                  label: 'Ek Seçenekler (Örn: Boyut)',
                },
                {
                  name: 'note',
                  type: 'textarea',
                  label: 'Üzerine Yazılacak Not (Sadece Pastalar İçin)',
                },
              ],
            },
            {
              name: 'customCakeDetails',
              type: 'group',
              label: 'Özel Tasarım Pasta Detayları',
              admin: {
                condition: (data) => Boolean(data?.orderType === 'custom'),
              },
              fields: [
                { type: 'row', fields: [{ name: 'cakeSize', type: 'number', label: 'Kişi Sayısı (Porsiyon)' }, { name: 'spongeType', type: 'text', label: 'Kek Tipi' }, { name: 'creamFlavor', type: 'text', label: 'Krema Aroması' }] },
                { name: 'requestedDate', type: 'date', label: 'İstenen Teslim Tarihi ve Saati', admin: { date: { pickerAppearance: 'dayAndTime' } } },
                { name: 'note', type: 'textarea', label: 'Müşteri Notu' },
                { name: 'referenceImage', type: 'upload', relationTo: 'media', label: 'Referans Görseli' },
              ]
            }
          ]
        },
        {
          label: 'Finans ve Durum',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'status',
                  type: 'select',
                  label: 'Sipariş Durumu',
                  defaultValue: 'pending',
                  admin: {
                    components: {
                      Cell: '@/components/Admin/StatusCell#StatusCell',
                    },
                  },
                  options: [
                    { label: 'Yeni Sipariş', value: 'pending' },
                    { label: 'Hazırlanıyor', value: 'preparing' },
                    { label: 'Kargoya Verildi', value: 'shipped' },
                    { label: 'Teslim Edildi', value: 'delivered' },
                    { label: 'İptal Edildi', value: 'cancelled' },
                  ],
                },
                {
                  name: 'paymentStatus',
                  type: 'select',
                  label: 'Ödeme Durumu',
                  defaultValue: 'unpaid',
                  admin: {
                    components: {
                      Cell: '@/components/Admin/StatusCell#StatusCell',
                    },
                  },
                  options: [
                    { label: 'Ödenmedi', value: 'unpaid' },
                    { label: 'Ödendi', value: 'paid' },
                    { label: 'Hatalı İşlem', value: 'failed' },
                  ],
                },
                {
                  name: 'totalAmount',
                  type: 'number',
                  label: 'Genel Toplam',
                  required: true,
                },
              ]
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'iyzicoPaymentId',
                  type: 'text',
                  label: 'İyzico Ödeme Kimliği',
                  admin: { readOnly: true }
                },
                {
                  name: 'refundStatus',
                  type: 'select',
                  label: 'İade Durumu',
                  defaultValue: 'none',
                  options: [
                    { label: 'Yok', value: 'none' },
                    { label: 'Bekliyor', value: 'pending' },
                    { label: 'Başarılı', value: 'success' },
                    { label: 'Başarısız', value: 'failed' },
                  ],
                  admin: { readOnly: true }
                },
              ]
            },
            {
              name: 'cancellationRequest',
              type: 'group',
              label: 'İptal Talebi Yönetimi',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'requested',
                      type: 'checkbox',
                      label: 'Müşteri İptal Talep Etti',
                      defaultValue: false,
                    },
                    {
                      name: 'requestedAt',
                      type: 'date',
                      label: 'Talep Tarihi',
                      admin: { condition: (data, siblingData) => Boolean(siblingData?.requested) }
                    },
                    {
                      name: 'decision',
                      type: 'select',
                      label: 'Yönetici Kararı',
                      defaultValue: 'pending',
                      options: [
                        { label: 'Bekliyor', value: 'pending' },
                        { label: 'Onaylandı (İade Yapılacak)', value: 'approved' },
                        { label: 'Reddedildi', value: 'rejected' },
                      ],
                      admin: { condition: (data, siblingData) => Boolean(siblingData?.requested) }
                    }
                  ]
                }
              ]
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'usedCoupon',
                  type: 'text',
                  label: 'Kullanılan Kupon Kodu',
                  admin: {
                    readOnly: true,
                  }
                },
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'orderNumber',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ value, operation }) => {
            if (operation === 'create' && !value) {
              return `DILIM-${Math.floor(1000 + Math.random() * 9000)}`
            }
            return value
          },
        ],
      },
    },
    {
      name: 'iyzicoToken',
      type: 'text',
      label: 'Iyzico Ödeme Token',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
}
