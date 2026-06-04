import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { seoPlugin } from '@payloadcms/plugin-seo'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Categories } from './collections/Categories'
import { CustomCakes } from './collections/CustomCakes'
import { Orders } from './collections/Orders'
import { Blog } from './collections/Blog'
import { ContactMessages } from './collections/ContactMessages'
import { Homepage } from './globals/Homepage'

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
  collections: [Users, Media, Categories, Products, CustomCakes, Orders, Blog, ContactMessages],
  globals: [Homepage],
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
