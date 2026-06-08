import type { CollectionConfig } from 'payload'

export const CustomCakes: CollectionConfig = {
  slug: 'custom-cakes',
  labels: {
    singular: 'Özel Pasta',
    plural: 'Özel Pastalar',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Kendi Pastanı Tasarla',
    defaultColumns: ['title', 'image'],
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
      required: true,
    },
  ],
}
