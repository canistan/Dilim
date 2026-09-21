'use client'

import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Filter, ShoppingBag, Eye, PaintBucket, Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { QuickAddModal } from '@/components/QuickAddModal'
import { CrossSellModal } from '@/components/CrossSellModal'
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
  hasNumberSelection?: boolean
  hasTextSelection?: boolean
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
  const [searchQuery, setSearchQuery] = useState('')
  const [subFilter, setSubFilter] = useState('tumu') // Alt filtre state
  const [quickAddProduct, setQuickAddProduct] = useState<any>(null)
  
  const [showCrossSell, setShowCrossSell] = useState(false)
  const [addedProductForCrossSell, setAddedProductForCrossSell] = useState<any>(null)

  // URL değişirse state'i güncelle
  useEffect(() => {
    const cat = searchParams.get('kategori')
    if (cat) {
      setActiveCategorySlug(cat)
    }
  }, [searchParams])
  const { addToCart, setIsCartOpen } = useCart()

  // Türkçe-dostu küçük harf dönüşümü
  const turkishLower = (str: string) => {
    return str
      .replace(/İ/g, 'i')
      .replace(/I/g, 'ı')
      .replace(/Ş/g, 'ş')
      .replace(/Ç/g, 'ç')
      .replace(/Ö/g, 'ö')
      .replace(/Ü/g, 'ü')
      .replace(/Ğ/g, 'ğ')
      .toLowerCase()
  }

  // Add "All" to categories
  const allCategories = [{ id: 'all', title: 'TÜMÜ', slug: 'all' }, ...categories]

  const filteredProducts = products.filter((p) => {
    // Kategori filtresi
    const matchesCategory = activeCategorySlug === 'all' || (() => {
      const catSlug = typeof p.category === 'object' ? p.category?.slug : p.category
      return catSlug === activeCategorySlug
    })()

    // Arama filtresi (Türkçe-dostu)
    const matchesSearch = !searchQuery.trim() || (() => {
      const query = turkishLower(searchQuery.trim())
      const title = turkishLower(p.title)
      return title.includes(query)
    })()

    // Alt filtre (Şerbetli tatlılar, Sütlü Tatlılar vs)
    let matchesSub = true
    if (subFilter !== 'tumu') {
      const title = turkishLower(p.title)
      const sub = subFilter

      if (sub === turkishLower('Cheesecake Dilim')) {
        matchesSub = title.includes('cheesecake')
      } else if (sub === turkishLower('Cevizli Seçenekler')) {
        matchesSub = title.includes('ceviz')
      } else if (sub === turkishLower('Fıstıklı Seçenekler')) {
        matchesSub = title.includes('fıstık') || title.includes('havuç') || title.includes('şöbiyet') || title.includes('burma') || title.includes('midye')
      } else if (sub === turkishLower('Fındıklı Seçenekler')) {
        matchesSub = title.includes('fındık') || title.includes('nuriye') || title.includes('yalova')
      } else {
        matchesSub = title.includes(sub)
      }
    }

    return matchesCategory && matchesSearch && matchesSub
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
          {/* Search Bar */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-dilim-portakal" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ürün ara... (ör: baklava, poğaça, çikolata)"
                className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl text-dilim-siyah placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-dilim-portakal/30 focus:border-dilim-portakal/50 transition-all duration-300 text-base font-light"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-dilim-portakal transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

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
                  onClick={() => {
                    setActiveCategorySlug(cat.slug)
                    setSubFilter('tumu') // Kategori değiştiğinde alt filtreyi sıfırla
                  }}
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

            {/* Alt Filtre (Sütlü ve Şerbetli Tatlılar İçin) */}
            <AnimatePresence>
              {(() => {
                const activeCatObj = allCategories.find(c => c.slug === activeCategorySlug);
                const isSerbetli = activeCatObj?.title?.toUpperCase().includes('ŞERBETLİ');
                const isSutlu = activeCatObj?.title?.toUpperCase().includes('SÜTLÜ');
                
                if (!isSerbetli && !isSutlu) return null;

                return (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="flex justify-center gap-2 flex-wrap overflow-hidden"
                  >
                    {(isSerbetli 
                      ? ['Tümü', 'Cevizli Seçenekler', 'Fıstıklı Seçenekler', 'Fındıklı Seçenekler']
                      : ['Tümü', 'Cheesecake Dilim']
                    ).map(filter => (
                      <button
                        key={filter}
                        onClick={() => setSubFilter(turkishLower(filter))}
                        className={`px-5 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                          subFilter === turkishLower(filter)
                            ? 'bg-dilim-siyah text-white shadow-md transform scale-105'
                            : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </motion.div>
                );
              })()}
            </AnimatePresence>
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
                        {product.price === 0 && !product.hasSizes && !product.hasNumberSelection && !product.hasTextSelection ? (
                          <Link
                            href={`/tasarla?ref=${product.slug}`}
                            className="pointer-events-auto bg-dilim-siyah text-white px-5 py-3 rounded-full font-semibold text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-800 shadow-lg"
                          >
                            <PaintBucket className="w-4 h-4" />
                            Tasarla
                          </Link>
                        ) : product.hasSizes || product.hasNumberSelection || product.hasTextSelection ? (
                          <button
                            onClick={() => setQuickAddProduct({
                              id: product.id,
                              title: product.title,
                              slug: product.slug,
                              price: product.price,
                              image: imageToUse,
                              hasSizes: product.hasSizes,
                              sizes: product.sizes,
                              hasNumberSelection: product.hasNumberSelection,
                              hasTextSelection: product.hasTextSelection
                            })}
                            className="pointer-events-auto bg-dilim-portakal text-white px-5 py-3 rounded-full font-semibold text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-dilim-turuncu shadow-lg"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            Sepete Ekle
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              addToCart({
                                id: product.id.toString(),
                                name: product.title,
                                price: `₺${product.price}`,
                                image: imageToUse,
                                quantity: 1,
                              })
                              
                              const isCake = product.title.toLowerCase().includes('pasta') || categoryName.toLowerCase().includes('pasta');
                              
                              if (isCake && crossSellProducts && crossSellProducts.length > 0) {
                                setAddedProductForCrossSell({
                                  title: product.title,
                                  image: imageToUse,
                                  displayPrice: product.price
                                })
                                setShowCrossSell(true)
                              } else {
                                setIsCartOpen(true)
                              }
                            }}
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
              {searchQuery.trim() ? (
                <>
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-xl text-gray-500 font-light mb-2">
                    &ldquo;<span className="font-medium text-dilim-siyah">{searchQuery}</span>&rdquo; ile eşleşen ürün bulunamadı.
                  </p>
                  <p className="text-sm text-gray-400">
                    Farklı bir arama terimi deneyin veya kategorilere göz atın.
                  </p>
                  <button
                    onClick={() => { setSearchQuery(''); setActiveCategorySlug('all'); }}
                    className="mt-6 px-6 py-3 bg-dilim-portakal text-white rounded-full text-sm font-medium hover:bg-dilim-turuncu transition-colors duration-300"
                  >
                    Tüm Ürünleri Göster
                  </button>
                </>
              ) : (
                <p className="text-xl text-gray-500 font-light">
                  Bu kategoride henüz ürün bulunmamaktadır.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      <QuickAddModal 
        product={quickAddProduct}
        isOpen={!!quickAddProduct}
        onClose={() => setQuickAddProduct(null)}
        crossSellProducts={crossSellProducts}
        onAddedToCart={(product, sizeObj, quantity) => {
          setQuickAddProduct(null); // İlk pop-up'ı kapat
          setAddedProductForCrossSell({
            title: product.title,
            image: product.image,
            selectedSize: sizeObj ? sizeObj.size : undefined,
            displayPrice: sizeObj ? Number(sizeObj.price) * quantity : Number(product.price) * quantity
          });
          setShowCrossSell(true);
        }}
      />

      <CrossSellModal 
        isOpen={showCrossSell}
        onClose={() => { setShowCrossSell(false); setAddedProductForCrossSell(null); }}
        product={addedProductForCrossSell}
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
