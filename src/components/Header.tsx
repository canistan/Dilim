"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, ShoppingBag, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { CartDrawer } from '@/components/CartDrawer'
import { useSession } from 'next-auth/react'

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { items, setIsCartOpen } = useCart()
  const { data: session, status } = useSession()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Sayfa kaydırıldığında header'ın daha transparan/sıkı hale gelmesi için
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Hakkımızda', href: '/hakkimizda' },
    { name: 'Ürünlerimiz', href: '/urunler' },
    { name: 'Kendi Pastanı Tasarla', href: '/tasarla', highlight: true },
    { name: 'Blog', href: '/blog' },
    { name: 'İletişim', href: '/iletisim' },
    { name: 'Menü', href: '/menu' },
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
                  src="/DilimPastLogo-final.png" 
                  alt="Dilim Logo" 
                  width={200} 
                  height={54} 
                  className="h-10 sm:h-12 w-auto object-contain transform transition-transform group-hover:scale-105"
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
            {mounted && status !== 'loading' && (
              session ? (
                <Link href="/hesabim" className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-dilim-siyah bg-gray-100 hover:bg-gray-200 transition-colors">
                  <User className="w-4 h-4" /> Hesabım
                </Link>
              ) : (
                <Link href="/giris" className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-dilim-siyah bg-gray-100 hover:bg-gray-200 transition-colors">
                  <User className="w-4 h-4" /> Giriş Yap
                </Link>
              )
            )}
            {mounted && pathname === '/menu' && (
              <a href="https://instagram.com/dilimpastaneleri" target="_blank" rel="noopener noreferrer" className="hidden lg:flex p-2.5 rounded-full text-dilim-siyah hover:text-dilim-portakal hover:bg-orange-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            )}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2.5 rounded-full text-dilim-siyah hover:bg-gray-100/80 transition-colors relative group"
            >
              <ShoppingBag className="h-5 w-5 transform transition-transform group-hover:scale-110" />
              {mounted && items.length > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-gradient-to-r from-dilim-portakal to-dilim-turuncu text-[10px] font-bold text-white flex items-center justify-center shadow-md border-2 border-white">{items.length}</span>
              )}
            </button>
            {mounted && pathname === '/menu' && (
              <a href="https://instagram.com/dilimpastaneleri" target="_blank" rel="noopener noreferrer" className="lg:hidden p-2.5 rounded-full text-dilim-siyah hover:text-dilim-portakal transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            )}
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
                  src="/DilimPastLogo-final.png" 
                  alt="Dilim Logo" 
                  width={200} 
                  height={54} 
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
                {mounted && status !== 'loading' && (
                  session ? (
                    <Link href="/hesabim" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 w-full p-4 rounded-xl bg-white border border-gray-200 text-dilim-siyah font-bold shadow-sm">
                      <User className="w-5 h-5 text-dilim-portakal" /> Hesabım
                    </Link>
                  ) : (
                    <Link href="/giris" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 w-full p-4 rounded-xl bg-white border border-gray-200 text-dilim-siyah font-bold shadow-sm">
                      <User className="w-5 h-5 text-dilim-portakal" /> Giriş Yap / Kayıt Ol
                    </Link>
                  )
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Drawer Component */}
      <CartDrawer />
    </>
  )
}

