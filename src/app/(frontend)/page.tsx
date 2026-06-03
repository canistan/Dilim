import Link from 'next/link'
import { ArrowRight, Cake, ShoppingBag } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center bg-dilim-siyah overflow-hidden">
        {/* Placeholder for an amazing background image of a premium cake */}
        <div className="absolute inset-0 opacity-40 bg-gradient-to-r from-black/80 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=2000&auto=format&fit=crop" 
          alt="Dilim Pastaneleri Premium Yaş Pasta" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-3 rounded-full bg-dilim-turuncu/20 text-dilim-portakal font-semibold text-sm mb-4 border border-dilim-portakal/30">
              Gerçek Lezzet, Eşsiz Anlar
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              Hayalinizdeki <br/>
              <span className="text-dilim-portakal">Pastayı</span> Tasarlayın
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-lg leading-relaxed">
              2000 yılından beri en taze malzemelerle, en özel günleriniz için sanat eseri tadında pastalar üretiyoruz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/tasarla" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-dilim-portakal hover:bg-dilim-turuncu transition-all rounded-full shadow-lg shadow-dilim-portakal/30">
                <Cake className="mr-2 h-5 w-5" />
                Hemen Tasarla
              </Link>
              <Link href="/urunler" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all rounded-full border border-white/20">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Ürünleri İncele
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories / Highlights */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-dilim-turuncu tracking-widest uppercase mb-2">Seçimlerimiz</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold text-dilim-siyah">Sizin İçin Önerilenler</h3>
            <div className="w-24 h-1 bg-dilim-portakal mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Category Card 1 */}
            <Link href="/urunler?kategori=yas-pasta" className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-gray-100 flex items-end">
              <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop" alt="Yaş Pastalar" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="relative z-10 p-8 w-full">
                <h4 className="text-2xl font-bold text-white mb-2">Yaş Pastalar</h4>
                <div className="flex items-center text-dilim-portakal font-semibold group-hover:text-white transition-colors">
                  İncele <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>

            {/* Category Card 2 */}
            <Link href="/urunler?kategori=ozel-gun" className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-gray-100 flex items-end">
              <img src="https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=800&auto=format&fit=crop" alt="Özel Gün Pastaları" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="relative z-10 p-8 w-full">
                <h4 className="text-2xl font-bold text-white mb-2">Özel Gün Pastaları</h4>
                <div className="flex items-center text-dilim-portakal font-semibold group-hover:text-white transition-colors">
                  İncele <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>

            {/* Category Card 3 */}
            <Link href="/urunler?kategori=tatlilar" className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-gray-100 flex items-end">
              <img src="https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800&auto=format&fit=crop" alt="Tatlılar" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="relative z-10 p-8 w-full">
                <h4 className="text-2xl font-bold text-white mb-2">Tatlılar & Ekler</h4>
                <div className="flex items-center text-dilim-portakal font-semibold group-hover:text-white transition-colors">
                  İncele <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
