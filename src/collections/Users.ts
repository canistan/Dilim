import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Yönetici',
    plural: 'Yöneticiler',
  },
  admin: {
    useAsTitle: 'email',
    group: 'Yönetim',
  },
  auth: true,
  fields: [
    // Email added by default
  ],
}
