"use client"

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ShoppingBag, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Menü linkleri
  const navLinks = [
    { name: 'Kurumsal', href: '/kurumsal' },
    { name: 'Ürünlerimiz', href: '/urunler' },
    { name: 'Kendi Pastanı Tasarla', href: '/tasarla', highlight: true },
    { name: 'İletişim', href: '/iletisim' },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="container mx-auto flex h-24 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="text-4xl font-extrabold tracking-tighter text-dilim-siyah" style={{ fontFamily: 'var(--font-montserrat)' }}>
                <span className="text-dilim-portakal">D</span>ilim
              </span>
            </Link>
            <nav className="hidden lg:flex gap-8 font-medium text-dilim-siyah">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className={`hover:text-dilim-portakal transition-colors ${link.highlight ? 'font-bold' : ''}`}>
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <button className="p-2 text-dilim-siyah hover:text-dilim-portakal transition-colors hidden sm:block">
              <User className="h-6 w-6" />
            </button>
            <button className="p-2 text-dilim-siyah hover:text-dilim-portakal transition-colors relative">
              <ShoppingBag className="h-6 w-6" />
              <span className="absolute top-1 right-0 h-5 w-5 rounded-full bg-dilim-turuncu text-xs font-bold text-white flex items-center justify-center">0</span>
            </button>
            <button className="p-2 lg:hidden text-dilim-siyah" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-7 w-7" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm lg:hidden"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed right-0 top-0 bottom-0 w-[80%] max-w-sm bg-white z-[70] flex flex-col shadow-2xl lg:hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <span className="text-2xl font-extrabold tracking-tighter text-dilim-siyah">
                  <span className="text-dilim-portakal">D</span>ilim
                </span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 bg-gray-100 rounded-full text-dilim-siyah hover:bg-gray-200 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-xl ${link.highlight ? 'text-dilim-portakal font-extrabold' : 'text-dilim-siyah font-semibold'}`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <button className="w-full flex items-center justify-center gap-2 py-4 bg-white border border-gray-200 rounded-xl font-bold text-dilim-siyah hover:bg-gray-100 transition-colors mb-4">
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
