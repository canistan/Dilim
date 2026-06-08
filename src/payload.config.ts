import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Categories } from './collections/Categories'
import { Orders } from './collections/Orders'
import { Blog } from './collections/Blog'
import { ContactMessages } from './collections/ContactMessages'
import { Customers } from './collections/Customers'
import { Subscribers } from './collections/Subscribers'
import { AuditLogs } from './collections/AuditLogs'
import { Coupons } from './collections/Coupons'
import { Returns } from './collections/Returns'
import { Homepage } from './globals/Homepage'
import { BirthdayCampaign } from './globals/BirthdayCampaign'
import { About } from './globals/About'
import { CustomCakeOptions } from './globals/CustomCakeOptions'
import { ContactSettings } from './globals/ContactSettings'
import { InstagramFeedConfig } from './globals/InstagramFeed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '- Dilim Pastaneleri Yönetim',
      icons: [{ rel: 'icon', url: '/favicon.ico' }],
      openGraph: {
        images: [{ url: '/DilimPastLogo-final.png' }],
      },
    },
    components: {
      beforeNavLinks: [
        '/components/payload/PayloadLogo#Logo'
      ],
      graphics: {
        Logo: '/components/payload/PayloadLogo#Logo',
      },
    },
  },
  collections: [
    Users, 
    Customers,
    Products, 
    Categories, 
    Orders,
    Blog, 
    ContactMessages, 
    Media,
    Subscribers,
    AuditLogs,
    Coupons,
    Returns
  ],
  globals: [Homepage, BirthdayCampaign, About, CustomCakeOptions, ContactSettings, InstagramFeedConfig],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || process.env.POSTGRES_URL || '',
    },
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      clientUploads: true, // 4.5MB üzeri görseller için client-side upload
    }),
    seoPlugin({
      collections: ['products', 'categories', 'blog'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `${doc.title} | Dilim Pastaneleri`,
      generateDescription: ({ doc }) => {
        if (doc.description) return doc.description;
        if (doc.content) return String(doc.content).substring(0, 150) + '...';
        return 'Dilim Pastaneleri - Özel günlerinizi tatlandırın.';
      },
      tabbedUI: false,
    }),
  ],
})
