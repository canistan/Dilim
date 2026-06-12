import type { CollectionConfig } from 'payload'

export const CustomCakes: CollectionConfig = {
  access: {
    read: () => true,
  },
  slug: 'custom-cakes',
  labels: {
    singular: 'Özel Pasta',
    plural: 'Özel Pastalar',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Site Yönetimi',
    defaultColumns: ['image', 'title'],
    description: 'Fiyatı olmayan, kullanıcıların ilham alması için sergilenen özel tasarım pastalar.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Pasta Adı',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Görsel',
      required: false,
    },
  ],
}
