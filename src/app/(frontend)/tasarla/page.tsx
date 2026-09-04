import Image from 'next/image'
import CakeBuilder from '@/components/CakeBuilder'
import { VerticalCakesMarquee } from '@/components/VerticalCakesMarquee'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export const metadata = {
  title: 'Kendi Pastanı Tasarla | Kavacık & Ümraniye Özel Tasarım Pasta - Dilim',
  description: 'Hayalinizdeki doğum günü pastasını, nişan pastasını veya özel gün pastasını adım adım tasarlayın. Kavacık ve Ümraniye\'ye aynı gün teslimat.',
}

export default async function TasarlaPage() {
  const payload = await getPayload({ config: configPromise })
  
  const customCakeOptions = await payload.findGlobal({
    slug: 'custom-cake-options',
    depth: 2,
  })

  const contactSettings = await payload.findGlobal({
    slug: 'contact-settings',
  })

  const timeSlots = await payload.find({
    collection: 'time-slots',
    where: { isActive: { equals: true } },
    sort: 'timeRange'
  })

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      
      {/* Hero Section */}
      <section className="relative w-full py-24 flex items-center justify-center bg-dilim-siyah overflow-hidden min-h-[500px]">
        <div 
          className="absolute inset-0 opacity-40 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=2000&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60 z-10" />
        
        <div className="relative z-20 text-center px-4 max-w-3xl mx-auto mt-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[1px] w-12 bg-dilim-yaldiz"></div>
            <span className="text-dilim-yaldiz font-semibold tracking-widest text-sm uppercase">Sana Özel</span>
            <div className="h-[1px] w-12 bg-dilim-yaldiz"></div>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight mb-6 drop-shadow-2xl">
            Hayalindeki Pastayı <br /> Tasarla
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed">
            Boyutundan kremasına, kekinden dış kaplamasına kadar her detayı siz belirleyin; ustalarımız sizin için sanat eserine dönüştürsün.
          </p>
        </div>
      </section>

      {/* Builder Section */}
      <section className="pt-20 pb-16 bg-gray-50 relative flex justify-center min-h-[800px]">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-black to-transparent opacity-5 pointer-events-none z-0"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-32 max-w-5xl">
          <CakeBuilder timeSlots={timeSlots.docs as any} globalOptions={customCakeOptions} contactSettings={contactSettings} />
        </div>
      </section>

    </div>
  )
}
