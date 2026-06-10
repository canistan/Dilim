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
            if (Array.isArray(doc.orderItems)) {
              for (const item of doc.orderItems) {
                if (item.product) {
                  try {
                    const productId = typeof item.product === 'object' ? item.product.id : item.product;
                    const productDoc = await req.payload.findByID({
                      collection: 'products',
                      id: productId,
                    });
                    if (productDoc && typeof productDoc.stock === 'number') {
                      const newStock = Math.max(0, productDoc.stock - (item.quantity || 1));
                      await req.payload.update({
                        collection: 'products',
                        id: productDoc.id,
                        data: {
                          stock: newStock,
                        },
                      });
                    }
                  } catch (e) {
                    req.payload.logger.error(`Stok düşürme hatası: Ürün ID ${item.product}`);
                  }
                }
              }
            }
            
            // Ödeme başarılı maili gönder
            try {
              if (doc.customerInfo?.email) {
                await req.payload.sendEmail({
                  to: doc.customerInfo.email,
                  from: 'sistem@dilim.com',
                  subject: `Ödemeniz Alındı - Sipariş No: ${doc.orderNumber}`,
                  html: `<div style="font-family: sans-serif; padding: 20px; line-height: 1.6;">
                          <h2 style="color: #333;">Merhaba ${doc.customerInfo.firstName},</h2>
                          <p>${doc.orderNumber} numaralı siparişinizin ödemesi başarıyla alınmıştır.</p>
                          <p>Siparişiniz şu an <strong>hazırlanıyor</strong> durumundadır. Kargoya verildiğinde size tekrar bilgi vereceğiz.</p>
                          <p>Bizi tercih ettiğiniz için teşekkür ederiz.</p>
                        </div>`
                });
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
                await req.payload.sendEmail({
                  to: doc.customerInfo.email,
                  from: 'sistem@dilim.com',
                  subject: subject,
                  html: `<div style="font-family: sans-serif; padding: 20px; line-height: 1.6;">
                          <h2 style="color: #333;">Merhaba ${doc.customerInfo.firstName},</h2>
                          ${message}
                        </div>`
                });
              } catch (e) {
                req.payload.logger.error(`Durum maili gönderilemedi: ${doc.orderNumber}`);
              }
            }
          }
        }
      }
    ]
  },
  fields: [
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
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      admin: {
        position: 'sidebar',
        description: 'Eğer siparişi veren kişi sisteme kayıtlı bir müşteri ise, profili buraya bağlanır.',
      },
    },
    {
      name: 'customerInfo',
      type: 'group',
      fields: [
        { name: 'firstName', type: 'text', required: true, label: 'Ad' },
        { name: 'lastName', type: 'text', required: true, label: 'Soyad' },
        { name: 'email', type: 'text', required: true, label: 'E-Posta' },
        { name: 'phone', type: 'text', required: true, label: 'Telefon' },
        { name: 'district', type: 'text', required: true, label: 'İlçe' },
        { name: 'address', type: 'textarea', required: true, label: 'Açık Adres' },
        { name: 'isCorporate', type: 'checkbox', defaultValue: false, label: 'Kurumsal Müşteri' },
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
      ],
    },
    {
      name: 'orderItems',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products' as any,
        },
        {
          name: 'quantity',
          type: 'number',
        },
        {
          name: 'price',
          type: 'number',
        },
      ],
    },
    {
      name: 'orderType',
      type: 'select',
      defaultValue: 'standard',
      options: [
        { label: 'Standart Sepet Siparişi', value: 'standard' },
        { label: 'Özel Tasarım Pasta Talebi', value: 'custom' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'customCakeDetails',
      type: 'group',
      admin: {
        condition: (data) => Boolean(data?.orderType === 'custom'),
        description: 'Müşterinin özel pasta talebine ait detaylar',
      },
      fields: [
        { name: 'cakeSize', type: 'number', label: 'Kişi Sayısı (Porsiyon)' },
        { name: 'spongeType', type: 'text', label: 'Kek Tipi' },
        { name: 'creamFlavor', type: 'text', label: 'Krema Aroması' },
        { name: 'note', type: 'textarea', label: 'Müşteri Notu' },
        { name: 'referenceImage', type: 'relationship', relationTo: 'media', label: 'Referans Görseli' },
      ]
    },
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
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
      name: 'iyzicoToken',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
  ],
}
