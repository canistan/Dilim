import type { GlobalConfig } from 'payload'

export const Homepage: GlobalConfig = {
  access: {
    read: () => true,
  },
  slug: 'homepage',
  label: 'Anasayfa Ayarları',
  admin: {
    group: 'Site Yönetimi',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero Alanı (Üst Kısım)',
          fields: [
            {
              name: 'heroTitle',
              type: 'text',
              label: 'Ana Başlık',
              defaultValue: 'Özel Anlarınıza Tatlı Bir Dokunuş',
            },
            {
              name: 'heroSubtitle',
              type: 'textarea',
              label: 'Alt Başlık',
              defaultValue: '2000 yılından beri en taze malzemelerle, en özel günleriniz için sanat eseri tadında lüks pastalar üretiyoruz.',
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Arka Plan Görseli',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'heroButton1Text',
                  type: 'text',
                  label: '1. Buton Yazısı',
                  defaultValue: 'Hemen Tasarla',
                  admin: { width: '50%' }
                },
                {
                  name: 'heroButton1Link',
                  type: 'text',
                  label: '1. Buton Linki',
                  defaultValue: '/tasarla',
                  admin: { width: '50%' }
                },
              ]
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'heroButton2Text',
                  type: 'text',
                  label: '2. Buton Yazısı',
                  defaultValue: 'Ürünleri İncele',
                  admin: { width: '50%' }
                },
                {
                  name: 'heroButton2Link',
                  type: 'text',
                  label: '2. Buton Linki',
                  defaultValue: '/urunler',
                  admin: { width: '50%' }
                },
              ]
            }
          ]
        },
        {
          label: 'Kategoriler & Önerilenler',
          fields: [
            {
              name: 'featuredSectionEyebrow',
              type: 'text',
              label: 'Üst Başlık (Eyebrow)',
              defaultValue: 'Seçimlerimiz',
            },
            {
              name: 'featuredSectionTitle',
              type: 'text',
              label: 'Ana Başlık',
              defaultValue: 'Sizin İçin Önerilenler',
            },
            {
              name: 'featuredProducts',
              type: 'relationship',
              relationTo: 'products' as any,
              hasMany: true,
              label: 'Öne Çıkan Ürünler (Seçerseniz alttaki sabit kartlar yerine bu ürünler gösterilir)',
            },
            {
              name: 'fallbackCards',
              type: 'array',
              label: 'Kategori Kartları (Öne çıkan ürün seçilmediğinde gösterilecekler)',
              minRows: 1,
              maxRows: 3,
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Kart Başlığı',
                  required: true,
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'Gidilecek Link',
                  required: true,
                },
                {
                  name: 'buttonText',
                  type: 'text',
                  label: 'Buton Yazısı',
                  required: true,
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Kart Görseli',
                  required: true,
                }
              ]
            }
          ]
        }
      ]
    }
  ],
}
