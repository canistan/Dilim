"use client"

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Coffee, Cake, ChevronRight } from 'lucide-react'

interface MenuClientProps {
  categories: any[]
  products: any[]
}

export default function MenuClient({ categories, products }: MenuClientProps) {
  // Only keep categories that have at least one product
  const activeCategories = useMemo(() => {
    return categories.filter(c => 
      products.some(p => {
        const catId = typeof p.category === 'object' ? p.category?.id : p.category
        return catId === c.id
      })
    )
  }, [categories, products])

  const [activeCatId, setActiveCatId] = useState<string>(activeCategories[0]?.id || '')

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const catId = typeof p.category === 'object' ? p.category?.id : p.category
      return catId === activeCatId
    })
  }, [products, activeCatId])

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white selection:bg-dilim-portakal selection:text-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[300px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        {/* Placeholder hero background */}
        <div className="absolute inset-0 bg-[url('/generated/hero_cake.png')] bg-cover bg-center opacity-40 blur-sm" />
        <div className="relative z-20 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-black mb-4 text-white tracking-tighter">KAFÉ MENÜSÜ</h1>
          <p className="text-gray-300 text-lg md:text-xl font-medium max-w-2xl mx-auto">Taptaze kahveler ve imza tatlılarımızla anın tadını çıkarın.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Category Nav */}
        {activeCategories.length > 0 && (
          <div className="flex overflow-x-auto hide-scrollbar gap-4 mb-12 pb-4 sticky top-[80px] z-30 bg-[#1a1a1a]/95 backdrop-blur-md pt-4">
            {activeCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCatId(cat.id)}
                className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all duration-300 ${
                  activeCatId === cat.id 
                    ? 'bg-dilim-portakal text-white shadow-lg shadow-orange-500/30 scale-105' 
                    : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#333] hover:text-white'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="group bg-[#2a2a2a] rounded-3xl p-4 md:p-6 flex gap-4 md:gap-6 hover:bg-[#333] transition-colors duration-300 border border-white/5 hover:border-dilim-portakal/30">
              {/* Product Image */}
              <div className="w-24 h-24 md:w-32 md:h-32 bg-[#1a1a1a] rounded-2xl overflow-hidden relative flex-shrink-0">
                {product.images && product.images.length > 0 ? (
                  <Image 
                    src={product.images[0].url || product.images[0]} 
                    alt={product.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/5">
                    <Coffee className="w-8 h-8 text-white/20" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col justify-center flex-1">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h3 className="text-lg md:text-xl font-bold text-white leading-tight">{product.title}</h3>
                  <span className="text-lg md:text-xl font-black text-dilim-portakal whitespace-nowrap">{product.price} ₺</span>
                </div>
                {product.description && (
                  <p className="text-sm md:text-base text-gray-400 line-clamp-2 leading-relaxed">{product.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-[#2a2a2a] rounded-3xl border border-white/5">
            <Coffee className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-gray-400 font-medium text-lg">Bu kategoride henüz ürün bulunmuyor.</p>
          </div>
        )}

        {/* Upsell to E-Commerce */}
        <Link href="/urunler" className="block mt-24">
          <div className="bg-gradient-to-r from-dilim-portakal to-[#ff6b00] rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('/generated/hero_cake.png')] bg-cover bg-center opacity-10 mix-blend-overlay group-hover:opacity-20 transition-opacity duration-500" />
            <div className="relative z-10">
              <Cake className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl md:text-4xl font-black mb-4">Özel Günleriniz İçin</h2>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto font-medium">Bu lezzetleri sadece dilim değil, bütün olarak da sipariş edebilirsiniz.</p>
              <div className="inline-flex items-center gap-2 bg-white text-dilim-siyah px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition-colors shadow-xl">
                Bütün Pastaları İncele
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
