"use client"

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    question: "Siparişimi ne kadar sürede teslim ediyorsunuz?",
    answer: "Standart ürün siparişleriniz İstanbul içi özel kuryelerimizle belirlediğiniz tarih ve saat diliminde teslim edilmektedir. Özel tasarım yaş pasta siparişleriniz için lütfen en az 3 gün önceden bizimle iletişime geçiniz."
  },
  {
    question: "Özel tasarım (Custom) pasta siparişi nasıl verebilirim?",
    answer: "Menüde yer alan 'Kendi Pastanı Tasarla' sayfasından tasarım detaylarını, porsiyon sayısını ve referans görselinizi yükleyerek talep oluşturabilirsiniz. Ekibimiz talebinizi inceleyip en kısa sürede size fiyat ve süre onayı için dönüş yapacaktır."
  },
  {
    question: "Kullanılan malzemeleriniz helal sertifikalı mıdır?",
    answer: "Evet, Dilim Pastaneleri olarak üretimimizde kullandığımız tüm hammaddeler (çikolata, süt ürünleri, un, meyveler vb.) birinci kalite olup tamamen helal sertifikalı üreticilerden temin edilmektedir. Kesinlikle domuz yağı veya katkıları içermemektedir."
  },
  {
    question: "Pastalarınızda katkı maddesi kullanıyor musunuz?",
    answer: "Tüm ürünlerimiz günlük olarak, hiçbir kimyasal koruyucu ve raf ömrü uzatıcı katkı maddesi kullanılmadan geleneksel pastacılık yöntemleriyle, usta ellerde butik olarak üretilmektedir."
  },
  {
    question: "Teslimat ücretli mi?",
    answer: "İstanbul içi Beykoz, Kavacık ve Ümraniye bölgelerine teslimat ücretsizdir. Diğer bölgeler için uzaklığa bağlı olarak sembolik kurye ücretleri sipariş onay ekranında sepetinize yansıtılır."
  },
  {
    question: "Siparişimi iptal edebilir miyim?",
    answer: "Standart ürün siparişlerinizi teslimat saatinden en geç 24 saat önce iptal edebilirsiniz. Özel tasarım (butik) pastalarda ise üretime başlanmışsa iptal işlemi yapılamamaktadır. Detaylar için İptal ve İade Koşulları sayfamızı inceleyebilirsiniz."
  }
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="flex flex-col w-full bg-gray-50 min-h-screen pb-24">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-sm text-gray-500 font-medium">
            <Link href="/" className="hover:text-dilim-portakal transition-colors">Anasayfa</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-dilim-siyah">Sık Sorulan Sorular</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-dilim-siyah py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-dilim-portakal/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Size Nasıl Yardımcı Olabiliriz?</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">En çok merak edilen soruları sizin için derledik. Aradığınız cevabı bulamazsanız, bizimle iletişime geçmekten çekinmeyin.</p>
        </div>
      </div>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 md:p-12 border border-gray-100">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className={`border rounded-2xl transition-all duration-300 ${openIndex === index ? 'border-dilim-portakal bg-orange-50/30' : 'border-gray-200 hover:border-dilim-portakal/50'}`}
              >
                <button
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <h3 className={`font-bold text-lg ${openIndex === index ? 'text-dilim-portakal' : 'text-dilim-siyah'}`}>
                    {faq.question}
                  </h3>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 text-dilim-portakal shrink-0 ${openIndex === index ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-0 text-gray-600 leading-relaxed font-light">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-dilim-portakal/10 rounded-2xl text-center">
            <h4 className="text-xl font-bold text-dilim-siyah mb-2">Başka bir sorunuz mu var?</h4>
            <p className="text-gray-600 mb-6">Müşteri hizmetleri ekibimiz size yardımcı olmaktan mutluluk duyacaktır.</p>
            <Link href="/iletisim" className="inline-block bg-dilim-siyah text-white font-bold py-3 px-8 rounded-full hover:bg-gray-800 transition-colors">
              İletişime Geçin
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
