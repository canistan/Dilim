"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X } from 'lucide-react'

export function CookiePopup() {
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    // Check if the user has already made a choice
    const consent = localStorage.getItem('dilim_cookie_consent')
    if (!consent) {
      // Small delay so it doesn't pop up instantly on initial load, feels more natural
      const timer = setTimeout(() => setShowPopup(true), 1500)
      
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    // Custom event listener to reopen popup from footer
    const handleOpenSettings = () => {
      setShowPopup(true)
    }

    window.addEventListener('openCookieSettings', handleOpenSettings)
    return () => window.removeEventListener('openCookieSettings', handleOpenSettings)
  }, [])

  const handleAccept = () => {
    localStorage.setItem('dilim_cookie_consent', 'accepted')
    setShowPopup(false)
  }

  const handleReject = () => {
    localStorage.setItem('dilim_cookie_consent', 'rejected')
    setShowPopup(false)
  }

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 pointer-events-none"
        >
          <div className="container mx-auto max-w-5xl pointer-events-auto">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-dilim-portakal/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>

              {/* Close Button (Mobile Top Right) */}
              <button 
                onClick={handleReject}
                className="absolute top-4 right-4 md:hidden text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start md:items-center gap-5 flex-1 pr-6 md:pr-0">
                <div className="w-12 h-12 rounded-full bg-dilim-portakal/10 flex items-center justify-center shrink-0">
                  <Cookie className="w-6 h-6 text-dilim-portakal" />
                </div>
                <div>
                  <h3 className="font-bold text-dilim-siyah text-lg mb-1">Çerez Tercihleriniz</h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-light">
                    Sizlere daha iyi ve kişiselleştirilmiş bir alışveriş deneyimi sunabilmek için web sitemizde çerezler (cookies) kullanıyoruz. Devam ederek çerez kullanımını kabul etmiş olursunuz. Detaylı bilgi için <a href="/kvkk" className="text-dilim-portakal underline hover:text-dilim-turuncu transition-colors font-medium">Gizlilik ve KVKK Politikamızı</a> inceleyebilirsiniz.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
                <button 
                  onClick={handleReject}
                  className="w-full sm:w-auto px-6 py-3 rounded-full border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  Sadece Gerekli
                </button>
                <button 
                  onClick={handleAccept}
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-dilim-portakal text-white font-bold text-sm hover:bg-dilim-turuncu transition-colors shadow-lg shadow-dilim-portakal/30"
                >
                  Tümünü Kabul Et
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
