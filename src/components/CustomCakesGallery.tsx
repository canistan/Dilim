'use client'

import React from 'react'
import Image from 'next/image'
import STATIC_PRODUCTS from '@/data/products.json'

type CustomCake = {
  id: number;
  title: string;
  image?: {
    url?: string;
    alt?: string;
  } | number | null;
}

export const CustomCakesGallery = ({ cakes }: { cakes: CustomCake[] }) => {
  if (!cakes || cakes.length === 0) return null;

  return (
    <section className="bg-dilim-bej pt-4 pb-12 overflow-hidden">
      <div className="container mx-auto px-4 mb-10 text-center">
        <h3 className="text-3xl font-bold text-dilim-siyah tracking-tight">
          İlham Alabileceğiniz Bazı Örnekler
        </h3>
        <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-sm">
          Aşağıdaki özel tasarım pastalarımız, tamamen müşterilerimizin hayallerine göre şekillendirildi. 
          Siz de kendi pastanızı tasarlarken bu eserlerden ilham alabilirsiniz.
        </p>
        <div className="w-16 h-1 bg-dilim-yaldiz mx-auto mt-6 rounded-full"></div>
      </div>
      
      {/* Marquee Wrapper */}
      <div className="relative w-full flex overflow-hidden group py-4">
        
        {/* Left and Right Fade Gradients */}
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-dilim-bej to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-dilim-bej to-transparent z-10 pointer-events-none"></div>

        <div className="flex animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap min-w-full shrink-0">
          {cakes.map((cake, i) => {
            const staticProd = STATIC_PRODUCTS.find(p => p.name === cake.title);
            const imageUrl = typeof cake.image === 'object' && cake.image?.url 
                ? cake.image.url 
                : (staticProd?.image || '/placeholder.png');
            return (
              <div key={i} className="flex-none w-48 h-64 mx-3 relative rounded-2xl overflow-hidden shadow-md border border-white/50 group/card">
                <Image 
                  src={imageUrl} 
                  alt={cake.title || `Cake ${i}`} 
                  fill
                  className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                  sizes="(max-width: 768px) 100vw, 256px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 w-full p-3 text-center">
                  <h4 className="text-white font-bold text-base drop-shadow-md whitespace-normal leading-tight">
                    {cake.title}
                  </h4>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Duplicate for seamless infinite loop */}
        <div className="flex animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap min-w-full shrink-0" aria-hidden="true">
          {cakes.map((cake, i) => {
            const staticProd = STATIC_PRODUCTS.find(p => p.name === cake.title);
            const imageUrl = typeof cake.image === 'object' && cake.image?.url 
                ? cake.image.url 
                : (staticProd?.image || '/placeholder.png');
            return (
              <div key={`dup-${i}`} className="flex-none w-48 h-64 mx-3 relative rounded-2xl overflow-hidden shadow-md border border-white/50 group/card">
                <Image 
                  src={imageUrl} 
                  alt={cake.title || `Cake ${i}`} 
                  fill
                  className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                  sizes="(max-width: 768px) 100vw, 256px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 w-full p-3 text-center">
                  <h4 className="text-white font-bold text-base drop-shadow-md whitespace-normal leading-tight">
                    {cake.title}
                  </h4>
                </div>
              </div>
            )
          })}
        </div>
        
      </div>
    </section>
  )
}
