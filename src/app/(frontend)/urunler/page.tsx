'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Filter, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const CATEGORIES = [
  { id: 'all', name: 'TÜMÜ' },
  { id: 'yas-pastalar', name: 'YAŞ PASTALAR' },
  { id: 'ozel-gun', name: 'ÖZEL GÜN PASTALARI' },
  { id: 'tatlilar', name: 'TATLILAR' },
  { id: 'tek-pastalar', name: 'TEK PASTALAR' }
]

import PRODUCTS from '@/data/products.json'


export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredProducts = activeCategory === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory)

  return (
    <div className="flex flex-col w-full bg-gray-50 min-h-screen">
      
      {/* Hero Section */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center bg-dilim-siyah overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-gradient-to-b from-black/80 via-black/40 to-black/80 z-10" />
        <Image 
          src="/urunler_yas_pasta.png" 
          alt="Dilim Pastaneleri Ürünler" 
          fill
          priority
          className="object-cover object-center"
        />
        <div className="relative z-20 text-center px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white tracking-tight mb-4 shadow-black/50 drop-shadow-lg">
              Lezzet Koleksiyonumuz
            </h1>
            <p className="text-dilim-yaldiz text-lg md:text-xl font-light tracking-wide drop-shadow-md">
              Her dilimde mutluluk, her tatlıda ustalık.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filters */}
          <div className="flex flex-col items-center mb-16">
            <div className="flex items-center gap-2 mb-8 text-dilim-siyah">
              <Filter className="w-5 h-5 text-dilim-portakal" />
              <h2 className="text-2xl font-serif font-bold">Kategoriler</h2>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
                    activeCategory === cat.id 
                      ? 'bg-gradient-to-r from-dilim-portakal to-dilim-turuncu text-white shadow-md transform scale-105' 
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={product.id}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-50 border-b border-gray-100">
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      fill 
                      className="object-cover transform group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 z-10" />
                    
                    {/* Hover Action */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      <button className="bg-white/95 backdrop-blur-sm text-dilim-siyah px-6 py-3 rounded-full font-semibold text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-dilim-portakal hover:text-white">
                        <ShoppingBag className="w-4 h-4" />
                        Sepete Ekle
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="text-xs font-bold text-dilim-portakal mb-2 uppercase tracking-wider">
                      {CATEGORIES.find(c => c.id === product.category)?.name}
                    </div>
                    <h3 className="text-lg font-bold text-dilim-siyah leading-tight mb-4 flex-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xl font-serif font-bold text-dilim-siyah">
                        {product.price}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500 font-light">Bu kategoride henüz ürün bulunmamaktadır.</p>
            </div>
          )}

        </div>
      </section>

    </div>
  )
}
