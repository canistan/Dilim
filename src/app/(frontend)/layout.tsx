import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../globals.css";
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CartProvider } from '@/context/CartContext'
import { CookiePopup } from '@/components/CookiePopup'
import { PromoPopup } from '@/components/PromoPopup'
import { AuthProvider } from '@/components/AuthProvider'
import { Toaster } from 'react-hot-toast'
import Script from 'next/script'

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.dilim.com.tr'),
  alternates: {
    canonical: '/',
  },
  title: "Dilim Pastaneleri | Kavacık & Ümraniye Pasta Siparişi",
  description: "Kavacık ve Ümraniye'de yaş pasta, doğum günü pastası, özel tasarım pasta siparişi. 1977'den beri taze ve doğal malzemelerle üretim. Aynı gün teslimat.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Dilim Pastaneleri | Lezzetin Adresi",
    description: "Özel anlarınıza eşlik eden eşsiz tatlar. Lüks yaş pasta ve tatlılar.",
    url: "https://www.dilim.com.tr",
    siteName: "Dilim Pastaneleri",
    images: [
      {
        url: "/urunler_yas_pasta.png",
        width: 1200,
        height: 630,
        alt: "Dilim Pastaneleri Yaş Pasta",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dilim Pastaneleri",
    description: "Özel anlarınıza eşlik eden eşsiz tatlar.",
    images: ["/urunler_yas_pasta.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'KTMZTaRLLTpB7lTBn1rE4KnZYJU3Yroxz5F5-zXj6xo',
  },
};

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const payload = await getPayload({ config: configPromise })
  const contactSettings = await payload.findGlobal({
    slug: 'contact-settings',
  })

  return (
    <html
      lang="tr"
      className={`${montserrat.variable} h-full antialiased`}
    >
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VZT513Y4FP"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VZT513Y4FP');
          `}
        </Script>
        <Script id="schema-org" type="application/ld+json" strategy="afterInteractive">
          {`
            {
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://www.dilim.com.tr/#organization",
                  "name": "Dilim Pastaneleri",
                  "url": "https://www.dilim.com.tr",
                  "logo": "https://www.dilim.com.tr/DilimPastLogo-final.png",
                  "sameAs": [
                    "https://www.instagram.com/dilimpastaneleri",
                    "https://www.facebook.com/share/1BQ7yRqh6n/?mibextid=wwXIfr",
                    "https://x.com/dilimpastanesi",
                    "https://www.tiktok.com/@dilimpastaneleri"
                  ]
                },
                {
                  "@type": "Bakery",
                  "@id": "https://www.dilim.com.tr/#bakery-kavacik",
                  "name": "Dilim Pastaneleri - Kavacık",
                  "alternateName": "Dilim Pasta Cafe Restoran",
                  "url": "https://www.dilim.com.tr",
                  "hasMap": "https://maps.google.com/?cid=16198642051939109480",
                  "image": "https://www.dilim.com.tr/dilim-kavacik-sube.jpg",
                  "telephone": "+902164256114",
                  "priceRange": "₺₺",
                  "servesCuisine": ["Pasta", "Yaş Pasta", "Tatlı", "Börek", "Cafe"],
                  "menu": "https://www.dilim.com.tr/urunler",
                  "acceptsReservations": false,
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Rüzgarlıbahçe, Cumhuriyet Cd. No:10 (Acarlar Plaza)",
                    "addressLocality": "Beykoz",
                    "postalCode": "34805",
                    "addressRegion": "İstanbul",
                    "addressCountry": "TR"
                  },
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 41.0948546,
                    "longitude": 29.0985319
                  },
                  "openingHoursSpecification": [
                    {
                      "@type": "OpeningHoursSpecification",
                      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
                      "opens": "08:00",
                      "closes": "23:30"
                    }
                  ],
                  "areaServed": [
                    { "@type": "City", "name": "Kavacık" },
                    { "@type": "City", "name": "Beykoz" },
                    { "@type": "City", "name": "Acarkent" }
                  ],
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "3.8",
                    "reviewCount": "307"
                  }
                },
                {
                  "@type": "Bakery",
                  "@id": "https://www.dilim.com.tr/#bakery-umraniye",
                  "name": "Dilim Pastaneleri - Ümraniye",
                  "alternateName": "Dilim Pasta & Cafe",
                  "url": "https://www.dilim.com.tr",
                  "hasMap": "https://maps.google.com/?cid=5071191567119623373",
                  "image": "https://www.dilim.com.tr/dilim-umraniye-sube.jpg",
                  "telephone": "+902166325731",
                  "priceRange": "₺₺",
                  "servesCuisine": ["Pasta", "Yaş Pasta", "Tatlı", "Börek", "Cafe"],
                  "menu": "https://www.dilim.com.tr/urunler",
                  "acceptsReservations": false,
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "İnkılap, Adem Yavuz Cd. 1/4",
                    "addressLocality": "Ümraniye",
                    "postalCode": "34766",
                    "addressRegion": "İstanbul",
                    "addressCountry": "TR"
                  },
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 41.032473,
                    "longitude": 29.103323
                  },
                  "openingHoursSpecification": [
                    {
                      "@type": "OpeningHoursSpecification",
                      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
                      "opens": "08:00",
                      "closes": "23:30"
                    }
                  ],
                  "areaServed": [
                    { "@type": "City", "name": "Ümraniye" }
                  ],
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "3.7",
                    "reviewCount": "532"
                  }
                },
                {
                  "@type": "Bakery",
                  "@id": "https://www.dilim.com.tr/#bakery-beykoz",
                  "name": "Dilim Pastaneleri - Beykoz",
                  "url": "https://www.dilim.com.tr",
                  "image": "https://www.dilim.com.tr/urunler_yas_pasta.png",
                  "telephone": "+905059638021",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Beykoz",
                    "addressRegion": "İstanbul",
                    "addressCountry": "TR"
                  }
                }
              ]
            }
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer contactSettings={contactSettings} />
            <CookiePopup />
            <PromoPopup />
            <Toaster position="bottom-center" toastOptions={{ duration: 3000, style: { background: '#1c1c1c', color: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '80px' } }} />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
