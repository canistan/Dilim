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

export const VerticalCakesMarquee = ({ cakes, direction = 'up' }: { cakes: CustomCake[], direction?: 'up' | 'down' }) => {
  if (!cakes || cakes.length === 0) return null;

  const animationClass = direction === 'up' ? 'animate-marquee-vertical' : 'animate-marquee-vertical-reverse';

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col group opacity-40 hover:opacity-100 transition-opacity duration-700">
      
      {/* Top and Bottom Fade Gradients */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-50 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50 to-transparent z-10 pointer-events-none"></div>

      <div className={`flex flex-col ${animationClass} group-hover:[animation-play-state:paused] min-h-full shrink-0`}>
        {cakes.map((cake, i) => {
          const staticProd = STATIC_PRODUCTS.find(p => p.name === cake.title);
          const imageUrl = typeof cake.image === 'object' && cake.image?.url 
              ? cake.image.url 
              : (staticProd?.image || '/placeholder.png');
          return (
            <div key={i} className="flex-none w-full aspect-[4/5] my-4 relative rounded-3xl overflow-hidden shadow-sm group/card">
              <Image 
                src={imageUrl} 
                alt={cake.title || `Cake ${i}`} 
                fill
                className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                sizes="(max-width: 768px) 100vw, 256px"
              />
              <div className="absolute inset-0 bg-black/20 group-hover/card:bg-black/0 transition-colors duration-500"></div>
            </div>
          )
        })}
      </div>
      
      {/* Duplicate for seamless infinite loop */}
      <div className={`flex flex-col ${animationClass} group-hover:[animation-play-state:paused] min-h-full shrink-0`} aria-hidden="true">
        {cakes.map((cake, i) => {
          const staticProd = STATIC_PRODUCTS.find(p => p.name === cake.title);
          const imageUrl = typeof cake.image === 'object' && cake.image?.url 
              ? cake.image.url 
              : (staticProd?.image || '/placeholder.png');
          return (
            <div key={`dup-${i}`} className="flex-none w-full aspect-[4/5] my-4 relative rounded-3xl overflow-hidden shadow-sm group/card">
              <Image 
                src={imageUrl} 
                alt={cake.title || `Cake ${i}`} 
                fill
                className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                sizes="(max-width: 768px) 100vw, 256px"
              />
              <div className="absolute inset-0 bg-black/20 group-hover/card:bg-black/0 transition-colors duration-500"></div>
            </div>
          )
        })}
      </div>
      
    </div>
  )
}
