import type { CollectionConfig } from 'payload'

export const CustomCakes: CollectionConfig = {
  slug: 'custom-cakes',
  labels: {
    singular: 'Özel Pasta (Eski)',
    plural: 'Özel Pastalar (Eski)',
  },
  admin: {
    hidden: true, // Panelden gizlendi
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
