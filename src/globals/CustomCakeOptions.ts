import type { GlobalConfig } from 'payload'

export const CustomCakeOptions: GlobalConfig = {
  slug: 'custom-cake-options',
  label: 'Kendi Pastanı Tasarla',
  admin: {
    group: 'Site Yönetimi',
    description: 'Kendi pastanı tasarla sayfasındaki dinamik seçenekleri (Boyut, Kek türü vb.) buradan yönetebilirsiniz.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Boyut Seçimi',
          fields: [
            {
              name: 'sizeOptions',
              type: 'array',
              label: 'Boyut Seçenekleri',
              fields: [
                { name: 'slugId', type: 'text', required: true, label: 'ID (örn: 6-8)' },
                { name: 'name', type: 'text', required: true, label: 'Başlık (örn: 6-8 Kişilik)' },
                { name: 'desc', type: 'text', required: true, label: 'Açıklama' },
                { name: 'price', type: 'text', required: true, label: 'Fiyat (örn: ₺850)' },
                { name: 'image', type: 'upload', relationTo: 'media', required: false, label: 'Görsel' }
              ]
            }
          ]
        },
        {
          label: 'Kek ve İçerik',
          fields: [
            {
              name: 'baseOptions',
              type: 'array',
              label: 'Kek (Sünger) Seçenekleri',
              fields: [
                { name: 'slugId', type: 'text', required: true, label: 'ID (örn: vanilla)' },
                { name: 'name', type: 'text', required: true, label: 'Başlık' },
                { name: 'desc', type: 'text', required: true, label: 'Açıklama' },
              ]
            },
            {
              name: 'fillingOptions',
              type: 'array',
              label: 'İçerik (Krema/Meyve) Seçenekleri',
              fields: [
                { name: 'slugId', type: 'text', required: true, label: 'ID (örn: choco-banana)' },
                { name: 'name', type: 'text', required: true, label: 'Başlık' },
                { name: 'desc', type: 'text', required: true, label: 'Açıklama' },
              ]
            }
          ]
        },
        {
          label: 'Dış Kaplama',
          fields: [
            {
              name: 'frostingOptions',
              type: 'array',
              label: 'Dış Kaplama Seçenekleri',
              fields: [
                { name: 'slugId', type: 'text', required: true, label: 'ID (örn: fondant)' },
                { name: 'name', type: 'text', required: true, label: 'Başlık' },
                { name: 'desc', type: 'text', required: true, label: 'Açıklama' },
              ]
            }
          ]
        }
      ]
    }
  ],
}
