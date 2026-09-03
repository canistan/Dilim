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
  title: "Dilim Pastaneleri | Lezzetin Adresi",
  description: "Özel anlarınıza eşlik eden eşsiz tatlar. Lüks yaş pasta, özel gün pastası ve geleneksel tatlılar için Dilim Pastaneleri.",
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
