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
      name: 'isFranchise',
      type: 'checkbox',
      label: 'Franchise Şubesi mi?',
      defaultValue: false,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Şube Görseli',
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
      defaultValue: '08:00 - 22:00 (Haftanın Her Günü)',
    },
    {
      name: 'googleMapsUrl',
      type: 'text',
      label: 'Google Maps Yol Tarifi Linki',
    },
    {
      name: 'mapEmbedUrl',
      type: 'text',
      label: 'Harita iframe (src URL)',
    },
  ],
}
