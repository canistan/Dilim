import type { CollectionConfig } from 'payload'

export const Branches: CollectionConfig = {
  slug: 'branches',
  labels: {
    singular: 'Şube',
    plural: 'Şubeler',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Yönetim',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Şube Adı',
    },
    {
      name: 'address',
      type: 'textarea',
      required: true,
      label: 'Açık Adres',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Şube Telefonu',
    },
    {
      name: 'workingHours',
      type: 'text',
      label: 'Çalışma Saatleri',
      defaultValue: '08:00 - 22:00',
    },
    {
      name: 'coordinates',
      type: 'group',
      label: 'Harita Koordinatları',
      fields: [
        { type: 'row', fields: [{ name: 'lat', type: 'number', label: 'Enlem (Lat)' }, { name: 'lng', type: 'number', label: 'Boylam (Lng)' }] }
      ]
    }
  ],
}
