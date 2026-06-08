import type { CollectionConfig } from 'payload'

export const Coupons: CollectionConfig = {
  slug: 'coupons',
  labels: {
    singular: 'Kupon',
    plural: 'Kuponlar',
  },
  admin: {
    useAsTitle: 'code',
    group: 'Yönetim',
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      label: 'Kupon Kodu',
    },
    {
      name: 'discountType',
      type: 'select',
      options: [
        { label: 'Yüzde (%)', value: 'percentage' },
        { label: 'Sabit Tutar (TL)', value: 'fixed' },
      ],
      required: true,
      label: 'İndirim Türü',
    },
    {
      name: 'discountValue',
      type: 'number',
      required: true,
      label: 'İndirim Değeri',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Aktif mi?',
    },
    {
      name: 'expiryDate',
      type: 'date',
      label: 'Son Kullanım Tarihi',
    },
    {
      name: 'minimumCartValue',
      type: 'number',
      label: 'Minimum Sepet Tutarı',
    },
  ],
}
