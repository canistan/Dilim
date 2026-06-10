import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Yönetim',
  },
  upload: {
    staticDir: process.env.NODE_ENV === 'production' ? '/tmp/media' : 'public/media',
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
    formatOptions: {
      format: 'webp',
      options: {
        quality: 80, // %80 kalite, SEO ve performans için ideal
      },
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
      }
    ]
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
}
