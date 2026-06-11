import type { CollectionConfig } from 'payload'
import { formatSlug } from '../utilities/formatSlug'

export const Categories: CollectionConfig = {
  access: {
    read: () => true,
  },
  slug: 'categories',
  labels: {
    singular: 'Kategori',
    plural: 'Kategoriler',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Yönetim',
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
        readOnly: true,
      },
      hooks: {
        beforeValidate: [formatSlug('title')],
      },
      index: true,
    },
  ],
}
