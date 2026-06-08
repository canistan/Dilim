"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, Heart, Star, CheckCircle2, Upload } from 'lucide-react'

export default function KariyerPage() {
  const [submitted, setSubmitted] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulated form submission
    setSubmitted(true)
  }

  return (
    <div className="container mx-auto px-4 py-20 max-w-5xl min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-dilim-siyah mb-6">Dilim Ailesine Katılın</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Yarım asırlık tecrübemiz ve güler yüzlü ekibimizle birlikte büyümek, kaliteyi misafirlerimize sunmak için sizi de aramızda görmek isteriz.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Neden Biz? */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100">
            <h2 className="text-2xl font-bold text-dilim-siyah mb-6">Neden Bizimle Çalışmalısınız?</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm text-dilim-portakal">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-dilim-siyah mb-1">Sıcak Bir Aile Ortamı</h3>
                  <p className="text-gray-600 text-sm">Biz sadece çalışma arkadaşı değil, ortak değerleri paylaşan büyük bir aileyiz.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm text-dilim-portakal">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-dilim-siyah mb-1">Kariyer Gelişimi</h3>
                  <p className="text-gray-600 text-sm">Eğitim programlarımızla mesleki yetkinliklerinizi artırır, terfi fırsatları sunarız.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm text-dilim-portakal">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-dilim-siyah mb-1">Güvenilir Çalışma Şartları</h3>
                  <p className="text-gray-600 text-sm">Düzenli çalışma saatleri, sosyal haklar ve kurumsal yapı güvencesiyle huzurlu bir ortam.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8 bg-dilim-siyah text-white rounded-3xl">
            <h3 className="text-xl font-bold mb-4">Açık Pozisyonlar</h3>
            <ul className="space-y-3 font-light text-gray-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-dilim-portakal" /> Servis Elemanı (Garson)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-dilim-portakal" /> Barista / Kahve Ustası</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-dilim-portakal" /> Mutfak Personeli (Aşçı / Tatlı Ustası)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-dilim-portakal" /> Tezgah Satış Temsilcisi</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-dilim-portakal" /> Motor Kurye</li>
            </ul>
            <p className="mt-6 text-sm text-gray-400">
              Listede olmayan bir pozisyon için de genel başvuru yapabilirsiniz.
            </p>
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
                <p className="text-gray-600">İş başvurunuz İnsan Kaynakları departmanımıza ulaştı. Özgeçmişiniz incelendikten sonra uygun bulunması halinde sizinle iletişime geçeceğiz.</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-dilim-siyah mb-6">İş Başvuru Formu</h3>
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
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Başvurulan Pozisyon</label>
                    <select required className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all bg-white">
                      <option value="">Lütfen seçiniz</option>
                      <option value="garson">Servis Elemanı (Garson)</option>
                      <option value="barista">Barista</option>
                      <option value="tezgah">Tezgah Satış Temsilcisi</option>
                      <option value="mutfak">Mutfak / İmalat Personeli</option>
                      <option value="kurye">Kurye</option>
                      <option value="genel">Genel Başvuru (Diğer)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">İş Tecrübeniz</label>
                    <textarea required className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all resize-none" rows={3} placeholder="Daha önceki çalıştığınız yerler ve süreleri..."></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">CV / Özgeçmiş (Opsiyonel)</label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="mb-1 text-sm text-gray-500 font-semibold">{file ? file.name : "Dosya Yüklemek İçin Tıklayın"}</p>
                          <p className="text-xs text-gray-500">PDF, DOC, DOCX (Maks. 5MB)</p>
                        </div>
                        <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                      </label>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-dilim-siyah text-white font-bold py-4 rounded-xl hover:bg-dilim-portakal transition-all duration-300 shadow-lg mt-4">
                    Başvuruyu Tamamla
                  </button>
                  <p className="text-xs text-center text-gray-500 mt-4">
                    Başvuru yaparak <a href="/kvkk" className="text-dilim-portakal underline">KVKK Politikamızı</a> kabul etmiş sayılırsınız.
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
