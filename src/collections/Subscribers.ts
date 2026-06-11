import { isAdmin } from '../access/isAdmin'
import type { CollectionConfig } from 'payload'

export const Subscribers: CollectionConfig = {
  access: {
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
    create: () => true,
  },
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
