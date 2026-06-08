"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Gift } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export function PromoPopup() {
  const [showPopup, setShowPopup] = useState(false)
  const { status } = useSession()

  useEffect(() => {
    // Sadece giriş yapmamış kullanıcılara ve oturum bilgisi yüklendiğinde göster.
    if (status === 'loading' || status === 'authenticated') return

    // Sadece ilk girişte veya 24 saatte bir göster (localStorage ile kontrol)
    const lastSeen = localStorage.getItem('dilim_promo_last_seen')
    const now = new Date().getTime()
    
    // Eğer hiç görmediyse veya üzerinden 24 saat (86400000 ms) geçtiyse
    if (!lastSeen || (now - parseInt(lastSeen)) > 86400000) {
      // Ziyaretçi siteye girdikten 5 saniye sonra çıksın
      const timer = setTimeout(() => {
        setShowPopup(true)
        localStorage.setItem('dilim_promo_last_seen', now.toString())
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [status])

  if (!showPopup) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden"
        >
          {/* Close Button */}
          <button 
            onClick={() => setShowPopup(false)}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/20 backdrop-blur-md hover:bg-white/40 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Banner / Graphic Area */}
          <div className="h-40 bg-dilim-siyah relative flex items-center justify-center overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-dilim-portakal/20 rounded-full blur-[50px] translate-x-1/2 -translate-y-1/2"></div>
            <Gift className="w-16 h-16 text-dilim-yaldiz relative z-10 animate-bounce" />
          </div>

          {/* Content */}
          <div className="p-8 text-center relative z-20">
            <h3 className="text-2xl font-bold font-serif text-dilim-siyah mb-3">Dilim Ailesine Katılın!</h3>
            <p className="text-gray-600 mb-8 font-light">
              Sitemize üye olun, sürpriz indirimlerden ve ilk alışverişinize özel kampanyalardan anında haberdar olun. Üstelik doğum günlerinizi asla unutmuyoruz!
            </p>

            <div className="space-y-3">
              <Link 
                href="/giris"
                onClick={() => setShowPopup(false)}
                className="w-full block py-4 bg-dilim-portakal text-white font-bold rounded-xl hover:bg-dilim-turuncu transition-colors shadow-lg shadow-dilim-portakal/30"
              >
                Hemen Üye Ol / Giriş Yap
              </Link>
              <button 
                onClick={() => setShowPopup(false)}
                className="w-full py-4 text-gray-500 font-medium hover:text-dilim-siyah transition-colors"
              >
                Belki Daha Sonra
              </button>
            </div>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
