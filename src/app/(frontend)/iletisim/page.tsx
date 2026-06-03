'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MapPin, Phone, Mail, Send, Clock, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function IletisimPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const mailtoLink = `mailto:info@dilim.com.tr?subject=${encodeURIComponent(formData.subject || 'Dilim Pastaneleri İletişim Formu - ' + formData.name)}&body=${encodeURIComponent(`İsim: ${formData.name}\nE-posta: ${formData.email}\n\nMesaj:\n${formData.message}`)}`
    window.location.href = mailtoLink
  }

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      
      {/* Hero Section */}
      <section className="relative w-full py-24 flex items-center justify-center bg-dilim-siyah overflow-hidden min-h-[400px]">
        <div className="absolute inset-0 opacity-40 bg-[url('/hakkimizda_ic_mekan.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60 z-10" />
        
        <div className="relative z-20 text-center px-4 max-w-3xl mx-auto mt-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[1px] w-12 bg-dilim-yaldiz"></div>
            <span className="text-dilim-yaldiz font-semibold tracking-widest text-sm uppercase">Bize Ulaşın</span>
            <div className="h-[1px] w-12 bg-dilim-yaldiz"></div>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight mb-6 drop-shadow-2xl">
            Sizi Dinlemekten <br /> Mutluluk Duyarız
          </h1>
          <p className="text-gray-300 text-lg font-light leading-relaxed">
            Özel siparişleriniz, görüşleriniz veya şubelerimiz hakkında bilgi almak için bizimle iletişime geçebilirsiniz.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gray-50 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-20">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            
            {/* Left Column: Form and Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100"
            >
              <h2 className="text-3xl font-serif font-bold text-dilim-siyah mb-8">Mesaj Gönderin</h2>
              
              <form onSubmit={handleEmailSubmit} className="space-y-6 mb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adınız Soyadınız</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all"
                      placeholder="Örn: Ayşe Yılmaz"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-posta Adresiniz</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all"
                      placeholder="Örn: ayse@ornek.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Konu</label>
                  <input 
                    type="text" 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all"
                    placeholder="Örn: Özel Gün Pastası Siparişi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mesajınız</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Size nasıl yardımcı olabiliriz?"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-dilim-siyah text-white font-bold py-4 rounded-xl hover:bg-dilim-portakal transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  E-posta Olarak Gönder
                </button>
              </form>

              {/* Quick Actions */}
              <div className="pt-8 border-t border-gray-100">
                <h3 className="text-lg font-bold text-dilim-siyah mb-6">Daha Hızlı İletişim İçin</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a href="tel:02164256114" className="flex items-center gap-4 p-4 rounded-2xl bg-orange-50 hover:bg-orange-100 border border-orange-100 transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-dilim-portakal group-hover:scale-110 transition-transform">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Hemen Arayın</div>
                      <div className="font-bold text-dilim-siyah">0216 425 61 14</div>
                    </div>
                  </a>
                  <a href="https://ig.me/m/bi_dilimpasta" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-pink-50 hover:bg-pink-100 border border-pink-100 transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-pink-500 group-hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Instagram'dan</div>
                      <div className="font-bold text-dilim-siyah">Direkt Mesaj Atın</div>
                    </div>
                  </a>
                </div>
              </div>

            </motion.div>

            {/* Right Column: Contact Info & Branches */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <h2 className="text-2xl font-serif font-bold text-dilim-siyah mb-8">Şubelerimiz</h2>
                
                <div className="space-y-8">
                  {/* Ümraniye */}
                  <div className="relative pl-8 border-l-2 border-dilim-portakal">
                    <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-white border-4 border-dilim-portakal"></div>
                    <h3 className="text-xl font-bold text-dilim-siyah mb-3">Ümraniye Şubesi</h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-dilim-yaldiz shrink-0 mt-0.5" />
                        <span>Alemdağ Cad. No:123<br/>Ümraniye / İstanbul</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-dilim-yaldiz shrink-0" />
                        <a href="tel:02164256114" className="hover:text-dilim-portakal transition-colors">0216 425 61 14</a>
                      </li>
                      <li className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-dilim-yaldiz shrink-0" />
                        <span>08:00 - 22:00 (Haftanın Her Günü)</span>
                      </li>
                    </ul>
                  </div>

                  {/* Kavacık */}
                  <div className="relative pl-8 border-l-2 border-dilim-portakal">
                    <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-white border-4 border-dilim-portakal"></div>
                    <h3 className="text-xl font-bold text-dilim-siyah mb-3">Kavacık Şubesi</h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-dilim-yaldiz shrink-0 mt-0.5" />
                        <span>Rüzgarlıbahçe Mah. Cumhuriyet Cad. No: 10<br/>Acarlar İş Merkezi, Kavacık, Beykoz / İstanbul</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-dilim-yaldiz shrink-0" />
                        <a href="tel:02164256114" className="hover:text-dilim-portakal transition-colors">0216 425 61 14</a>
                      </li>
                      <li className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-dilim-yaldiz shrink-0" />
                        <span>08:00 - 22:00 (Haftanın Her Günü)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="bg-white rounded-3xl p-4 shadow-xl border border-gray-100 h-[400px] overflow-hidden relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.2045610015525!2d29.091176215383563!3d41.09633897929112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cacb001db166a9%3A0xc39f992a95c9a40!2sDilim%20Pastaneleri%20Kavac%C4%B1k!5e0!3m2!1str!2str!4v1684323214561!5m2!1str!2str" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, borderRadius: '1rem' }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 p-4"
                ></iframe>
              </div>

            </motion.div>

          </div>
        </div>
      </section>
    </div>
  )
}
