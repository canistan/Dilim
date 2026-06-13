'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { MapPin, Phone, Mail, Send, Clock, ChevronRight, Navigation } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'

export default function IletisimClient({ contactSettings, branches }: { contactSettings?: any, branches?: any[] }) {
  const { data: session } = useSession()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || ''
      }))
    }
  }, [session])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const res = await fetch('/api/contact-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject, // Even if there is no subject in schema, Payload ignores extra or we can append it
          message: formData.subject ? `Konu: ${formData.subject}\n\n${formData.message}` : formData.message,
        })
      })

      if (res.ok) {
        setIsSuccess(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        alert('Mesajınız gönderilirken bir hata oluştu.')
      }
    } catch (error) {
      console.error(error)
      alert('Beklenmeyen bir hata oluştu.')
    } finally {
      setIsSubmitting(false)
    }
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
              className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 lg:sticky lg:top-28 self-start"
            >
              {isSuccess ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-dilim-siyah mb-2">Mesajınız İletildi!</h3>
                  <p className="text-gray-600">En kısa sürede sizinle iletişime geçeceğiz.</p>
                  <button onClick={() => setIsSuccess(false)} className="mt-6 text-dilim-portakal font-semibold underline">Yeni bir mesaj gönder</button>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-serif font-bold text-dilim-siyah mb-8">Mesaj Gönderin</h2>
                  <form onSubmit={handleSubmit} className="space-y-6 mb-12">
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
                  disabled={isSubmitting}
                  className="w-full bg-dilim-siyah text-white font-bold py-4 rounded-xl hover:bg-dilim-portakal transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  {isSubmitting ? 'Gönderiliyor...' : 'Mesajı Gönder'}
                </button>
              </form>
              </>
              )}

              {/* Quick Actions */}
              <div className="pt-8 border-t border-gray-100">
                <h3 className="text-lg font-bold text-dilim-siyah mb-6">Daha Hızlı İletişim İçin</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a href={`tel:${contactSettings?.phone?.replace(/\s/g, '') || '+905059638021'}`} className="flex items-center gap-4 p-4 rounded-2xl bg-orange-50 hover:bg-orange-100 border border-orange-100 transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-dilim-portakal group-hover:scale-110 transition-transform">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Hemen Arayın</div>
                      <div className="font-bold text-dilim-siyah">{contactSettings?.phone || '0505 963 80 21'}</div>
                    </div>
                  </a>
                  <a href={contactSettings?.instagram ? `https://ig.me/m/${contactSettings.instagram.split('/').filter(Boolean).pop()}` : "https://ig.me/m/bi_dilimpasta"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-pink-50 hover:bg-pink-100 border border-pink-100 transition-colors group">
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
                  {branches?.length > 0 ? branches.map((branch: any) => (
                    <div key={branch.id} className="relative pl-8 border-l-2 border-dilim-portakal">
                      <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-white border-4 border-dilim-portakal"></div>
                      <div className="flex flex-col sm:flex-row gap-6 mb-6">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-dilim-siyah mb-3 flex items-center gap-2">
                            {branch.name}
                            {branch.isFranchise && (
                              <span className="text-xs font-semibold px-2 py-1 bg-dilim-portakal/10 text-dilim-portakal rounded-full">FRANCHISE</span>
                            )}
                          </h3>
                          <ul className="space-y-3 text-gray-600">
                            <li className="flex items-start gap-3">
                              <MapPin className="w-5 h-5 text-dilim-yaldiz shrink-0 mt-0.5" />
                              <span className="whitespace-pre-line">{branch.address}</span>
                            </li>
                            {branch.phone && (
                              <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-dilim-yaldiz shrink-0" />
                                <a href={`tel:${branch.phone.replace(/\\s/g, '')}`} className="hover:text-dilim-portakal transition-colors">{branch.phone}</a>
                              </li>
                            )}
                            {branch.workingHours && (
                              <li className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-dilim-yaldiz shrink-0" />
                                <span>{branch.workingHours}</span>
                              </li>
                            )}
                          </ul>
                        </div>
                        {branch.image && (
                          <div className="w-full sm:w-32 h-32 relative rounded-2xl overflow-hidden shrink-0 shadow-sm">
                            <Image src={branch.image.url} fill className="object-cover" alt={branch.name} />
                          </div>
                        )}
                      </div>
                      
                      {branch.googleMapsUrl && (
                        <div className="mt-4 flex justify-between items-center mb-2">
                          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-dilim-portakal animate-pulse"></span>
                            Harita
                          </span>
                          <a href={branch.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white border border-dilim-portakal text-dilim-portakal px-5 py-2 rounded-full text-xs font-bold hover:bg-dilim-portakal hover:text-white transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 group">
                            <Navigation className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Yol Tarifi Al
                          </a>
                        </div>
                      )}
                      
                      {branch.mapEmbedUrl && (
                        <div className="h-48 w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                          <iframe 
                            src={branch.mapEmbedUrl}
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen={true} 
                            loading="lazy" 
                          ></iframe>
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className="text-gray-500 py-8 text-center bg-gray-50 rounded-2xl border border-gray-100">
                      Şube bilgileri yakında eklenecektir.
                    </div>
                  )}
                </div>
              </div>

            </motion.div>

          </div>
        </div>
      </section>
    </div>
  )
}
