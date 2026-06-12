"use client"

import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

export const Footer = ({ contactSettings }: { contactSettings?: any }) => {
  const { data: session } = useSession()
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email)
    }
  }, [session])

  return (
    <footer className="bg-dilim-portakal text-white border-t border-white/10 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 blur-[120px] rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
      
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
                className="h-10 w-auto object-contain brightness-0 invert opacity-100"
              />
            </div>
            <p className="text-sm text-white/80 leading-relaxed font-light mb-8">
              Özel anlarınıza lezzet katıyoruz. Geleneksel yöntemlerle, en taze malzemelerle sevgiyle üretiyoruz.
            </p>
            <div className="flex gap-4">
              <a href={contactSettings?.instagram || "https://www.instagram.com/dilimpastaneleri"} target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href={contactSettings?.facebook || "https://www.facebook.com/share/1BQ7yRqh6n/?mibextid=wwXIfr"} target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href={contactSettings?.twitter || "https://x.com/dilimpastanesi"} target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href={contactSettings?.tiktok || "https://www.tiktok.com/@dilimpastaneleri"} target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
              </a>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white tracking-wide">Hızlı Linkler</h4>
            <ul className="space-y-3 text-sm text-white/80 font-medium">
              <li><Link href="/" className="hover:text-white transition-all duration-300">Ana Sayfa</Link></li>
              <li><Link href="/menu" className="hover:text-white transition-all duration-300">Menü</Link></li>
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
            <h4 className="text-lg font-bold mb-6 text-white tracking-wide">Kurumsal</h4>
            <ul className="space-y-3 text-sm text-white/80 font-medium">
              <li><Link href="/franchise" className="hover:text-white transition-all duration-300">Franchise / Bayilik</Link></li>
              <li><Link href="/kariyer" className="hover:text-white transition-all duration-300">Kariyer / İK</Link></li>
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

          {/* Column 4: Contact & Newsletter */}
          <div>
            <div className="mb-10">
              <h4 className="text-lg font-bold mb-6 text-white tracking-wide">İletişim</h4>
              <ul className="space-y-4 text-sm text-white/80 font-medium">
                <li className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0 text-white"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  <span className="leading-relaxed whitespace-pre-line">{contactSettings?.address || 'Rüzgarlıbahçe Mah. Cumhuriyet Cad.\nAcarlar İş Merkezi Beykoz/İstanbul'}</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <a href={`tel:${contactSettings?.phone?.replace(/\s/g, '') || '+905059638021'}`} className="hover:text-white transition-colors">{contactSettings?.phone || '+90 (505) 963 80 21'}</a>
                </li>
                <li className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <a href={`mailto:${contactSettings?.email || 'info@dilim.com.tr'}`} className="hover:text-white transition-colors">{contactSettings?.email || 'info@dilim.com.tr'}</a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4 text-white tracking-wide">E-Bültene Kayıt Olun</h4>
              <p className="text-xs text-white/80 font-light mb-4">
                Özel kampanyalardan ilk siz haberdar olun.
              </p>
              <form className="relative w-full" onSubmit={(e) => { e.preventDefault(); toast.success('Bültene başarıyla abone oldunuz! Teşekkürler.'); }}>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta adresiniz" 
                  required
                  className="w-full bg-white/10 text-white placeholder-white/60 border border-white/20 rounded-md px-4 py-3 pr-[100px] focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-sm"
                />
                <button 
                  type="submit" 
                  className="absolute right-1 top-1 bottom-1 bg-white hover:bg-gray-100 text-dilim-portakal font-medium px-4 rounded-md transition-all duration-300 text-sm"
                >
                  Kayıt Ol
                </button>
              </form>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-dilim-portakal/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-white/80 font-medium">
            &copy; {new Date().getFullYear()} Dilim Pastaneleri. Tüm hakları saklıdır.
          </div>
          <div className="flex items-center gap-6 text-xs text-white/90 font-bold tracking-wider">
            <span className="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> 256-bit SSL</span>
            <span className="text-white font-bold">iyzi<span className="text-white/80">co</span></span>
            <span className="italic text-white/80">Masterpass</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

