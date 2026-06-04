import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Star, Truck, ShieldCheck, Check } from 'lucide-react'
import { AddToCartButton } from '@/components/AddToCartButton'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import STATIC_PRODUCTS from '@/data/products.json'

// ISR - Generate Static Params (1 saatte bir güncellenir)
export const revalidate = 3600

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const products = await payload.find({
    collection: 'products' as any,
    limit: 1000,
  })

  return products.docs.map((product: any) => ({
    slug: product.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'products' as any,
    where: { slug: { equals: slug } },
  })

  const product = docs[0] as any
  if (!product) return { title: 'Ürün Bulunamadı' }

  return {
    title: product.meta?.title || `${product.title} | Dilim Pastaneleri`,
    description: product.meta?.description || product.description || `${product.title} siparişi verin. Günlük taze malzemelerle hazırlanan lüks lezzetler.`,
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  
  const { docs } = await payload.find({
    collection: 'products' as any,
    where: { slug: { equals: slug } },
  })

  const product = docs[0] as any
  if (!product) {
    notFound()
  }

  // Aynı kategorideki benzer ürünleri bul
  const categoryId = typeof product.category === 'object' ? product.category.id : product.category
  const { docs: relatedDocs } = await payload.find({
    collection: 'products' as any,
    where: { 
      category: { equals: categoryId },
      id: { not_equals: product.id }
    },
    limit: 4,
  })

  const categoryName = typeof product.category === 'object' ? product.category.title : 'Kategori'

  const staticProd = STATIC_PRODUCTS.find(p => p.name === product.title)
  const imageToUse = (product.images && product.images.length > 0 && product.images[0].url) 
    ? product.images[0].url 
    : (staticProd?.image || '/placeholder.png')

  return (
    <div className="flex flex-col w-full bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center text-sm text-gray-500 font-medium gap-y-2">
            <Link href="/" className="hover:text-dilim-portakal transition-colors">Anasayfa</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link href="/urunler" className="hover:text-dilim-portakal transition-colors">Ürünler</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link href="/urunler" className="hover:text-dilim-portakal transition-colors whitespace-nowrap">{categoryName}</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-dilim-siyah font-bold truncate max-w-[200px] sm:max-w-none">{product.title}</span>
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            
            {/* Left: Image Gallery */}
            <div className="relative aspect-square md:aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-50 shadow-2xl border border-gray-100 group">
              <Image 
                src={imageToUse} 
                alt={product.title} 
                fill 
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transform transition-transform duration-700 hover:scale-105" 
              />
            </div>

            {/* Right: Info & Actions */}
            <div className="flex flex-col justify-center">
              <div className="mb-2">
                <span className="inline-block px-4 py-1.5 rounded-full bg-dilim-portakal/10 text-dilim-portakal text-xs font-bold uppercase tracking-widest">
                  {categoryName}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-dilim-siyah mb-6 leading-tight">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center text-dilim-yaldiz">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <span className="text-gray-500 text-sm">(Müşteri Favorisi)</span>
              </div>
              
              <div className="text-3xl font-serif font-bold text-dilim-siyah mb-8">
                {product.price > 0 ? `₺${product.price}` : 'Özel Fiyat'}
              </div>

              <p className="text-gray-600 text-lg leading-relaxed mb-10 font-light whitespace-pre-wrap">
                {product.description || `Günlük taze malzemelerle hazırlanan, Dilim Pastaneleri ustalarının özel tarifi olan ${product.title.toLowerCase()}. Her diliminde hissedeceğiniz lüks doku ve yoğun lezzet profili ile özel günlerinize ve tatlı krizlerinize eşsiz bir dokunuş katar.`}
              </p>

              {/* Add to Cart Actions (Client Component for interactivity) */}
              <AddToCartButton product={{
                id: product.id.toString(),
                name: product.title,
                price: product.price > 0 ? `₺${product.price}` : 'Özel Fiyat',
                image: imageToUse
              }} />

              {/* Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-gray-100 mt-10">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-dilim-portakal shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-sm">Aynı Gün Teslimat</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-sm">Garantili Tazelik</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600 shrink-0">
                    <Check className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-sm">1. Sınıf Malzeme</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedDocs.length > 0 && (
        <section className="py-24 bg-gray-50 border-t border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center mb-16 text-center">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-dilim-siyah mb-4">Benzer Lezzetler</h2>
              <div className="h-1 w-20 bg-dilim-yaldiz rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedDocs.map((rel: any) => {
                const relStaticProd = STATIC_PRODUCTS.find(p => p.name === rel.title)
                const relImageToUse = (rel.images && rel.images.length > 0 && rel.images[0].url) 
                  ? rel.images[0].url 
                  : (relStaticProd?.image || '/placeholder.png')

                return (
                  <Link key={rel.id} href={`/urunler/${rel.slug}`} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col">
                    <div className="relative aspect-square overflow-hidden bg-gray-50 border-b border-gray-100">
                      <Image 
                        src={relImageToUse} 
                        alt={rel.title} 
                        fill 
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover transform group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 z-10" />
                    </div>
                    <div className="p-6 flex-1 flex flex-col items-center text-center">
                      <h3 className="text-lg font-bold text-dilim-siyah leading-tight mb-2 flex-1 group-hover:text-dilim-portakal transition-colors">
                        {rel.title}
                      </h3>
                      <span className="text-lg font-serif font-bold text-dilim-siyah">
                        {rel.price > 0 ? `₺${rel.price}` : 'Özel Fiyat'}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
