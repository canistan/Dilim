import type { CollectionConfig } from 'payload'

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  labels: {
    singular: 'İletişim Mesajı',
    plural: 'İletişim Mesajları',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Kullanıcı Bilgi Deposu',
    defaultColumns: ['name', 'email', 'subject', 'message', 'createdAt'],
  },
  access: {
    create: () => true, // Herkes (Ziyaretçiler) mesaj gönderebilir
    read: ({ req: { user } }) => Boolean(user), // Sadece admin okuyabilir
    update: () => false, // Gelen mesaj sonradan değiştirilemez
    delete: ({ req: { user } }) => Boolean(user), // Sadece admin silebilir
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Mesaj Detayları',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'name', type: 'text', required: true, label: 'Ad Soyad', admin: { readOnly: true } },
                { name: 'email', type: 'email', required: true, label: 'E-posta', admin: { readOnly: true } },
                { name: 'phone', type: 'text', label: 'Telefon', admin: { readOnly: true } },
              ]
            },
            { name: 'subject', type: 'text', label: 'Konu', admin: { readOnly: true } },
            { name: 'message', type: 'textarea', required: true, label: 'Mesaj İçeriği', admin: { readOnly: true } },
          ]
        }
      ]
    }
  ],
}
