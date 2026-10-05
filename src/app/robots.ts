import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/hesabim', '/odeme', '/giris', '/kayit', '/sifre-sifirla', '/sifre-yenile'],
      },
    ],
    sitemap: 'https://www.dilim.com.tr/sitemap.xml',
  }
}
