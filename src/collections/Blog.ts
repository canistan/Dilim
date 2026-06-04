import type { CollectionConfig } from 'payload'
import { formatSlug } from '../utilities/formatSlug'

export const Blog: CollectionConfig = {
  slug: 'blog',
  labels: {
    singular: 'Blog Yazısı',
    plural: 'Blog',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Site Yönetimi',
    defaultColumns: ['title', 'image'],
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
      unique: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [formatSlug('title')],
      },
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
