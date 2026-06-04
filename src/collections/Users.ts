import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Kullanıcı',
    plural: 'Kullanıcılar',
  },
  admin: {
    useAsTitle: 'email',
    group: 'Site Yönetimi',
  },
  auth: true,
  fields: [
    // Email added by default
  ],
}
