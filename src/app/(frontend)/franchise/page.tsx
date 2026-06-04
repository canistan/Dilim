"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Store, TrendingUp, Users, CheckCircle2 } from 'lucide-react'

export default function FranchisePage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulated form submission
    setSubmitted(true)
  }

  return (
    <div className="container mx-auto px-4 py-20 max-w-5xl min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-dilim-siyah mb-6">Dilim Pastaneleri Franchise</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Yılların getirdiği ustalık ve marka güvencesiyle, kârlı ve prestijli bir işletmeye sahip olmak için Dilim ailesine katılın.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Neden Dilim? */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100">
            <h2 className="text-2xl font-bold text-dilim-siyah mb-6">Neden Dilim Pastaneleri?</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm text-dilim-portakal">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-dilim-siyah mb-1">Yüksek Kârlılık</h3>
                  <p className="text-gray-600 text-sm">Kanıtlanmış iş modelimiz ve geniş müşteri kitlemiz ile hızlı yatırım getirisi.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm text-dilim-portakal">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-dilim-siyah mb-1">Anahtar Teslim Kurulum</h3>
                  <p className="text-gray-600 text-sm">Mimari tasarımdan personel eğitimine kadar tüm süreçlerde merkez desteği.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm text-dilim-portakal">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-dilim-siyah mb-1">Sürekli Operasyonel Destek</h3>
                  <p className="text-gray-600 text-sm">Ürün tedariği, pazarlama kampanyaları ve denetim süreçlerinde kesintisiz destek.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8 bg-dilim-siyah text-white rounded-3xl">
            <h3 className="text-xl font-bold mb-4">Mevcut Şubelerimiz</h3>
            <ul className="space-y-3 font-light text-gray-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-dilim-portakal" /> Kavacık (Merkez)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-dilim-portakal" /> Ümraniye Şubesi</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-dilim-yaldiz" /> Beykoz Şubesi (Örnek Franchise)</li>
            </ul>
          </div>
        </motion.div>

        {/* Başvuru Formu */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-dilim-siyah mb-2">Başvurunuz Alındı!</h3>
                <p className="text-gray-600">Franchise talebiniz uzman ekibimize ulaştı. En kısa sürede sizinle iletişime geçeceğiz.</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-dilim-siyah mb-6">Ön Başvuru Formu</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Adınız Soyadınız</label>
                      <input required type="text" className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Telefon Numaranız</label>
                      <input required type="tel" className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">E-Posta Adresiniz</label>
                    <input required type="email" className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Düşündüğünüz Lokasyon (İlçe/Semt)</label>
                    <input required type="text" className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all" placeholder="Örn: Kadıköy / Moda" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Ticari Geçmişiniz / Yatırım Bütçeniz</label>
                    <textarea required className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all resize-none" rows={4} placeholder="Kısaca kendinizden ve yatırım planınızdan bahsedin..."></textarea>
                  </div>
                  <button type="submit" className="w-full bg-dilim-siyah text-white font-bold py-4 rounded-xl hover:bg-dilim-portakal transition-all duration-300 shadow-lg mt-4">
                    Başvuruyu Gönder
                  </button>
                  <p className="text-xs text-center text-gray-500 mt-4">
                    Gönder butonuna basarak <a href="/kvkk" className="text-dilim-portakal underline">KVKK Politikamızı</a> kabul etmiş sayılırsınız.
                  </p>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
