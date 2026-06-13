'use client'

import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Filter, ShoppingBag, Eye } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { QuickAddModal } from '@/components/QuickAddModal'
import STATIC_PRODUCTS from '@/data/products.json'

type Category = {
  id: string | number
  title: string
  slug: string
}

type Product = {
  id: string | number
  title: string
  slug: string
  price: number
  category: Category | string | number
  images?: any[]
  hasSizes?: boolean
  sizes?: { size: string; price: number }[]
}

function ProductsClientInner({
  categories,
  products,
  crossSellProducts = []
}: {
  categories: Category[]
  products: Product[]
  crossSellProducts?: any[]
}) {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('kategori') || 'all'
  const [activeCategorySlug, setActiveCategorySlug] = useState(initialCategory)
  const [quickAddProduct, setQuickAddProduct] = useState<any>(null)

  // URL değişirse state'i güncelle
  useEffect(() => {
    const cat = searchParams.get('kategori')
    if (cat) {
      setActiveCategorySlug(cat)
    }
  }, [searchParams])
  const { addToCart } = useCart()

  // Add "All" to categories
  const allCategories = [{ id: 'all', title: 'TÜMÜ', slug: 'all' }, ...categories]

  const filteredProducts = activeCategorySlug === 'all'
    ? products
    : products.filter((p) => {
        const catSlug = typeof p.category === 'object' ? p.category?.slug : p.category
        return catSlug === activeCategorySlug
      })

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
              {allCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategorySlug(cat.slug)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
                    activeCategorySlug === cat.slug
                      ? 'bg-gradient-to-r from-dilim-portakal to-dilim-turuncu text-white shadow-md transform scale-105'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {filteredProducts.map((product) => {
                const categoryObj = categories.find(c => c.id === (typeof product.category === 'object' ? product.category.id : product.category))
                const categoryName = typeof product.category === 'object' 
                  ? product.category.title 
                  : categoryObj?.title || 'Kategori'

                const productImage = Array.isArray(product.images) && product.images.length > 0 
                  ? (typeof product.images[0] === 'object' ? product.images[0].url : null) 
                  : null
                
                const imageToUse = productImage || categoryObj?.image || '/placeholder.png'

                return (
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
                      <Link href={`/urunler/${product.slug}`} className="absolute inset-0 z-0">
                        <Image
                          src={imageToUse}
                          alt={product.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                      </Link>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 z-10 pointer-events-none" />

                      {/* Hover Actions */}
                      <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                        <Link
                          href={`/urunler/${product.slug}`}
                          className="pointer-events-auto bg-white/95 backdrop-blur-sm text-dilim-siyah px-5 py-3 rounded-full font-semibold text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-100"
                        >
                          <Eye className="w-4 h-4" />
                          İncele
                        </Link>
                        {product.hasSizes ? (
                          <button
                            onClick={() => setQuickAddProduct({
                              id: product.id,
                              title: product.title,
                              slug: product.slug,
                              price: product.price,
                              image: imageToUse,
                              hasSizes: product.hasSizes,
                              sizes: product.sizes
                            })}
                            className="pointer-events-auto bg-dilim-portakal text-white px-5 py-3 rounded-full font-semibold text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-dilim-turuncu shadow-lg"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            Sepete Ekle
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              addToCart({
                                id: product.id.toString(),
                                name: product.title,
                                price: `₺${product.price}`,
                                image: imageToUse,
                                quantity: 1,
                              })
                            }
                            className="pointer-events-auto bg-dilim-portakal text-white px-5 py-3 rounded-full font-semibold text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-dilim-turuncu shadow-lg"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            Sepete Ekle
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="text-xs font-bold text-dilim-portakal mb-2 uppercase tracking-wider">
                        {categoryName}
                      </div>
                      <Link
                        href={`/urunler/${product.slug}`}
                        className="text-lg font-bold text-dilim-siyah leading-tight mb-4 flex-1 hover:text-dilim-portakal transition-colors"
                      >
                        {product.title}
                      </Link>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xl font-serif font-bold text-dilim-siyah">
                          {product.hasSizes && product.sizes && product.sizes.length > 0 
                            ? <span className="text-sm font-normal text-gray-500 block -mb-1">Başlayan fiyatlarla</span> 
                            : null}
                          {product.hasSizes && product.sizes && product.sizes.length > 0
                            ? `₺${Math.min(...product.sizes.map((s: any) => s.price))}`
                            : (product.price > 0 ? `₺${product.price}` : 'Özel Fiyat')}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500 font-light">
                Bu kategoride henüz ürün bulunmamaktadır.
              </p>
            </div>
          )}
        </div>
      </section>

      <QuickAddModal 
        product={quickAddProduct}
        isOpen={!!quickAddProduct}
        onClose={() => setQuickAddProduct(null)}
        crossSellProducts={crossSellProducts}
      />
    </div>
  )
}

export default function ProductsClient({
  categories,
  products,
  crossSellProducts = []
}: {
  categories: Category[]
  products: Product[]
  crossSellProducts?: any[]
}) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-dilim-portakal/30 border-t-dilim-portakal rounded-full animate-spin"></div>
      </div>
    }>
      <ProductsClientInner categories={categories} products={products} crossSellProducts={crossSellProducts} />
    </Suspense>
  )
}
