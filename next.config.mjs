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
  // Eski (PHP) siteden kalan ve Search Console'da 404 görünen adresler → kalıcı (308) yönlendirme
  async redirects() {
    return [
      { source: '/urunler.php', destination: '/urunler', permanent: true },
      { source: '/siparis.php', destination: '/urunler', permanent: true },
      { source: '/subelerimiz.php', destination: '/iletisim', permanent: true },
      { source: '/subelerimiz', destination: '/iletisim', permanent: true },
      { source: '/index.php', destination: '/', permanent: true },
      { source: '/iletisim.php', destination: '/iletisim', permanent: true },
      { source: '/hakkimizda.php', destination: '/hakkimizda', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
        ],
      },
    ]
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
      {
        protocol: 'https',
        hostname: 'dilim.com.tr',
      },
      {
        protocol: 'https',
        hostname: 'www.dilim.com.tr',
      },
    ],
  },
}

export default withPayload(nextConfig)
