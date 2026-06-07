"use client"

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Cake, ShoppingBag, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { ReferencesMarquee } from '@/components/ReferencesMarquee'

export default function HomePageClient({ homepageData }: { homepageData?: any }) {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="flex flex-col w-full bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] min-h-[650px] flex items-center bg-dilim-siyah overflow-hidden">
        {/* Animated Background Overlay */}
        <div className="absolute inset-0 opacity-60 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
        
        {/* Subtle pattern or noise could go here */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-10"></div>
        
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image 
            src="/generated/hero_cake.png" 
            alt="Dilim Pastaneleri Premium Yaş Pasta" 
            fill
            priority
            className="object-cover"
          />
        </motion.div>
        
        <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <motion.div
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.2 }}
            >
              <motion.div variants={fadeUp} className="flex items-center gap-2 mb-6">
                <Star className="h-4 w-4 text-dilim-yaldiz fill-dilim-yaldiz" />
                <span className="text-dilim-yaldiz font-semibold tracking-widest text-sm uppercase">
                  Gerçek Lezzet, Eşsiz Anlar
                </span>
              </motion.div>
              
              <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-tight">
                {homepageData?.heroTitle || (
                  <>
                    Hayalinizdeki <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-dilim-yaldiz to-dilim-portakal font-serif italic pr-4">
                      Pastayı
                    </span> 
                    Tasarlayın
                  </>
                )}
              </motion.h1>
              
              <motion.p variants={fadeUp} className="text-lg md:text-xl text-gray-300 mb-10 max-w-lg leading-relaxed font-light">
                {homepageData?.heroSubtitle || "2000 yılından beri en taze malzemelerle, en özel günleriniz için sanat eseri tadında lüks pastalar üretiyoruz."}
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-5">
                <Link href="/tasarla" className="relative group inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-dilim-portakal overflow-hidden rounded-full transition-all">
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-dilim-turuncu to-dilim-portakal opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-dilim-portakal to-dilim-yaldiz rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500 animate-pulse"></div>
                  <span className="relative flex items-center">
                    <Cake className="mr-2 h-5 w-5" />
                    Hemen Tasarla
                  </span>
                </Link>
                
                <Link href="/urunler" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all rounded-full border border-white/20 hover:border-white/40">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Ürünleri İncele
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories / Highlights */}
      <section className="py-32 bg-white relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-dilim-yaldiz"></div>
              <h2 className="text-sm font-bold text-dilim-yaldiz tracking-[0.2em] uppercase">Seçimlerimiz</h2>
              <div className="h-[1px] w-12 bg-dilim-yaldiz"></div>
            </div>
            <h3 className="text-4xl md:text-5xl font-serif text-dilim-siyah">Sizin İçin Önerilenler</h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {homepageData?.featuredProducts?.length > 0 ? (
              homepageData.featuredProducts.map((product: any, index: number) => {
                const isMiddle = index === 1;
                const image = product.images?.[0]?.url || "/generated/hero_cake.png";
                return (
                  <motion.div 
                    key={product.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * (index + 1) }}
                  >
                    <Link href={`/urunler/${product.slug}`} className={`group relative overflow-hidden rounded-[2rem] aspect-[4/5] bg-gray-100 flex items-end shadow-xl hover:shadow-2xl transition-shadow duration-500 block ${isMiddle ? 'md:-translate-y-8' : ''}`}>
                      <Image src={image} alt={product.title} fill className="absolute inset-0 object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                      <div className="relative z-10 p-10 w-full transform transition-transform duration-500 group-hover:-translate-y-2">
                        <h4 className="text-3xl font-serif text-white mb-3">{product.title}</h4>
                        <div className="flex items-center text-dilim-yaldiz font-medium group-hover:text-white transition-colors">
                          İncele <ArrowRight className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-2" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })
            ) : (
              <>
                {/* Fallback to static cards if no featured products selected */}
                {/* Category Card 1 */}
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <Link href="/urunler?kategori=yas-pastalar" className="group relative overflow-hidden rounded-[2rem] aspect-[4/5] bg-gray-100 flex items-end shadow-xl hover:shadow-2xl transition-shadow duration-500 block">
                    <Image src="/generated/category_yas_pastalar.png" alt="Yaş Pastalar" fill className="absolute inset-0 object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                    <div className="relative z-10 p-10 w-full transform transition-transform duration-500 group-hover:-translate-y-2">
                      <h4 className="text-3xl font-serif text-white mb-3">Yaş Pastalar</h4>
                      <div className="flex items-center text-dilim-yaldiz font-medium group-hover:text-white transition-colors">
                        Koleksiyonu İncele <ArrowRight className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-2" />
                      </div>
                    </div>
                  </Link>
                </motion.div>

                {/* Category Card 2 */}
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <Link href="/tasarla" className="group relative overflow-hidden rounded-[2rem] aspect-[4/5] bg-gray-100 flex items-end shadow-xl hover:shadow-2xl transition-shadow duration-500 block md:-translate-y-8">
                    <Image src="/generated/category_tasarla.png" alt="Özel Gün Pastaları" fill className="absolute inset-0 object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                    <div className="relative z-10 p-10 w-full transform transition-transform duration-500 group-hover:-translate-y-2">
                      <h4 className="text-3xl font-serif text-white mb-3">Kendi Pastanı Tasarla</h4>
                      <div className="flex items-center text-dilim-yaldiz font-medium group-hover:text-white transition-colors">
                        Hemen Tasarla <ArrowRight className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-2" />
                      </div>
                    </div>
                  </Link>
                </motion.div>

                {/* Category Card 3 */}
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <Link href="/urunler?kategori=tatlilar" className="group relative overflow-hidden rounded-[2rem] aspect-[4/5] bg-gray-100 flex items-end shadow-xl hover:shadow-2xl transition-shadow duration-500 block">
                    <Image src="/generated/category_tatlilar.png" alt="Tatlılar" fill className="absolute inset-0 object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                    <div className="relative z-10 p-10 w-full transform transition-transform duration-500 group-hover:-translate-y-2">
                      <h4 className="text-3xl font-serif text-white mb-3">Tatlılar & Ekler</h4>
                      <div className="flex items-center text-dilim-yaldiz font-medium group-hover:text-white transition-colors">
                        Koleksiyonu İncele <ArrowRight className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-2" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </section>
      
      <ReferencesMarquee />
    </div>
  )
}

