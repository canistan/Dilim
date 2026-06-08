import type { CollectionConfig } from 'payload'

export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  labels: {
    singular: 'Denetim İzi',
    plural: 'Denetim İzleri',
  },
  admin: {
    useAsTitle: 'action',
    group: 'Yönetim',
    // Bu tablo sadece okunabilir olmalı, adminlerin manuel log girmesi engellenmeli
  },
  access: {
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'action',
      type: 'text',
      required: true,
      label: 'İşlem',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'İşlemi Yapan Yönetici',
    },
    {
      name: 'details',
      type: 'json',
      label: 'Detaylar',
    },
  ],
}
