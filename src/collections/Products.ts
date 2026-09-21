import type { CollectionConfig } from 'payload'
import { formatSlug } from '../utilities/formatSlug'
import { auditLogAfterChange, auditLogAfterDelete } from '../hooks/auditLogHook'
import { revalidatePath } from 'next/cache'

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
    defaultColumns: ['images', 'title', 'price', 'stock', 'category'],
    listSearchableFields: ['title', 'searchTitle'],
  },
  versions: {
    drafts: true,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Türkçe-dostu küçük harf dönüşümü (İ→i, I→ı, Ş→ş, Ç→ç, Ö→ö, Ü→ü, Ğ→ğ)
        if (data?.title) {
          data.searchTitle = data.title
            .replace(/İ/g, 'i')
            .replace(/I/g, 'ı')
            .replace(/Ş/g, 'ş')
            .replace(/Ç/g, 'ç')
            .replace(/Ö/g, 'ö')
            .replace(/Ü/g, 'ü')
            .replace(/Ğ/g, 'ğ')
            .toLowerCase()
        }
        return data
      },
    ],
    afterChange: [
      async (args) => auditLogAfterChange('Ürünler')(args),
      ({ doc }) => {
        try {
          revalidatePath('/urunler')
          revalidatePath('/')
        } catch (e) {
          // ignore error when running outside Next.js context
        }
        return doc
      }
    ],
    afterDelete: [
      async (args) => auditLogAfterDelete('Ürünler')(args),
      ({ doc }) => {
        try {
          revalidatePath('/urunler')
          revalidatePath('/')
        } catch (e) {
          // ignore error when running outside Next.js context
        }
        return doc
      }
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'searchTitle',
      type: 'text',
      admin: {
        hidden: true,
      },
      index: true,
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
      name: 'isActive',
      type: 'select',
      label: 'Sitede Görünme Durumu',
      defaultValue: 'active',
      options: [
        { label: 'Aktif (Sitede Görünür)', value: 'active' },
        { label: 'Pasif (Gizli)', value: 'passive' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Pasif seçilirse ürün müşterilere gösterilmez.',
      },
    },
    {
      name: 'hasNumberSelection',
      type: 'checkbox',
      label: 'Bu üründe rakam seçimi var mı (0-9)?',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'İşaretlenirse müşteri sepete eklerken rakam seçmek zorunda kalır.',
      },
    },
    {
      name: 'hasTextSelection',
      type: 'checkbox',
      label: 'Bu üründe yazı seçimi var mı (Pleksi)?',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'İşaretlenirse müşteri sepete eklerken özel yazı (İyi ki doğdun vb.) seçmek zorunda kalır.',
      },
    },
    {
      name: 'hasSizes',
      type: 'checkbox',
      label: 'Bu ürün farklı boyutlara/birimlere (0-1-2 Numara veya Paket/Kilo) sahip mi?',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'İşaretlenirse tek bir fiyat yerine boyutlara veya birimlere göre ayrı fiyatlar girilir.',
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
            { label: 'Paket (Adet)', value: 'Paket' },
            { label: '1 Kilogram', value: '1 Kilogram' },
            { label: '500 Gram', value: '500 Gram' },
            { label: '250 Gram', value: '250 Gram' },
            { label: 'Porsiyon (5 Adet)', value: 'Porsiyon' },
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
      admin: {
        components: {
          Cell: '@/components/Admin/ThumbnailCell#ThumbnailCell',
        },
      },
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
      name: 'isSameDayEligible',
      type: 'checkbox',
      label: 'Aynı Gün Teslimata Uygun',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Bu ürün aynı gün teslimat siparişleri için uygun mu?',
      }
    },
    {
      name: 'leadTime',
      type: 'number',
      label: 'Hazırlık Süresi (Saat)',
      defaultValue: 2,
      admin: {
        position: 'sidebar',
        description: 'Bu ürünün hazırlanması için gereken minimum süre.',
      }
    },
    {
      name: 'dailyProductionLimit',
      type: 'number',
      label: 'Günlük Üretim Limiti',
      admin: {
        position: 'sidebar',
        description: 'Boş bırakılırsa stok alanına göre sınırlandırılır.',
      }
    },
    {
      name: 'allergens',
      type: 'text',
      label: 'Alerjen Uyarıları',
      admin: {
        description: 'Örn: Süt, Yumurta, Fıstık içerir.',
      }
    },
    {
      name: 'ingredients',
      type: 'textarea',
      label: 'İçindekiler',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories' as any,
    },

  ],
}
