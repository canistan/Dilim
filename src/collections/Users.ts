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
    {
      name: 'name',
      type: 'text',
      label: 'Ad Soyad',
      defaultValue: 'Yönetici',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Yetki Rolü',
      required: true,
      defaultValue: 'admin',
      options: [
        { label: 'Sistem Yöneticisi (Admin)', value: 'admin' },
        { label: 'İçerik Editörü', value: 'editor' },
        { label: 'Operasyon / Mutfak', value: 'kitchen' },
        { label: 'Şube Yöneticisi', value: 'branch' },
      ],
      admin: {
        description: 'Kullanıcının sistem üzerindeki yetkilerini belirler.',
      }
    },
    {
      name: 'branch',
      type: 'relationship',
      relationTo: 'branches',
      label: 'Bağlı Olduğu Şube',
      admin: {
        condition: (data) => Boolean(data?.role === 'branch'),
        description: 'Sadece "Şube Yöneticisi" rolü seçiliyse görünür ve çalışır.',
      }
    }
  ],
}
