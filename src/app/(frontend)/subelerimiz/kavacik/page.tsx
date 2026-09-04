import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Clock, Navigation, Star, CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'Dilim Pastaneleri Kavacık Şubesi | Pasta Siparişi Kavacık Beykoz',
  description: 'Kavacık\'ta yaş pasta, doğum günü pastası, nişan pastası siparişi. Dilim Pastaneleri Kavacık şubesi adres, telefon ve çalışma saatleri.',
  alternates: {
    canonical: 'https://www.dilim.com.tr/subelerimiz/kavacik',
  },
  openGraph: {
    title: 'Dilim Pastaneleri Kavacık Şubesi',
    description: 'Kavacık\'ta yaş pasta, doğum günü pastası, nişan pastası siparişi.',
    url: 'https://www.dilim.com.tr/subelerimiz/kavacik',
    type: 'website',
  }
}

export default function KavacikSubePage() {
  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      
      {/* Hero Section */}
      <section className="relative w-full py-24 flex items-center justify-center bg-dilim-siyah overflow-hidden min-h-[400px]">
        <div className="absolute inset-0 opacity-40 bg-[url('/dilim-kavacik-sube.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60 z-10" />
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[1px] w-12 bg-dilim-yaldiz"></div>
            <span className="text-dilim-yaldiz font-semibold tracking-widest text-sm uppercase">Şubelerimiz</span>
            <div className="h-[1px] w-12 bg-dilim-yaldiz"></div>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight mb-6 drop-shadow-2xl">
            Dilim Pastaneleri Kavacık Şubesi
          </h1>
          <p className="text-gray-300 text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Kavacık ve Beykoz çevresine günlük, taze, lüks butik pastalar ve eşsiz tatlılar sunuyoruz. Yaş pasta, nişan pastası ve özel gün pastası siparişleriniz için hizmetinizdeyiz.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            
            {/* Contact & Map */}
            <div className="space-y-8">
              <div className="bg-gray-50 rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-serif font-bold text-dilim-siyah mb-8">İletişim Bilgilerimiz</h2>
                
                <ul className="space-y-6 text-gray-600">
                  <li className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-dilim-portakal shrink-0 mt-1" />
                    <div>
                      <strong className="block text-dilim-siyah mb-1">Adres</strong>
                      <span className="whitespace-pre-line">Rüzgarlıbahçe, Cumhuriyet Cd. No:10, 34805 Beykoz/İstanbul (Acarlar Plaza)</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-dilim-portakal shrink-0 mt-1" />
                    <div>
                      <strong className="block text-dilim-siyah mb-1">Telefon</strong>
                      <a href="tel:02164256114" className="hover:text-dilim-portakal transition-colors">(0216) 425 61 14</a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <Clock className="w-6 h-6 text-dilim-portakal shrink-0 mt-1" />
                    <div>
                      <strong className="block text-dilim-siyah mb-1">Çalışma Saatleri</strong>
                      <span>Her Gün: 08:00 - 23:30</span>
                    </div>
                  </li>
                </ul>
                
                <div className="mt-10">
                  <a href="https://maps.google.com/?cid=16198642051939109480" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-dilim-portakal text-white py-4 rounded-xl font-bold hover:bg-dilim-turuncu transition-colors shadow-lg hover:shadow-xl">
                    <Navigation className="w-5 h-5" />
                    Yol Tarifi Al
                  </a>
                </div>
              </div>
            </div>

            {/* Content & FAQ */}
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-serif font-bold text-dilim-siyah mb-6">Kavacık'ta Gerçek Lezzet</h2>
                <div className="prose prose-lg text-gray-600 font-light leading-relaxed">
                  <p>
                    2000 yılından bu yana Kavacık'ta hizmet veren şubemiz, bölgenin en sevilen lezzet durağı haline gelmiştir. Günlük üretim olan yaş pastalarımız, özel tasarım doğum günü pastalarımız ve geleneksel şerbetli tatlılarımızla özel anlarınıza eşlik ediyoruz.
                  </p>
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-500" /> Aynı gün teslimat seçeneği</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-500" /> %100 doğal malzemeler</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-500" /> Kavacık, Beykoz ve Acarkent bölgesine özel kurye</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-serif font-bold text-dilim-siyah mb-6">Sıkça Sorulan Sorular</h3>
                <div className="space-y-4">
                  <details className="group bg-gray-50 rounded-2xl border border-gray-100 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex items-center justify-between p-5 cursor-pointer font-bold text-dilim-siyah group-hover:text-dilim-portakal transition-colors">
                      <span>Kavacık dışına teslimatınız var mı?</span>
                      <span className="relative flex-shrink-0 ml-4 w-5 h-5 flex items-center justify-center">
                        <span className="absolute w-3 h-[2px] bg-current transition-transform duration-300 group-open:rotate-180"></span>
                        <span className="absolute w-[2px] h-3 bg-current transition-transform duration-300 group-open:rotate-90"></span>
                      </span>
                    </summary>
                    <div className="px-5 pb-5 text-gray-600 font-light text-sm leading-relaxed">
                      Evet, Kavacık merkezli olmak üzere Beykoz'un geneline, Acarkent'e ve çevre bölgelere teslimat yapmaktayız. Ayrıca Ümraniye şubemiz üzerinden de teslimat ağımızı genişletiyoruz.
                    </div>
                  </details>
                  <details className="group bg-gray-50 rounded-2xl border border-gray-100 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex items-center justify-between p-5 cursor-pointer font-bold text-dilim-siyah group-hover:text-dilim-portakal transition-colors">
                      <span>Özel sipariş pasta yapıyor musunuz?</span>
                      <span className="relative flex-shrink-0 ml-4 w-5 h-5 flex items-center justify-center">
                        <span className="absolute w-3 h-[2px] bg-current transition-transform duration-300 group-open:rotate-180"></span>
                        <span className="absolute w-[2px] h-3 bg-current transition-transform duration-300 group-open:rotate-90"></span>
                      </span>
                    </summary>
                    <div className="px-5 pb-5 text-gray-600 font-light text-sm leading-relaxed">
                      Elbette! Doğum günü, nişan, söz veya kurumsal etkinlikleriniz için özel tasarım pastalar üretiyoruz. Web sitemizdeki "Kendi Pastanı Tasarla" bölümünden veya şubemizi arayarak sipariş verebilirsiniz.
                    </div>
                  </details>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Bakery",
              "@id": "https://www.dilim.com.tr/subelerimiz/kavacik",
              "name": "Dilim Pastaneleri - Kavacık Şubesi",
              "alternateName": "Dilim Pasta Cafe Restoran",
              "url": "https://www.dilim.com.tr/subelerimiz/kavacik",
              "hasMap": "https://maps.google.com/?cid=16198642051939109480",
              "image": "https://www.dilim.com.tr/dilim-kavacik-sube.jpg",
              "telephone": "+902164256114",
              "priceRange": "₺₺",
              "servesCuisine": ["Pasta", "Yaş Pasta", "Tatlı", "Börek", "Cafe"],
              "menu": "https://www.dilim.com.tr/urunler",
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
                { "@type": "City", "name": "Acarkent" },
                { "@type": "City", "name": "İstanbul" }
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "3.8",
                "reviewCount": "307"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Kavacık dışına teslimatınız var mı?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Evet, Kavacık merkezli olmak üzere Beykoz'un geneline, Acarkent'e ve çevre bölgelere teslimat yapmaktayız."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Özel sipariş pasta yapıyor musunuz?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Elbette! Doğum günü, nişan, söz veya kurumsal etkinlikleriniz için özel tasarım pastalar üretiyoruz."
                  }
                }
              ]
            }
          ])
        }}
      />
    </div>
  )
}
