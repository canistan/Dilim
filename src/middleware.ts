import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware: Canonical domain redirect
 * 
 * Redirects all traffic from legacy domains (dilimpastaneleri.com, dilimpastaneleri.com.tr)
 * to the canonical domain (www.dilim.com.tr) with a 301 permanent redirect.
 * This prevents duplicate content SEO penalties from Google/Bing/Yandex.
 */
export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''

  // List of legacy/non-canonical domains that should redirect
  const legacyDomains = [
    'dilimpastaneleri.com',
    'www.dilimpastaneleri.com',
    'dilimpastaneleri.com.tr',
    'www.dilimpastaneleri.com.tr',
    'dilim.com.tr', // non-www version should also redirect to www
  ]

  if (legacyDomains.includes(hostname.toLowerCase())) {
    const url = new URL(request.url)
    // Preserve the original path and query string
    const redirectUrl = `https://www.dilim.com.tr${url.pathname}${url.search}`
    return NextResponse.redirect(redirectUrl, 301)
  }

  return NextResponse.next()
}

// Run middleware on all routes except static files and API
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.png|api/media).*)',
  ],
}
