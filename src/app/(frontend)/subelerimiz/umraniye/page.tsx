import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Clock, Navigation, Star, CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'Dilim Pastaneleri Ümraniye Şubesi | Pasta Siparişi Ümraniye',
  description: 'Ümraniye\'de yaş pasta, doğum günü pastası, nişan pastası siparişi. Dilim Pastaneleri Ümraniye şubesi adres, telefon ve çalışma saatleri.',
  alternates: {
    canonical: 'https://www.dilim.com.tr/subelerimiz/umraniye',
  },
  openGraph: {
    title: 'Dilim Pastaneleri Ümraniye Şubesi',
    description: 'Ümraniye\'de yaş pasta, doğum günü pastası, nişan pastası siparişi.',
    url: 'https://www.dilim.com.tr/subelerimiz/umraniye',
    type: 'website',
  }
}

export default function UmraniyeSubePage() {
  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      
      {/* Hero Section */}
      <section className="relative w-full py-24 flex items-center justify-center bg-dilim-siyah overflow-hidden min-h-[400px]">
        <div className="absolute inset-0 opacity-40 bg-[url('/dilim-umraniye-sube.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60 z-10" />
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[1px] w-12 bg-dilim-yaldiz"></div>
            <span className="text-dilim-yaldiz font-semibold tracking-widest text-sm uppercase">Şubelerimiz</span>
            <div className="h-[1px] w-12 bg-dilim-yaldiz"></div>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight mb-6 drop-shadow-2xl">
            Dilim Pastaneleri Ümraniye Şubesi
          </h1>
          <p className="text-gray-300 text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Ümraniye Eğitim ve Araştırma Hastanesi karşısında, 200m² modern imalathanemizle en taze lezzetleri sizlerle buluşturuyoruz.
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
                      <span className="whitespace-pre-line">İnkılap, Adem Yavuz Cd. 1/4, 34766 Ümraniye/İstanbul</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-dilim-portakal shrink-0 mt-1" />
                    <div>
                      <strong className="block text-dilim-siyah mb-1">Telefon</strong>
                      <a href="tel:02166325731" className="hover:text-dilim-portakal transition-colors">(0216) 632 57 31</a>
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
                  <a href="https://maps.google.com/?cid=5071191567119623373" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-dilim-portakal text-white py-4 rounded-xl font-bold hover:bg-dilim-turuncu transition-colors shadow-lg hover:shadow-xl">
                    <Navigation className="w-5 h-5" />
                    Yol Tarifi Al
                  </a>
                </div>
              </div>
            </div>

            {/* Content & FAQ */}
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-serif font-bold text-dilim-siyah mb-6">Ümraniye'de Kesintisiz Lezzet</h2>
                <div className="prose prose-lg text-gray-600 font-light leading-relaxed">
                  <p>
                    Artan talepler doğrultusunda açtığımız Ümraniye şubemiz, 200 m²’lik modern, hijyenik imalathanesiyle hizmet vermektedir. En özel anlarınızı tatlandıracak yaş pastalarımız, özel tasarım doğum günü pastalarımız ve enfes tatlı çeşitlerimizle sizlere ulaşıyoruz.
                  </p>
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-500" /> Ümraniye ve çevresi için aynı gün teslimat</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-500" /> %100 doğal malzemelerle üretim</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-500" /> Geniş modern imalathane</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-serif font-bold text-dilim-siyah mb-6">Sıkça Sorulan Sorular</h3>
                <div className="space-y-4">
                  <details className="group bg-gray-50 rounded-2xl border border-gray-100 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex items-center justify-between p-5 cursor-pointer font-bold text-dilim-siyah group-hover:text-dilim-portakal transition-colors">
                      <span>Ümraniye çevresinde nerelere teslimatınız var?</span>
                      <span className="relative flex-shrink-0 ml-4 w-5 h-5 flex items-center justify-center">
                        <span className="absolute w-3 h-[2px] bg-current transition-transform duration-300 group-open:rotate-180"></span>
                        <span className="absolute w-[2px] h-3 bg-current transition-transform duration-300 group-open:rotate-90"></span>
                      </span>
                    </summary>
                    <div className="px-5 pb-5 text-gray-600 font-light text-sm leading-relaxed">
                      Ümraniye merkez, Çakmak, Tepeüstü, Şerifali ve yakın semtlere aynı gün özel kurye ile pasta ve tatlı teslimatı gerçekleştirmekteyiz.
                    </div>
                  </details>
                  <details className="group bg-gray-50 rounded-2xl border border-gray-100 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex items-center justify-between p-5 cursor-pointer font-bold text-dilim-siyah group-hover:text-dilim-portakal transition-colors">
                      <span>Kurumsal sipariş alıyor musunuz?</span>
                      <span className="relative flex-shrink-0 ml-4 w-5 h-5 flex items-center justify-center">
                        <span className="absolute w-3 h-[2px] bg-current transition-transform duration-300 group-open:rotate-180"></span>
                        <span className="absolute w-[2px] h-3 bg-current transition-transform duration-300 group-open:rotate-90"></span>
                      </span>
                    </summary>
                    <div className="px-5 pb-5 text-gray-600 font-light text-sm leading-relaxed">
                      Evet. Ümraniye imalathanemizin yüksek kapasitesi sayesinde iş yerleri, ofisler, hastaneler ve kurumsal etkinlikleriniz için yüksek adetli pasta, tatlı veya kuru pasta siparişi alabilmekteyiz.
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
              "@id": "https://www.dilim.com.tr/subelerimiz/umraniye",
              "name": "Dilim Pastaneleri - Ümraniye Şubesi",
              "alternateName": "Dilim Pasta & Cafe",
              "url": "https://www.dilim.com.tr/subelerimiz/umraniye",
              "hasMap": "https://maps.google.com/?cid=5071191567119623373",
              "image": "https://www.dilim.com.tr/dilim-umraniye-sube.jpg",
              "telephone": "+902166325731",
              "priceRange": "₺₺",
              "servesCuisine": ["Pasta", "Yaş Pasta", "Tatlı", "Börek", "Cafe"],
              "menu": "https://www.dilim.com.tr/urunler",
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
                { "@type": "City", "name": "Ümraniye" },
                { "@type": "City", "name": "İstanbul" }
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "3.7",
                "reviewCount": "532"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Ümraniye çevresinde nerelere teslimatınız var?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ümraniye merkez, Çakmak, Tepeüstü, Şerifali ve yakın semtlere aynı gün özel kurye ile pasta ve tatlı teslimatı gerçekleştirmekteyiz."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Kurumsal sipariş alıyor musunuz?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Evet. Ümraniye imalathanemizin yüksek kapasitesi sayesinde iş yerleri, ofisler, hastaneler ve kurumsal etkinlikleriniz için yüksek adetli pasta, tatlı veya kuru pasta siparişi alabilmekteyiz."
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
