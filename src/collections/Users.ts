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
  auth: {
    maxLoginAttempts: 5,
    lockTime: 600000, // 10 minutes in ms
  },
  fields: [
    // Email added by default
  ],
}
