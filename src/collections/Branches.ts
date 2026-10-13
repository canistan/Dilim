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
      label: 'Şube Sabit Telefonu',
    },
    {
      name: 'mobilePhone',
      type: 'text',
      label: 'Şube Cep Telefonu / WhatsApp',
      admin: {
        description: 'Hızlı arama ve WhatsApp bağlantısı için kullanılır.',
      },
    },
    {
      name: 'workingHours',
      type: 'text',
      label: 'Çalışma Saatleri',
      defaultValue: '05:00 - 23:30 (Haftanın Her Günü)',
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
    {
      name: 'coordinates',
      type: 'group',
      label: 'Konum Koordinatları',
      admin: { hidden: true },
      fields: [
        { name: 'lat', type: 'number' },
        { name: 'lng', type: 'number' },
      ],
    },
  ],
}
