import type { CollectionConfig } from 'payload'
import { formatSlug } from '../utilities/formatSlug'

export const Blog: CollectionConfig = {
  access: {
    read: () => true,
  },
  slug: 'blog',
  labels: {
    singular: 'Blog Yazısı',
    plural: 'Blog',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Site Yönetimi',
    defaultColumns: ['image', 'title'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Başlık',
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
    },
    {
      name: 'content',
      type: 'richText',
      label: 'İçerik',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Öne Çıkan Görsel',
      admin: {
        components: {
          Cell: '@/components/Admin/ThumbnailCell#ThumbnailCell',
        },
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO Ayarları',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta Başlığı',
          admin: {
            description: 'Google arama sonuçlarında görünecek başlık. İdeal uzunluk 50-60 karakterdir.',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Açıklaması',
          admin: {
            description: 'Google arama sonuçlarında görünecek özet açıklama. İdeal uzunluk 150-160 karakterdir.',
          },
        },
        {
          name: 'metaKeywords',
          type: 'text',
          label: 'Meta Anahtar Kelimeler',
          admin: {
            description: 'Virgülle ayırarak giriniz (örn: pasta, çikolata, sipariş).',
          },
        },
      ],
    },
  ],
}
