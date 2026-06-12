import type { GlobalConfig } from 'payload'

export const InstagramFeedConfig: GlobalConfig = {
  access: {
    read: () => true,
  },
  slug: 'instagram-feed',
  label: 'Instagram Vitrini',
  admin: {
    group: 'Site Yönetimi',
    description: 'Ana sayfanın en altındaki Instagram vitrininde (6 adet) görünecek fotoğrafları buradan belirleyebilirsiniz.',
  },
  fields: [
    {
      name: 'posts',
      label: 'Instagram Gönderileri (Maksimum 6)',
      type: 'array',
      maxRows: 6,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Instagram Görseli',
        },
        {
          name: 'link',
          type: 'text',
          required: true,
          label: 'Instagram Gönderi Linki (URL)',
          defaultValue: 'https://instagram.com/dilimpastaneleri/',
        },
        {
          name: 'isReel',
          type: 'checkbox',
          label: 'Bu bir Reels videosu mu? (Üzerinde Play ikonu çıkar)',
          defaultValue: false,
        }
      ]
    },
  ],
}
