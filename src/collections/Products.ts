import type { CollectionConfig } from 'payload'
import { formatSlug } from '../utilities/formatSlug'

export const Products: CollectionConfig = {
  access: {
    read: () => true,
  },
  slug: 'products',
  labels: {
    singular: 'Ürün',
    plural: 'Ürünlerimiz',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Yönetim',
    defaultColumns: ['thumbnail', 'title', 'price', 'category'],
  },
  fields: [
    {
      name: 'thumbnail',
      type: 'ui',
      label: 'Görsel',
      admin: {
        components: {
          Field: () => null,
          Cell: '@/components/Admin/ThumbnailCell#ThumbnailCell',
        },
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [formatSlug('title')],
      },
      index: true,
    },
    {
      name: 'hasSizes',
      type: 'checkbox',
      label: 'Bu ürün boyutlara (0, 1, 2 Numara) sahip mi?',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'İşaretlenirse tek bir fiyat yerine boyutlara göre ayrı fiyatlar girilir.',
      },
    },
    {
      name: 'sizes',
      type: 'array',
      label: 'Boyutlar ve Fiyatlar',
      admin: {
        condition: (data) => Boolean(data?.hasSizes)
      },
      fields: [
        {
          name: 'size',
          type: 'select',
          label: 'Boyut Seçeneği',
          options: [
            { label: '0 Numara (4-6 Kişilik)', value: '0 Numara' },
            { label: '1 Numara (6-8 Kişilik)', value: '1 Numara' },
            { label: '2 Numara (8-10 Kişilik)', value: '2 Numara' },
          ],
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          label: 'Bu Boyut İçin Fiyat (₺)',
          required: true,
        }
      ]
    },
    {
      name: 'price',
      type: 'number',
      label: 'Fiyat (₺)',
      admin: {
        condition: (data) => !data?.hasSizes
      }
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'stock',
      type: 'number',
      label: 'Stok Adedi',
      defaultValue: 0,
      min: 0,
      admin: {
        position: 'sidebar',
        description: 'Stok 0 olduğunda ürün "Tükenmiş" olarak gösterilir.',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories' as any,
    },

  ],
}
