import type { CollectionConfig } from 'payload'
import { formatSlug } from '../utilities/formatSlug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Kategori',
    plural: 'Kategoriler',
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
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [formatSlug('title')],
      },
    },
    {
      name: 'seoData',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
        },
      ],
    },
  ],
}
