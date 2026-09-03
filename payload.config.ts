import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { seoPlugin } from '@payloadcms/plugin-seo'

import { Users } from './src/collections/Users'
import { Products } from './src/collections/Products'
import { Categories } from './src/collections/Categories'
import { CustomCakes } from './src/collections/CustomCakes'
import { Orders } from './src/collections/Orders'
import { Media } from './src/collections/Media'
import { Branches } from './src/collections/Branches'
import { DeliveryZones } from './src/collections/DeliveryZones'
import { TimeSlots } from './src/collections/TimeSlots'
import { Customers } from './src/collections/Customers'
import { Returns } from './src/collections/Returns'
import { Subscribers } from './src/collections/Subscribers'
import { ContactMessages } from './src/collections/ContactMessages'
import { AuditLogs } from './src/collections/AuditLogs'
import { Blog } from './src/collections/Blog'
import { JobApplications } from './src/collections/JobApplications'
import { FranchiseApplications } from './src/collections/FranchiseApplications'
import { Resumes } from './src/collections/Resumes'
import { Coupons } from './src/collections/Coupons'

import { About } from './src/globals/About'
import { BirthdayCampaign } from './src/globals/BirthdayCampaign'
import { ContactSettings } from './src/globals/ContactSettings'
import { CustomCakeOptions } from './src/globals/CustomCakeOptions'
import { Homepage } from './src/globals/Homepage'
import { InstagramFeedConfig } from './src/globals/InstagramFeed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users, Media, Categories, Products, CustomCakes, Orders, Branches,
    DeliveryZones, TimeSlots, Customers, Returns, Subscribers,
    ContactMessages, AuditLogs, Blog, JobApplications,
    FranchiseApplications, Resumes, Coupons
  ],
  globals: [
    About, BirthdayCampaign, ContactSettings, CustomCakeOptions, Homepage, InstagramFeedConfig
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'fallback-secret',
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || 'postgresql://postgres:postgres@localhost:5432/dilim',
    },
  }),
  plugins: [
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
    seoPlugin({
      collections: ['categories', 'products', 'custom-cakes', 'blog'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `Dilim Pastaneleri — ${doc.title}`,
      generateDescription: ({ doc }) => doc.excerpt || doc.description || '',
    }),
  ],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
