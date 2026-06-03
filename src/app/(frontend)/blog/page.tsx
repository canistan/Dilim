import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ChevronRight } from 'lucide-react'
import blogData from '@/data/blog.json'

export const metadata = {
  title: 'Blog & Öneriler | Dilim Pastaneleri',
  description: 'Pastacılık sırları, doğum günü partisi tavsiyeleri, nişan pastası trendleri ve en lezzetli tatlıların arkasındaki hikayeler.',
}

export default function BlogPage() {
  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      
      {/* Hero Section */}
      <section className="relative w-full py-24 flex items-center justify-center bg-dilim-siyah overflow-hidden min-h-[400px]">
        <div className="absolute inset-0 opacity-40 bg-[url('/hakkimizda_cikolata.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60 z-10" />
        
        <div className="relative z-20 text-center px-4 max-w-3xl mx-auto mt-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[1px] w-12 bg-dilim-yaldiz"></div>
            <span className="text-dilim-yaldiz font-semibold tracking-widest text-sm uppercase">İlham & Lezzet</span>
            <div className="h-[1px] w-12 bg-dilim-yaldiz"></div>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight mb-6 drop-shadow-2xl">
            Dilim Blog
          </h1>
          <p className="text-gray-300 text-lg font-light leading-relaxed">
            Pastacılık sırları, nişan pastası trendleri, kutlama önerileri ve daha fazlası...
          </p>
        </div>
      </section>

      {/* Main Content - Blog List */}
      <section className="py-20 bg-gray-50 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogData.map((post) => (
              <article key={post.id} className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex flex-col group hover:-translate-y-2 transition-transform duration-500">
                <Link href={`/blog/${post.slug}`} className="relative h-56 w-full overflow-hidden block bg-gray-100">
                  <Image 
                    src={post.image} 
                    alt={post.title} 
                    fill 
                    className="object-cover transform group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 font-medium">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(post.date).toLocaleDateString('tr-TR')}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                  </div>
                  
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-2xl font-serif font-bold text-dilim-siyah mb-4 group-hover:text-dilim-portakal transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>
                  
                  <p className="text-gray-600 mb-8 line-clamp-3 leading-relaxed flex-1">
                    {post.excerpt}
                  </p>
                  
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-dilim-siyah font-bold hover:text-dilim-portakal transition-colors mt-auto">
                    Devamını Oku <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
