import type { CollectionConfig } from 'payload'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: {
    singular: 'Abone',
    plural: 'Aboneler',
  },
  admin: {
    useAsTitle: 'email',
    group: 'Yönetim',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      label: 'E-Posta Adresi',
    },
    {
      name: 'source',
      type: 'text',
      defaultValue: 'footer',
      label: 'Kayıt Kaynağı',
    },
  ],
}
