import type { CollectionConfig } from 'payload'

export const DeliveryZones: CollectionConfig = {
  slug: 'delivery-zones',
  labels: {
    singular: 'Teslimat Bölgesi',
    plural: 'Teslimat Bölgeleri',
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
      label: 'Bölge Adı (İlçe/Mahalle)',
    },
    {
      name: 'deliveryFee',
      type: 'number',
      required: true,
      label: 'Teslimat Ücreti (TL)',
      defaultValue: 0,
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Aktif mi?',
    },
    {
      name: 'branch',
      type: 'relationship',
      relationTo: 'branches',
      label: 'Hizmet Veren Şube',
      required: true,
    }
  ],
}
