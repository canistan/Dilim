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
      minRows: 0,
      maxRows: 6,
      labels: {
        singular: 'Gönderi',
        plural: 'Gönderiler',
      },
      fields: [
        {
          name: 'image',
          label: 'Gönderi Görseli',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'link',
          label: 'Instagram Gönderi Linki',
          type: 'text',
          required: true,
          defaultValue: 'https://instagram.com/bi_dilimpasta',
        },
        {
          name: 'isReel',
          label: 'Bu bir Reels/Video mu?',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'İşaretlerseniz görselin üzerinde oynat (Play) ikonu çıkar.',
          },
        },
      ],
    },
  ],
}
