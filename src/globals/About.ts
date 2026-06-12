import type { GlobalConfig } from 'payload'

export const About: GlobalConfig = {
  slug: 'about-settings',
  label: 'Hakkımızda',
  admin: {
    group: 'Site Yönetimi',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero Alanı',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Hero Arkaplan Görseli',
              required: true,
            },
            {
              name: 'heroSubtitle',
              type: 'text',
              label: 'Hero Alt Başlık',
              required: true,
              defaultValue: "1977'den Beri",
            },
            {
              name: 'heroTitle',
              type: 'text',
              label: 'Hero Başlık',
              required: true,
              defaultValue: 'Hakkımızda',
            },
          ]
        },
        {
          label: 'Hikayemiz',
          fields: [
            {
              name: 'storyTitle',
              type: 'text',
              label: 'Hikaye Başlık (1. Satır)',
              required: true,
              defaultValue: "Kuzguncuk'tan Gelen",
            },
            {
              name: 'storySubtitle',
              type: 'text',
              label: 'Hikaye Alt Başlık (2. Satır İtalik)',
              required: true,
              defaultValue: 'Geleneksel Lezzet',
            },
            {
              name: 'storyContent',
              type: 'array',
              label: 'Hikaye Paragrafları',
              minRows: 1,
              fields: [
                {
                  name: 'paragraph',
                  type: 'textarea',
                  label: 'Paragraf (Kalın kelimeleri <strong>kelime</strong> şeklinde HTML ile yazabilirsiniz)',
                  required: true,
                }
              ]
            },
            {
              name: 'storyImage1',
              type: 'upload',
              relationTo: 'media',
              label: 'Hikaye Görseli 1 (Sol Üst - 4:5)',
              required: true,
            },
            {
              name: 'storyImage2',
              type: 'upload',
              relationTo: 'media',
              label: 'Hikaye Görseli 2 (Sol Alt - 1:1)',
              required: true,
            },
            {
              name: 'storyImage3',
              type: 'upload',
              relationTo: 'media',
              label: 'Hikaye Görseli 3 (Sağ Üst - 1:1)',
              required: true,
            },
            {
              name: 'storyImage4',
              type: 'upload',
              relationTo: 'media',
              label: 'Hikaye Görseli 4 (Sağ Alt - 4:5)',
              required: true,
            },
          ]
        },
        {
          label: 'Kurucu',
          fields: [
            {
              name: 'founderImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Kurucu Görseli',
              required: true,
            },
            {
              name: 'founderQuote',
              type: 'textarea',
              label: 'Kurucu Sözü',
              required: true,
            },
            {
              name: 'founderName',
              type: 'text',
              label: 'Kurucu Adı',
              required: true,
              defaultValue: 'Mehmet Şahin',
            },
            {
              name: 'founderTitle',
              type: 'text',
              label: 'Kurucu Unvanı',
              required: true,
              defaultValue: 'Dilim Pastaneleri Kurucusu',
            },
          ]
        },
        {
          label: 'Değerlerimiz',
          fields: [
            {
              name: 'valuesTitle',
              type: 'text',
              label: 'Değerler Başlığı',
              required: true,
              defaultValue: 'Değerlerimiz',
            },
            {
              name: 'values',
              type: 'array',
              label: 'Değerler Listesi',
              minRows: 1,
              maxRows: 4,
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  label: 'İkon',
                  required: true,
                  options: [
                    { label: 'Yıldız (Star)', value: 'star' },
                    { label: 'Kalp (Heart)', value: 'heart' },
                    { label: 'Ödül (Award)', value: 'award' },
                    { label: 'Kahve (Coffee)', value: 'coffee' },
                  ],
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Başlık',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Açıklama',
                  required: true,
                },
              ]
            }
          ]
        }
      ]
    }
  ],
}
