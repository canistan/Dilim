import type { CollectionConfig } from 'payload'

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  labels: {
    singular: 'İletişim Mesajı',
    plural: 'İletişim Mesajları',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Site Yönetimi',
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => Boolean(user), // Only admin
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Ad Soyad' },
    { name: 'email', type: 'email', required: true, label: 'E-posta' },
    { name: 'phone', type: 'text', label: 'Telefon' },
    { name: 'message', type: 'textarea', required: true, label: 'Mesaj' },
  ],
}
