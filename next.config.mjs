import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['iyzipay'],
  outputFileTracingIncludes: {
    '/api/**/*': [
      './node_modules/iyzipay/**/*',
      './node_modules/postman-request/**/*'
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'dilim.semsicanalbayrak.com',
      },
    ],
  },
}

export default withPayload(nextConfig)
