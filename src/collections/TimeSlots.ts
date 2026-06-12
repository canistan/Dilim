import type { CollectionConfig } from 'payload'

export const TimeSlots: CollectionConfig = {
  slug: 'time-slots',
  labels: {
    singular: 'Zaman Slotu',
    plural: 'Zaman Slotları',
  },
  admin: {
    useAsTitle: 'timeRange',
    group: 'Yönetim',
  },
  fields: [
    {
      name: 'timeRange',
      type: 'text',
      required: true,
      label: 'Saat Aralığı (Örn: 14:00 - 16:00)',
    },
    {
      name: 'capacity',
      type: 'number',
      required: true,
      label: 'Maksimum Sipariş Kapasitesi',
      admin: {
        description: 'Bu saat aralığı için mutfağın alabileceği maksimum sipariş sayısı.',
      }
    },
    {
      name: 'cutoffTime',
      type: 'text',
      label: 'Son Sipariş Saati (Cut-off)',
      admin: {
        description: 'Örn: 12:00. Bu saatten sonra bu slot aynı gün için kapanır.',
      }
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Aktif mi?',
    }
  ],
}
