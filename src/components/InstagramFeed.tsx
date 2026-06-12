'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
)

const PlayIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
)

const INSTAGRAM_POSTS = [
  { id: 1, image: '/detay_pasta_1.png', link: 'https://instagram.com/dilimpastaneleri', type: 'reel', size: 'vertical' }, // 9:16 reels
  { id: 2, image: '/detay_pasta_2.png', link: 'https://instagram.com/dilimpastaneleri', type: 'image', size: 'square' }, // 1:1
  { id: 3, image: '/hakkimizda_ic_mekan.png', link: 'https://instagram.com/dilimpastaneleri', type: 'carousel', size: 'horizontal' }, // 16:9 yatay
  { id: 4, image: '/urunler_yas_pasta.png', link: 'https://instagram.com/dilimpastaneleri', type: 'image', size: 'square' }, // 1:1
  { id: 5, image: '/hakkimizda_chef.png', link: 'https://instagram.com/dilimpastaneleri', type: 'reel', size: 'vertical' }, // 9:16 reels
  { id: 6, image: '/hakkimizda_cikolata.png', link: 'https://instagram.com/dilimpastaneleri', type: 'image', size: 'square' }, // 1:1
]

export function InstagramFeed({ data }: { data?: any }) {
  // Use CMS data if available, otherwise fallback to dummy data
  const feedPosts = data?.posts?.length > 0 ? data.posts.map((post: any, index: number) => ({
    id: post.id || index,
    image: (typeof post.image === 'object' && post.image?.url) ? post.image.url : '/generated/hero_cake.png',
    link: post.link || 'https://instagram.com/dilimpastaneleri',
    type: post.isReel ? 'reel' : 'image',
  })) : INSTAGRAM_POSTS

  return (
    <section className="bg-white py-16 lg:py-24 overflow-hidden border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-12 bg-dilim-portakal"></div>
            <InstagramIcon className="w-6 h-6 text-dilim-portakal" />
            <div className="h-[1px] w-12 bg-dilim-portakal"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-dilim-siyah mb-4">
            Instagram'da Bizi Takip Edin
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            <a href="https://instagram.com/dilimpastaneleri" target="_blank" rel="noopener noreferrer" className="font-semibold text-dilim-portakal hover:underline">
              @dilimpastaneleri
            </a>
            {' '}hesabımızdaki en tatlı anlara ortak olun.
          </p>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {feedPosts.map((post: any, index: number) => {
            return (
              <motion.a
                key={post.id}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative aspect-square block overflow-hidden bg-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all"
              >
                {/* Sol üstte Reels/Video İkonu */}
                {post.type === 'reel' && (
                  <div className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center">
                    <PlayIcon className="w-4 h-4 text-white ml-0.5" />
                  </div>
                )}
                
                {/* Arka Plan Fotoğrafı */}
                <Image
                  src={post.image}
                  alt="Dilim Pastaneleri Instagram Post"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Hover Siyah Katman */}
                <div className="absolute inset-0 bg-gradient-to-t from-dilim-siyah/80 via-dilim-siyah/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center z-10">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <InstagramIcon className="w-10 h-10 text-white" />
                  </div>
                </div>
              </motion.a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
