import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  labels: {
    singular: 'Müşteri',
    plural: 'Müşteriler',
  },
  admin: {
    useAsTitle: 'name', // email is default for auth collections but let's use name or email
    group: 'Müşteriler',
    defaultColumns: ['name', 'email', 'birthDate', 'provider', 'createdAt'],
  },
  auth: {
    // Disable password requirement for social login users if possible, or handle it by generating a random password
    // Actually Payload 3.0 auth requires password if using local strategy. 
    // We will generate a secure random password for OAuth users on creation.
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Ad Soyad',
    },
    {
      name: 'birthDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd MMM yyyy',
        },
      },
      label: 'Doğum Tarihi',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Telefon Numarası',
    },
    {
      name: 'provider',
      type: 'select',
      options: [
        { label: 'Google', value: 'google' },
        { label: 'Facebook', value: 'facebook' },
        { label: 'E-Posta', value: 'credentials' },
      ],
      defaultValue: 'credentials',
      admin: {
        position: 'sidebar',
      },
      label: 'Kayıt Yöntemi',
    },
    {
      name: 'providerAccountId',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      label: 'Sosyal ID',
    },
  ],
}
