import type { CollectionConfig } from 'payload'

export const FranchiseApplications: CollectionConfig = {
  slug: 'franchise-applications',
  labels: {
    singular: 'Franchise Başvurusu',
    plural: 'Franchise Başvuruları',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Kullanıcı Bilgi Deposu',
    defaultColumns: ['name', 'phone', 'location', 'createdAt'],
  },
  access: {
    create: () => true, // Herkes form doldurabilir
    read: ({ req: { user } }) => Boolean(user), // Sadece admin okuyabilir
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Kişisel Bilgiler',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Ad Soyad',
                },
                {
                  name: 'email',
                  type: 'email',
                  required: true,
                  label: 'E-Posta Adresi',
                },
                {
                  name: 'phone',
                  type: 'text',
                  required: true,
                  label: 'Telefon Numarası',
                },
              ]
            }
          ]
        },
        {
          label: 'Yatırım Detayları',
          fields: [
            {
              name: 'location',
              type: 'text',
              required: true,
              label: 'Düşünülen Şehir/İlçe (Lokasyon)',
            },
            {
              name: 'background',
              type: 'textarea',
              required: true,
              label: 'Ticari Geçmiş / Yatırım Bütçesi',
            },
            {
              name: 'hasStore',
              type: 'checkbox',
              label: 'Hazır Mağazanız Var mı?',
              defaultValue: false,
            }
          ]
        }
      ]
    }
  ],
}
