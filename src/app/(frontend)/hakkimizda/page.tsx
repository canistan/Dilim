import Image from 'next/image'
import { Star, Award, Heart, Coffee } from 'lucide-react'
import { ReferencesMarquee } from '@/components/ReferencesMarquee'

export const metadata = {
  title: 'Hakkımızda | Dilim Pastaneleri',
  description: '1977\'den günümüze uzanan lezzet serüvenimiz ve kalite anlayışımız.',
}

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      
      {/* Page Hero */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center bg-dilim-siyah overflow-hidden">
        <div className="absolute inset-0 opacity-80 bg-gradient-to-t from-black via-black/60 to-black/90 z-10" />
        <Image 
          src="/hakkimizda_hero.png" 
          alt="Dilim Pastaneleri Hikayemiz" 
          fill
          priority
          className="object-cover"
        />
        <div className="relative z-20 text-center px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-8 bg-dilim-yaldiz"></div>
            <span className="text-dilim-yaldiz font-semibold tracking-widest text-sm uppercase">1977'den Beri</span>
            <div className="h-[1px] w-8 bg-dilim-yaldiz"></div>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white tracking-tight drop-shadow-2xl shadow-black">Hakkımızda</h1>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Text Content */}
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-serif text-dilim-siyah leading-tight">
                Kuzguncuk'tan Gelen <br />
                <span className="text-dilim-yaldiz italic">Geleneksel Lezzet</span>
              </h2>
              
              <div className="space-y-6 text-lg text-gray-600 font-light leading-relaxed">
                <p>
                  <strong className="font-semibold text-dilim-siyah">Dilim Pastaneleri</strong> 1977 yılında, İstanbul’un tarihi semtlerinden biri olan boğazın girişindeki Kuzguncuk semtinde, Hayri, Hüsnü ve Mehmet ŞAHİN kardeşler tarafından kurulmuştur. Kısa sürede hizmet ve lezzet farklılığını mahalle sakinlerine kabul ettirerek, ününü semtin dışına da taşımış, semt dışından birçok kişi Dilim Pastaneleri’nin sadık müşterisi olmuştur.
                </p>
                <p>
                  2000 yılında, Mehmet ŞAHİN, nefis börek, poğaça, pasta, dondurma ve tatlıların eşsiz lezzetini, yeni gelişmekte olan <strong className="font-semibold text-dilim-siyah">Kavacık</strong> semtine taşıyarak modern imalathanesiyle birlikte yeni bir başlangıç yapmıştır. Kavacık'ın vazgeçilmez lezzet durağı haline gelen markamız, kısa sürede prestijli bir konuma ulaşmıştır.
                </p>
                <p>
                  Ümraniye ilçesinden gelen yoğun talep üzerine Eğitim ve Araştırma Hastanesinin karşısına <strong className="font-semibold text-dilim-siyah">Ümraniye</strong> şubesi açılmış; burada 200 m²’lik modern, hijyenik imalathanemizle birlikte daha geniş bir hizmet alanına geçilmiştir.
                </p>
                <p>
                  Şu anda, İstanbul’un Anadolu yakasında <strong className="font-semibold text-dilim-siyah">Kavacık Merkez ve Ümraniye olmak üzere 2 şubemizle</strong> hizmet vermekteyiz. ISO ve HACCP kalite standartlarının uygulandığı, alanında uzman ustalarımız ve güler yüzlü ekibimizle birlikte yaş pasta, kuru pasta, tatlı ve dondurma gibi birçok özel lezzeti üreterek misafirlerimize en taze haliyle sunmanın haklı gururunu yaşıyoruz.
                </p>
              </div>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
                  <Image src="/detay_pasta_3.png" alt="Lüks Orman Meyveli Tart" fill className="object-cover" />
                </div>
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl">
                  <Image src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop" alt="Özel Tasarım Pastalarımız" fill className="object-cover" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl">
                  <Image src="/detay_pasta_1.png" alt="Lüks Çikolatalı Yaş Pasta" fill className="object-cover" />
                </div>
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
                  <Image src="/detay_pasta_2.png" alt="Taze Çilekli Pasta" fill className="object-cover" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10 bg-gray-50 rounded-[3rem] p-8 md:p-12 shadow-sm border border-gray-100">
            <div className="w-48 h-48 md:w-56 md:h-56 relative rounded-[2rem] overflow-hidden shadow-xl border-4 border-white shrink-0 rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
              <Image src="/mehmet_sahin.jpg" alt="Mehmet Şahin - Dilim Pastaneleri Kurucusu" fill className="object-cover" />
            </div>
            <div className="text-center md:text-left">
              <div className="mb-4">
                <svg className="w-10 h-10 text-dilim-yaldiz/30 mx-auto md:mx-0 mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                <p className="text-gray-600 leading-relaxed italic text-lg">
                  "1977'den bu yana tek bir gayemiz var: En özel günlerinizde masanızda yer almak ve sizlere yalnızca en taze lezzetleri sunmak. Çeyrek asrı aşan bu yolculukta bizi aileden biri olarak gören tüm müşterilerimize sonsuz teşekkürler."
                </p>
              </div>
              <h3 className="text-2xl font-serif font-bold text-dilim-siyah mb-1">Mehmet Şahin</h3>
              <p className="text-dilim-portakal font-bold uppercase tracking-wider text-xs">Dilim Pastaneleri Kurucusu</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-dilim-siyah mb-4">Değerlerimiz</h2>
            <div className="w-16 h-1 bg-dilim-yaldiz mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 text-center group">
              <div className="w-16 h-16 bg-orange-50 text-dilim-portakal rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-dilim-siyah mb-3">Üstün Kalite</h3>
              <p className="text-gray-500 font-light text-sm">ISO ve HACCP standartlarında, en kaliteli hammaddelerle tavizsiz üretim.</p>
            </div>
            
            <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 text-center group">
              <div className="w-16 h-16 bg-orange-50 text-dilim-portakal rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-dilim-siyah mb-3">Geleneksel Lezzet</h3>
              <p className="text-gray-500 font-light text-sm">1977'den gelen reçetelerimizle, geçmişin samimiyetini bugüne taşıyoruz.</p>
            </div>
            
            <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 text-center group">
              <div className="w-16 h-16 bg-orange-50 text-dilim-portakal rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-dilim-siyah mb-3">Ustalık</h3>
              <p className="text-gray-500 font-light text-sm">Alanında uzman, tecrübeli şeflerimizin sanat eseri tadında dokunuşları.</p>
            </div>
            
            <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 text-center group">
              <div className="w-16 h-16 bg-orange-50 text-dilim-portakal rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Coffee className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-dilim-siyah mb-3">Misafirperverlik</h3>
              <p className="text-gray-500 font-light text-sm">Her bir müşterimizi evimizde ağırlıyormuşçasına gösterdiğimiz özen ve ilgi.</p>
            </div>
          </div>
        </div>
      </section>

      <ReferencesMarquee />
    </div>
  )
}
