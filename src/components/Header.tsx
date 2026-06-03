import Link from 'next/link'
import { Menu, ShoppingBag, User } from 'lucide-react'

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md">
      <div className="container mx-auto flex h-24 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-4xl font-extrabold tracking-tighter text-dilim-siyah" style={{ fontFamily: 'var(--font-montserrat)' }}>
              <span className="text-dilim-portakal">D</span>ilim
            </span>
          </Link>
          <nav className="hidden lg:flex gap-8 font-medium text-dilim-siyah">
            <Link href="/kurumsal" className="hover:text-dilim-portakal transition-colors">Kurumsal</Link>
            <Link href="/urunler" className="hover:text-dilim-portakal transition-colors">Ürünlerimiz</Link>
            <Link href="/tasarla" className="hover:text-dilim-portakal transition-colors font-bold">Kendi Pastanı Tasarla</Link>
            <Link href="/iletisim" className="hover:text-dilim-portakal transition-colors">İletişim</Link>
          </nav>
        </div>
        <div className="flex items-center gap-5">
          <button className="p-2 text-dilim-siyah hover:text-dilim-portakal transition-colors">
            <User className="h-6 w-6" />
          </button>
          <button className="p-2 text-dilim-siyah hover:text-dilim-portakal transition-colors relative">
            <ShoppingBag className="h-6 w-6" />
            <span className="absolute top-1 right-0 h-5 w-5 rounded-full bg-dilim-turuncu text-xs font-bold text-white flex items-center justify-center">0</span>
          </button>
          <button className="p-2 lg:hidden text-dilim-siyah">
            <Menu className="h-7 w-7" />
          </button>
        </div>
      </div>
    </header>
  )
}
