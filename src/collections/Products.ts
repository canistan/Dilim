import type { CollectionConfig } from 'payload'
import { formatSlug } from '../utilities/formatSlug'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Ürün',
    plural: 'Ürünlerimiz',
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
        readOnly: true,
      },
      hooks: {
        beforeValidate: [formatSlug('title')],
      },
      index: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories' as any,
    },
  ],
}
