import type { CollectionConfig } from 'payload'

export const Blog: CollectionConfig = {
  slug: 'blog',
  labels: {
    singular: 'Blog Yazısı',
    plural: 'Blog',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Site Yönetimi',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Başlık',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'content',
      type: 'textarea',
      label: 'İçerik',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Öne Çıkan Görsel',
    },
  ],
}
