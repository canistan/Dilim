"use client"

import Link from 'next/link'
import Image from 'next/image'

export const Footer = () => {
  return (
    <footer className="bg-dilim-siyah text-white pt-24 pb-12 border-t-[8px] border-dilim-yaldiz relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-dilim-bordo/20 blur-[120px] rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12 relative z-10">
        <div className="md:col-span-3 lg:col-span-2 pr-0 lg:pr-4">
          <div className="mb-8 inline-block">
            {/* Premium Typographic SVG Logo (White variation) */}
            <Image 
              src="/DilimPastLogo-final.png" 
              alt="Dilim Logo" 
              width={200} 
              height={54} 
              className="h-12 w-auto object-contain brightness-0 invert opacity-90"
            />
          </div>
          <p className="text-sm text-gray-400 leading-relaxed font-light mb-8">
            Özel anlarınıza lezzet katıyoruz. Her gün yenilenen ve daimi olmasını talep ettiğimiz müşterilerimizin özel ve mutlu günlerine ortak olduğumuz anlardan ibaret olan kocaman bir birikimden oluşmaktayız.
          </p>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/bi_dilimpasta/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-dilim-portakal hover:text-white transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://x.com/dilimpastanesi" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-dilim-portakal hover:text-white transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
            <a href="https://www.facebook.com/dilimpastaneleri/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-dilim-portakal hover:text-white transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-serif mb-8 text-dilim-yaldiz tracking-wide">Hızlı Linkler</h4>
          <ul className="space-y-4 text-sm text-gray-300 font-light">
            <li><Link href="/hakkimizda" className="hover:text-dilim-portakal hover:pl-2 transition-all duration-300 flex items-center"><span className="w-1 h-1 rounded-full bg-dilim-yaldiz mr-2"></span>Hakkımızda</Link></li>
            <li><Link href="/urunler" className="hover:text-dilim-portakal hover:pl-2 transition-all duration-300 flex items-center"><span className="w-1 h-1 rounded-full bg-dilim-yaldiz mr-2"></span>Ürünlerimiz</Link></li>
            <li><Link href="/tasarla" className="hover:text-dilim-portakal hover:pl-2 transition-all duration-300 flex items-center"><span className="w-1 h-1 rounded-full bg-dilim-yaldiz mr-2"></span>Kendi Pastanı Tasarla</Link></li>
            <li><Link href="/blog" className="hover:text-dilim-portakal hover:pl-2 transition-all duration-300 flex items-center"><span className="w-1 h-1 rounded-full bg-dilim-yaldiz mr-2"></span>Blog</Link></li>
            <li><Link href="/iletisim" className="hover:text-dilim-portakal hover:pl-2 transition-all duration-300 flex items-center"><span className="w-1 h-1 rounded-full bg-dilim-yaldiz mr-2"></span>İletişim</Link></li>
            <li><Link href="/blog#faq" className="hover:text-dilim-portakal hover:pl-2 transition-all duration-300 flex items-center"><span className="w-1 h-1 rounded-full bg-dilim-yaldiz mr-2"></span>Sıkça Sorulan Sorular</Link></li>
            <li><Link href="/franchise" className="hover:text-dilim-portakal hover:pl-2 transition-all duration-300 flex items-center"><span className="w-1 h-1 rounded-full bg-dilim-yaldiz mr-2"></span>Franchise Başvurusu</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-lg font-serif mb-8 text-dilim-yaldiz tracking-wide">Şubelerimiz</h4>
          <ul className="space-y-4 text-sm text-gray-300 font-light">
            <li className="flex items-center"><span className="w-1 h-1 rounded-full bg-dilim-gri-koyu mr-2"></span>Kavacık Merkez</li>
            <li className="flex items-center"><span className="w-1 h-1 rounded-full bg-dilim-gri-koyu mr-2"></span>Ümraniye Şubesi</li>
            <li className="flex items-center"><span className="w-1 h-1 rounded-full bg-dilim-gri-koyu mr-2"></span>Beykoz Şubesi (Franchise)</li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-serif mb-8 text-dilim-yaldiz tracking-wide">Yasal</h4>
          <ul className="space-y-4 text-sm text-gray-300 font-light">
            <li><Link href="/kvkk" className="hover:text-dilim-portakal hover:pl-2 transition-all duration-300 flex items-center"><span className="w-1 h-1 rounded-full bg-dilim-gri-koyu mr-2"></span>Gizlilik ve KVKK</Link></li>
            <li><Link href="/aydinlatma-metni" className="hover:text-dilim-portakal hover:pl-2 transition-all duration-300 flex items-center"><span className="w-1 h-1 rounded-full bg-dilim-gri-koyu mr-2"></span>Aydınlatma Metni</Link></li>
            <li><Link href="/kullanim-kosullari" className="hover:text-dilim-portakal hover:pl-2 transition-all duration-300 flex items-center"><span className="w-1 h-1 rounded-full bg-dilim-gri-koyu mr-2"></span>Kullanım Koşulları</Link></li>
            <li><Link href="/mesafeli-satis" className="hover:text-dilim-portakal hover:pl-2 transition-all duration-300 flex items-center"><span className="w-1 h-1 rounded-full bg-dilim-gri-koyu mr-2"></span>Mesafeli Satış Sözleşmesi</Link></li>
            <li><Link href="/iptal-iade" className="hover:text-dilim-portakal hover:pl-2 transition-all duration-300 flex items-center"><span className="w-1 h-1 rounded-full bg-dilim-gri-koyu mr-2"></span>İptal ve İade Koşulları</Link></li>
            <li>
              <button 
                onClick={() => window.dispatchEvent(new Event('openCookieSettings'))}
                className="hover:text-dilim-portakal hover:pl-2 transition-all duration-300 flex items-center cursor-pointer text-left w-full"
              >
                <span className="w-1 h-1 rounded-full bg-dilim-gri-koyu mr-2"></span>Çerez Ayarları
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-serif mb-8 text-dilim-yaldiz tracking-wide">İletişim</h4>
          <ul className="space-y-4 text-sm text-gray-300 font-light">
            <li className="leading-relaxed text-gray-400">Rüzgarlıbahçe Mah. Cumhuriyet Cad. Acarlar İş Merkezi Beykoz/İstanbul</li>
            <li><a href="tel:+902164256114" className="text-xl font-serif text-white hover:text-dilim-portakal transition-colors">+90 216 425 61 14</a></li>
            <li><a href="mailto:info@dilim.com.tr" className="hover:text-dilim-portakal transition-colors border-b border-gray-700 hover:border-dilim-portakal pb-1">info@dilim.com.tr</a></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/10 text-center text-xs text-gray-500 font-light tracking-wide">
        &copy; {new Date().getFullYear()} Dilim Pastaneleri. Tüm Hakları Saklıdır.
      </div>
    </footer>
  )
}

