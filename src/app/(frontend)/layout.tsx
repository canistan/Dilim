import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../globals.css";

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CartProvider } from '@/context/CartContext'
import { CookiePopup } from '@/components/CookiePopup'
import { AuthProvider } from '@/components/AuthProvider'

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Dilim Pastaneleri | Lezzetin Adresi",
  description: "Özel anlarınıza eşlik eden eşsiz tatlar. Lüks yaş pasta, özel gün pastası ve geleneksel tatlılar için Dilim Pastaneleri.",
  icons: {
    icon: "/DilimPastLogo-final.png",
    apple: "/DilimPastLogo-final.png",
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
    index: false,
    follow: false,
  },
};

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
            <Footer />
            <CookiePopup />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
