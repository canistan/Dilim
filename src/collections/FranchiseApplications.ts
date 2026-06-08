import type { CollectionConfig } from 'payload'

export const FranchiseApplications: CollectionConfig = {
  slug: 'franchise-applications',
  labels: {
    singular: 'Franchise Başvurusu',
    plural: 'Franchise Başvuruları',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Site Yönetimi',
    defaultColumns: ['name', 'phone', 'location', 'createdAt'],
  },
  access: {
    create: () => true, // Herkes form doldurabilir
    read: ({ req: { user } }) => Boolean(user), // Sadece admin okuyabilir
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Ad Soyad',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      label: 'Telefon Numarası',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'E-Posta Adresi',
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      label: 'Düşünülen Lokasyon',
    },
    {
      name: 'background',
      type: 'textarea',
      required: true,
      label: 'Ticari Geçmiş / Yatırım Bütçesi',
    },
  ],
}
