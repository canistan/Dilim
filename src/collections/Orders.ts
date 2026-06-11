import type { CollectionConfig } from 'payload'

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
  },
  access: {
    // Sadece adminler (Users) doğrudan Payload API üzerinden siparişlere erişebilir.
    // Müşteriler (NextAuth) site üzerinden Server Component'ler (Local API) aracılığıyla veriye ulaşır.
    read: ({ req: { user } }) => Boolean(user?.collection === 'users'),
    create: ({ req: { user } }) => Boolean(user?.collection === 'users'),
    update: ({ req: { user } }) => Boolean(user?.collection === 'users'),
    delete: ({ req: { user } }) => Boolean(user?.collection === 'users'),
  },
  hooks: {
    afterChange: [
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
                    });
                    if (productDoc && typeof productDoc.stock === 'number') {
                      const newStock = Math.max(0, productDoc.stock - (item.quantity || 1));
                      await currentPayload.update({
                        collection: 'products',
                        id: productDoc.id,
                        data: {
                          stock: newStock,
                        },
                      });
                    }
                  } catch (e) {
                    currentPayload.logger.error(`Stok düşürme hatası: Ürün ID ${item.product}`);
                  }
                }
              }
            }
            
            // Ödeme başarılı maili gönder
            try {
              if (currentPayload && doc.customerInfo?.email) {
                // await kaldirildi, arka planda gondersin, kullaniciyi bekletmesin
                currentPayload.sendEmail({
                  to: doc.customerInfo.email,
                  from: 'sistem@dilim.com',
                  subject: `Ödemeniz Alındı - Sipariş No: ${doc.orderNumber}`,
                  html: `<div style="font-family: sans-serif; padding: 20px; line-height: 1.6;">
                          <h2 style="color: #333;">Merhaba ${doc.customerInfo.firstName},</h2>
                          <p>${doc.orderNumber} numaralı siparişinizin ödemesi başarıyla alınmıştır.</p>
                          <p>Siparişiniz şu an <strong>hazırlanıyor</strong> durumundadır. Kargoya verildiğinde size tekrar bilgi vereceğiz.</p>
                          <p>Bizi tercih ettiğiniz için teşekkür ederiz.</p>
                        </div>`
                }).catch(e => console.error("Email gonderim hatasi", e));
              }
            } catch (e) {}
          }

          // 2. SİPARİŞ DURUMU OTOMASYONU (Müşteriye bilgi maili)
          if (doc.status !== previousDoc.status) {
            let subject = '';
            let message = '';
            
            if (doc.status === 'shipped') {
              subject = `Siparişiniz Kargoya Verildi - Sipariş No: ${doc.orderNumber}`;
              message = `<p>Siparişiniz kargoya teslim edilmiştir. En kısa sürede size ulaşacaktır.</p>`;
            } else if (doc.status === 'delivered') {
              subject = `Siparişiniz Teslim Edildi - Sipariş No: ${doc.orderNumber}`;
              message = `<p>Siparişiniz başarıyla teslim edilmiştir. Afiyet olsun!</p>
                         <p style="margin-top:20px; padding:15px; background:#f9f9f9; border-left:4px solid #FF8A00;">
                           <strong>Bizi Değerlendirin:</strong><br/>
                           Deneyiminizi Google Haritalar'da paylaşarak bize destek olabilirsiniz.
                         </p>`;
            }

            if (subject && message && doc.customerInfo?.email) {
              try {
                req.payload.sendEmail({
                  to: doc.customerInfo.email,
                  from: 'sistem@dilim.com',
                  subject: subject,
                  html: `<div style="font-family: sans-serif; padding: 20px; line-height: 1.6;">
                          <h2 style="color: #333;">Merhaba ${doc.customerInfo.firstName},</h2>
                          ${message}
                        </div>`
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
                  label: 'Kayıtlı Müşteri Profili',
                },
                {
                  name: 'orderType',
                  type: 'select',
                  defaultValue: 'standard',
                  label: 'Sipariş Türü',
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
                  label: 'Ek Seçenekler (Örn: Boyut, Pasta Yazısı)',
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
                { name: 'note', type: 'textarea', label: 'Müşteri Notu' },
                { name: 'referenceImage', type: 'relationship', relationTo: 'media', label: 'Referans Görseli' },
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
