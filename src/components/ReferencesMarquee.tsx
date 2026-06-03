'use client'

import React from 'react'
import Image from 'next/image'

const REFERENCES = [
  'acarlar.jpg', 'accor.jpg', 'acn.jpg', 'akbank.jpg', 'albaraka.jpg',
  'anadol.jpg', 'aras.jpg', 'beykoz.jpg', 'borusan.jpg', 'doga.jpg',
  'garanti-leasing.jpg', 'garanti-portfoy.jpg', 'garanti.jpg', 'groupama.jpg',
  'ing-bank.jpg', 'istek.jpg', 'novartis.jpg', 'oytek.jpg', 'sardunya.jpg'
];

export const ReferencesMarquee = () => {
  return (
    <section className="bg-white py-12 overflow-hidden border-t border-gray-100">
      <div className="container mx-auto px-4 mb-8 text-center">
        <h3 className="text-xl font-bold text-dilim-siyah uppercase tracking-widest">
          Güvenilir İş Ortaklarımız
        </h3>
        <div className="w-16 h-1 bg-dilim-yaldiz mx-auto mt-4 rounded-full"></div>
      </div>
      
      {/* Marquee Wrapper */}
      <div className="relative w-full flex overflow-hidden group">
        
        {/* Left and Right Fade Gradients */}
        <div className="absolute left-0 top-0 w-24 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        <div className="flex animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap min-w-full shrink-0">
          {REFERENCES.map((img, i) => (
            <div key={i} className="flex-none w-40 h-20 mx-8 relative flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
              <Image 
                src={`/referanslar/${img}`} 
                alt={`Reference ${i}`} 
                fill
                className="object-contain"
                sizes="160px"
              />
            </div>
          ))}
        </div>
        
        {/* Duplicate for seamless infinite loop */}
        <div className="flex animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap min-w-full shrink-0" aria-hidden="true">
          {REFERENCES.map((img, i) => (
            <div key={`dup-${i}`} className="flex-none w-40 h-20 mx-8 relative flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
              <Image 
                src={`/referanslar/${img}`} 
                alt={`Reference ${i}`} 
                fill
                className="object-contain"
                sizes="160px"
              />
            </div>
          ))}
        </div>
        
      </div>
    </section>
  )
}
