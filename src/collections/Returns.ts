import { isAdmin } from '../access/isAdmin'
import type { CollectionConfig } from 'payload'

export const Returns: CollectionConfig = {
  access: {
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
    create: () => true,
  },
  slug: 'returns',
  labels: {
    singular: 'İade/Hasar Talebi',
    plural: 'İade ve Hasar Talepleri',
  },
  admin: {
    useAsTitle: 'returnNumber',
    group: 'Kullanıcı Bilgi Deposu',
    defaultColumns: ['returnNumber', 'status', 'order', 'createdAt'],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Talep Detayları',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'order',
                  type: 'relationship',
                  relationTo: 'orders',
                  required: true,
                  label: 'İlgili Sipariş',
                  admin: { readOnly: true }
                },
                {
                  name: 'customer',
                  type: 'relationship',
                  relationTo: 'customers',
                  label: 'Müşteri',
                  admin: { readOnly: true }
                },
              ]
            },
            {
              name: 'reason',
              type: 'select',
              options: [
                { label: 'Ürün Hasarlı Geldi', value: 'damaged' },
                { label: 'Yanlış Ürün Gönderildi', value: 'wrong_item' },
                { label: 'Teslimat Çok Gecikti', value: 'late_delivery' },
                { label: 'Kalite/Lezzet Şikayeti', value: 'quality' },
                { label: 'Diğer', value: 'other' },
              ],
              required: true,
              label: 'Talep Nedeni',
              admin: { readOnly: true }
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              label: 'Açıklama',
              admin: { readOnly: true }
            },
          ]
        },
        {
          label: 'Görseller',
          fields: [
            {
              name: 'photos',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: 'Hasar Fotoğrafları',
              admin: { readOnly: true }
            },
          ]
        }
      ]
    },
    {
      name: 'returnNumber',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ value, operation }) => {
            if (operation === 'create' && !value) {
              return `RET-${Math.floor(1000 + Math.random() * 9000)}`
            }
            return value
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'İnceleniyor', value: 'pending' },
        { label: 'Kabul Edildi (İade Edilecek)', value: 'approved' },
        { label: 'Kısmi İade / Telafi', value: 'partial' },
        { label: 'Reddedildi', value: 'rejected' },
      ],
      admin: {
        position: 'sidebar',
      },
      label: 'Durum',
    },
  ],
}
