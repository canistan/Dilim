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
      name: 'selectedPosts',
      label: 'Seçili Instagram Gönderileri',
      type: 'json',
      required: false,
      admin: {
        components: {
          Field: '@/components/Admin/InstagramSelector#InstagramSelector',
        },
      },
    },
  ],
}
