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
      name: 'title',
      type: 'text',
      label: 'Sayfa Başlığı',
      defaultValue: 'Biz Kimiz?',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Hakkımızda İçeriği',
    },
    {
      name: 'vision',
      type: 'textarea',
      label: 'Vizyonumuz',
    },
    {
      name: 'mission',
      type: 'textarea',
      label: 'Misyonumuz',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Kapak Görseli',
    },
  ],
}
