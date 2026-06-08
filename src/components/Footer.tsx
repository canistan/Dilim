"use client"

import Link from 'next/link'
import Image from 'next/image'

export const Footer = () => {
  return (
    <footer className="bg-dilim-siyah text-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-dilim-bordo/10 blur-[120px] rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
      
      {/* Top Section - Newsletter */}
      <div className="border-b border-white/10 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-serif text-dilim-yaldiz mb-2">E-Bültene Kayıt Olun</h3>
              <p className="text-sm text-gray-400 font-light max-w-md">
                Dilim dünyasından, özel kampanyalardan ve sürpriz lezzetlerimizden ilk siz haberdar olun.
              </p>
            </div>
            
            <div className="flex justify-start lg:justify-end">
              <form className="relative w-full max-w-md" onSubmit={(e) => { e.preventDefault(); alert('Bültene başarıyla abone oldunuz! Teşekkürler.'); }}>
                <input 
                  type="email" 
                  placeholder="E-posta adresiniz" 
                  required
                  className="w-full bg-transparent text-white placeholder-gray-500 border border-gray-600 rounded-md px-4 py-3 pr-[130px] focus:outline-none focus:border-dilim-yaldiz focus:bg-white/5 transition-all text-sm"
                />
                <button 
                  type="submit" 
                  className="absolute right-1 top-1 bottom-1 bg-[#e2aa45] hover:bg-dilim-portakal text-dilim-siyah hover:text-white font-medium px-6 rounded-md transition-all duration-300 text-sm"
                >
                  Abone Ol
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Brand */}
          <div className="pr-0 lg:pr-8">
            <div className="mb-6 inline-block">
              <Image 
                src="/DilimPastLogo-final.png" 
                alt="Dilim Logo" 
                width={160} 
                height={43} 
                className="h-10 w-auto object-contain brightness-0 invert opacity-90"
              />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-light mb-8">
              Özel anlarınıza lezzet katıyoruz. Geleneksel yöntemlerle, en taze malzemelerle sevgiyle üretiyoruz.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/bi_dilimpasta/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://www.facebook.com/dilimpastaneleri/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://x.com/dilimpastanesi" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-medium mb-6 text-white tracking-wide">Hızlı Linkler</h4>
            <ul className="space-y-3 text-sm text-gray-400 font-light">
              <li><Link href="/" className="hover:text-white transition-all duration-300">Ana Sayfa</Link></li>
              <li><Link href="/urunler" className="hover:text-white transition-all duration-300">Ürünlerimiz</Link></li>
              <li><Link href="/hakkimizda" className="hover:text-white transition-all duration-300">Hakkımızda</Link></li>
              <li><Link href="/iletisim" className="hover:text-white transition-all duration-300">İletişim</Link></li>
              <li><Link href="/sss" className="hover:text-white transition-all duration-300">Sıkça Sorulan Sorular</Link></li>
              <li><Link href="/tasarla" className="hover:text-white transition-all duration-300">Kendi Pastanı Tasarla</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-all duration-300">Blog</Link></li>
            </ul>
          </div>

          {/* Column 3: Corporate */}
          <div>
            <h4 className="text-lg font-medium mb-6 text-white tracking-wide">Kurumsal</h4>
            <ul className="space-y-3 text-sm text-gray-400 font-light">
              <li><Link href="/mesafeli-satis" className="hover:text-white transition-all duration-300">Mesafeli Satış Sözleşmesi</Link></li>
              <li><Link href="/kullanim-kosullari" className="hover:text-white transition-all duration-300">Kullanım Koşulları</Link></li>
              <li><Link href="/iptal-iade" className="hover:text-white transition-all duration-300">Teslimat ve İade</Link></li>
              <li><Link href="/kvkk" className="hover:text-white transition-all duration-300">Gizlilik ve KVKK</Link></li>
              <li><Link href="/aydinlatma-metni" className="hover:text-white transition-all duration-300">KVKK Aydınlatma Metni</Link></li>
              <li>
                <button 
                  onClick={() => window.dispatchEvent(new Event('openCookieSettings'))}
                  className="hover:text-white transition-all duration-300 cursor-pointer text-left"
                >
                  Çerez Seçimini Değiştir
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-lg font-medium mb-6 text-white tracking-wide">İletişim</h4>
            <ul className="space-y-4 text-sm text-gray-400 font-light">
              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e2aa45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span className="leading-relaxed">Rüzgarlıbahçe Mah. Cumhuriyet Cad.<br/>Acarlar İş Merkezi Beykoz/İstanbul</span>
              </li>
              <li className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e2aa45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <a href="tel:+902164256114" className="hover:text-white transition-colors">+90 (216) 425 61 14</a>
              </li>
              <li className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e2aa45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <a href="mailto:info@dilim.com.tr" className="hover:text-white transition-colors">info@dilim.com.tr</a>
              </li>
            </ul>
          </div>
          
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-gray-500 font-light">
            &copy; {new Date().getFullYear()} Dilim Pastaneleri. Tüm hakları saklıdır.
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-400 font-medium tracking-wider">
            <span className="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> 256-bit SSL</span>
            <span className="text-blue-400 font-bold">iyzi<span className="text-white">co</span></span>
            <span className="italic">Masterpass</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
