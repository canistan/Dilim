import Link from 'next/link'
import { Instagram, Twitter, Facebook } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="bg-dilim-siyah text-white pt-24 pb-12 border-t-[8px] border-dilim-yaldiz relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-dilim-bordo/20 blur-[120px] rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        <div className="md:col-span-1 pr-4">
          <div className="mb-8 inline-block">
            {/* Premium Typographic SVG Logo (White variation) */}
            <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="0" y="32" fontFamily="Playfair Display, serif" fontSize="32" fontWeight="700" fill="#ffffff" letterSpacing="-1">
                Dilim<tspan fill="var(--dilim-portakal)">.</tspan>
              </text>
            </svg>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed font-light mb-8">
            Özel anlarınıza lezzet katıyoruz. Her gün yenilenen ve daimi olmasını talep ettiğimiz müşterilerimizin özel ve mutlu günlerine ortak olduğumuz anlardan ibaret olan kocaman bir birikimden oluşmaktayız.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-dilim-portakal hover:text-white transition-all duration-300">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-dilim-portakal hover:text-white transition-all duration-300">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-dilim-portakal hover:text-white transition-all duration-300">
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-serif mb-8 text-dilim-yaldiz tracking-wide">Hızlı Linkler</h4>
          <ul className="space-y-4 text-sm text-gray-300 font-light">
            <li><Link href="/kurumsal" className="hover:text-dilim-portakal hover:pl-2 transition-all duration-300 flex items-center"><span className="w-1 h-1 rounded-full bg-dilim-yaldiz mr-2"></span>Kurumsal</Link></li>
            <li><Link href="/urunler" className="hover:text-dilim-portakal hover:pl-2 transition-all duration-300 flex items-center"><span className="w-1 h-1 rounded-full bg-dilim-yaldiz mr-2"></span>Ürünlerimiz</Link></li>
            <li><Link href="/tasarla" className="hover:text-dilim-portakal hover:pl-2 transition-all duration-300 flex items-center"><span className="w-1 h-1 rounded-full bg-dilim-yaldiz mr-2"></span>Kendi Pastanı Tasarla</Link></li>
            <li><Link href="/iletisim" className="hover:text-dilim-portakal hover:pl-2 transition-all duration-300 flex items-center"><span className="w-1 h-1 rounded-full bg-dilim-yaldiz mr-2"></span>İletişim</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-lg font-serif mb-8 text-dilim-yaldiz tracking-wide">Şubelerimiz</h4>
          <ul className="space-y-4 text-sm text-gray-300 font-light">
            <li className="flex items-center"><span className="w-1 h-1 rounded-full bg-dilim-gri-koyu mr-2"></span>Kavacık Merkez</li>
            <li className="flex items-center"><span className="w-1 h-1 rounded-full bg-dilim-gri-koyu mr-2"></span>Ümraniye Şubesi</li>
            <li className="flex items-center"><span className="w-1 h-1 rounded-full bg-dilim-gri-koyu mr-2"></span>Alemdağ Şubesi</li>
            <li className="flex items-center"><span className="w-1 h-1 rounded-full bg-dilim-gri-koyu mr-2"></span>Beykoz Şubesi</li>
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

