import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sayfa Bulunamadı | Dilim Pastaneleri',
  description: 'Aradığınız sayfaya ulaşılamadı.',
}

export default function NotFound() {
  return (
    <div className="flex-1 bg-gray-50 flex flex-col items-center justify-center py-24 px-4 min-h-[70vh]">
      <div className="max-w-xl w-full text-center bg-white p-12 sm:p-16 rounded-[3rem] shadow-xl border border-gray-100 relative overflow-hidden">
        
        {/* Dekoratif Arka Plan */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-dilim-portakal/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-dilim-turuncu/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="mb-8 flex justify-center">
            {/* 404 Tipografisi */}
            <h1 className="text-[8rem] sm:text-[10rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-dilim-portakal to-dilim-turuncu leading-none tracking-tighter drop-shadow-sm">
              404
            </h1>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-dilim-siyah mb-4">
            Eyvah, Dilim Kayboldu!
          </h2>
          
          <p className="text-gray-600 mb-10 text-lg">
            Aradığınız sayfayı bulamadık. Belki fırında unutulmuştur veya başka bir menüye taşınmıştır.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/" 
              className="px-8 py-4 bg-dilim-siyah text-white font-bold rounded-full hover:bg-gray-800 shadow-lg transition-all"
            >
              Ana Sayfaya Dön
            </Link>
            <Link 
              href="/urunler" 
              className="px-8 py-4 bg-dilim-portakal text-white font-bold rounded-full hover:bg-dilim-turuncu shadow-lg shadow-dilim-portakal/30 transition-all"
            >
              Lezzetleri Keşfet
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
