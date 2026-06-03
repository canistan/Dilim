"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, ShoppingBag, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Sayfa kaydırıldığında header'ın daha transparan/sıkı hale gelmesi için
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Kurumsal', href: '/kurumsal' },
    { name: 'Ürünlerimiz', href: '/urunler' },
    { name: 'Kendi Pastanı Tasarla', href: '/tasarla', highlight: true },
    { name: 'İletişim', href: '/iletisim' },
  ]

  return (
    <>
      <header className={`fixed top-0 z-50 w-full transition-all duration-300 border-b ${scrolled ? 'bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-sm h-20' : 'bg-white/95 backdrop-blur-md border-transparent h-24'}`}>
        <div className="container mx-auto flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-2 group" onClick={() => setIsMobileMenuOpen(false)}>
              {/* Premium Typographic SVG Logo */}
              <div className="relative flex items-center justify-center">
                <Image 
                  src="/DilimLogo-transparent.png" 
                  alt="Dilim Logo" 
                  width={150} 
                  height={50} 
                  className="h-12 w-auto object-contain transform transition-transform group-hover:scale-105"
                  priority
                />
              </div>
            </Link>
            <nav className="hidden lg:flex gap-8 font-medium text-dilim-gri-koyu">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className={`relative group py-2 transition-colors hover:text-dilim-siyah ${link.highlight ? 'text-dilim-portakal font-semibold hover:text-dilim-turuncu' : ''}`}>
                  {link.name}
                  <span className={`absolute left-0 bottom-0 w-0 h-[2px] bg-dilim-portakal transition-all duration-300 ease-out group-hover:w-full ${link.highlight ? 'w-full opacity-30 group-hover:opacity-100' : ''}`}></span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2.5 rounded-full text-dilim-siyah hover:bg-gray-100/80 transition-colors hidden sm:block">
              <User className="h-5 w-5" />
            </button>
            <button className="p-2.5 rounded-full text-dilim-siyah hover:bg-gray-100/80 transition-colors relative group">
              <ShoppingBag className="h-5 w-5 transform transition-transform group-hover:scale-110" />
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-gradient-to-r from-dilim-portakal to-dilim-turuncu text-[10px] font-bold text-white flex items-center justify-center shadow-md border-2 border-white">0</span>
            </button>
            <button className="p-2.5 rounded-full lg:hidden text-dilim-siyah hover:bg-gray-100/80 transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Spacer so content doesn't get hidden behind fixed header initially */}
      <div className="h-24" />

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm lg:hidden"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white/95 backdrop-blur-xl z-[70] flex flex-col shadow-2xl lg:hidden border-l border-white/20"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100/50">
                <Image 
                  src="/DilimLogo-transparent.png" 
                  alt="Dilim Logo" 
                  width={120} 
                  height={40} 
                  className="h-10 w-auto object-contain"
                />
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 bg-gray-50 rounded-full text-dilim-siyah hover:bg-gray-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-8 px-6 flex flex-col gap-8">
                {navLinks.map((link, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={link.name}
                  >
                    <Link 
                      href={link.href} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-2xl tracking-tight block w-full border-b border-gray-100/50 pb-4 ${link.highlight ? 'text-dilim-portakal font-bold' : 'text-dilim-siyah font-medium'}`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="p-6 border-t border-gray-100/50 bg-gray-50/50">
                <button className="w-full flex items-center justify-center gap-3 py-4 bg-dilim-siyah rounded-2xl font-semibold text-white hover:bg-black transition-all mb-4 shadow-lg shadow-black/10">
                  <User className="h-5 w-5" /> Hesabım
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

