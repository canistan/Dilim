import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ChevronRight, HelpCircle } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import STATIC_BLOGS from '@/data/blog.json'

export const metadata = {
  title: 'Blog & Öneriler | Dilim Pastaneleri',
  description: 'Pastacılık sırları, doğum günü partisi tavsiyeleri, nişan pastası trendleri ve en lezzetli tatlıların arkasındaki hikayeler.',
}

export const revalidate = 3600

export default async function BlogPage() {
  const payload = await getPayload({ config: configPromise })
  const { docs: blogs } = await payload.find({
    collection: 'blog' as any,
    sort: '-createdAt', // En yeni en üstte
    limit: 100,
  })

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
            {blogs.map((post: any) => {
              const staticBlog = STATIC_BLOGS.find((b) => b.title === post.title)
              const imageToUse = (post.image && typeof post.image === 'object' && post.image.url) 
                ? post.image.url 
                : (staticBlog?.image || '/placeholder.png')
              
              // İçerikten excerpt oluştur
              let rawText = '';
              if (Array.isArray(post.content)) {
                const extractText = (nodes: any[]): string => nodes.map((n: any) => n.text || (n.children ? extractText(n.children) : '')).join(' ');
                rawText = extractText(post.content);
              } else if (typeof post.content === 'string') {
                rawText = post.content;
              }
              const generatedExcerpt = rawText.length > 150 ? rawText.substring(0, 150) + '...' : rawText;

              return (
                <article key={post.id} className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex flex-col group hover:-translate-y-2 transition-transform duration-500">
                  <Link href={`/blog/${post.slug}`} className="relative h-56 w-full overflow-hidden block bg-gray-100">
                    <Image 
                      src={imageToUse} 
                      alt={post.title} 
                      fill 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transform group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                  
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> 
                        {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> 
                        {staticBlog?.readTime || '3 dk okuma'}
                      </span>
                    </div>
                    
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-2xl font-serif font-bold text-dilim-siyah mb-4 group-hover:text-dilim-portakal transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>
                    
                    <p className="text-gray-600 mb-8 line-clamp-3 leading-relaxed flex-1">
                      {staticBlog?.excerpt || generatedExcerpt}
                    </p>
                    
                    <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-dilim-siyah font-bold hover:text-dilim-portakal transition-colors mt-auto">
                      Devamını Oku <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Sıkça Sorulan Sorular (FAQ) Section */}
      <section id="faq" className="py-24 bg-white scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <HelpCircle className="w-6 h-6 text-dilim-portakal" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-dilim-siyah mb-4">
              Sıkça Sorulan Sorular
            </h2>
            <div className="h-1 w-20 bg-dilim-yaldiz mx-auto rounded-full"></div>
            <p className="mt-6 text-gray-500 font-light text-lg">
              Aklınıza takılan soruların cevaplarını burada bulabilirsiniz.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Siparişim ne zaman teslim edilir?",
                a: "Siparişleriniz, seçtiğiniz tarihte ve saat diliminde özel soğutmalı araçlarımızla tazeliğini koruyarak teslim edilir. Aynı gün teslimat seçeneklerimiz için müşteri hizmetlerimizle iletişime geçebilirsiniz."
              },
              {
                q: "Özel tasarım (3D, figürlü, resimli) pasta yapıyor musunuz?",
                a: "Evet, hayalinizdeki her türlü pastayı gerçeğe dönüştürüyoruz. Dilediğiniz konsept, figür veya fotoğrafı pastanıza uygulayabiliriz. Detaylar için menüdeki 'Kendi Pastanı Tasarla' bölümünü kullanabilirsiniz."
              },
              {
                q: "Hangi bölgelere teslimatınız var?",
                a: "Şu an için öncelikli olarak Kavacık, Beykoz ve Ümraniye çevrelerine kendi özel araçlarımızla kusursuz teslimat sağlıyoruz. Diğer bölgeler için bizimle iletişime geçerek anında bilgi alabilirsiniz."
              },
              {
                q: "Ürünlerinizde katkı maddesi kullanılıyor mu?",
                a: "Kesinlikle hayır. 1977'den gelen kalite mirasımız gereği tüm pastalarımızda ve tatlılarımızda en taze, 1. sınıf ve doğal malzemeler kullanıyoruz. Fabrikasyon değil, butik ve günlük üretim yapıyoruz."
              }
            ].map((faq, index) => (
              <details key={index} className="group bg-gray-50 rounded-2xl border border-gray-100 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-dilim-siyah group-hover:text-dilim-portakal transition-colors">
                  <span className="text-lg">{faq.q}</span>
                  <span className="relative flex-shrink-0 ml-4 w-6 h-6 flex items-center justify-center">
                    <span className="absolute w-4 h-[2px] bg-current transition-transform duration-300 group-open:rotate-180"></span>
                    <span className="absolute w-[2px] h-4 bg-current transition-transform duration-300 group-open:rotate-90"></span>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-gray-600 font-light leading-relaxed animate-in slide-in-from-top-2 fade-in duration-300">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
