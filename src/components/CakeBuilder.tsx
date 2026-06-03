'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Check, Layers, CakeSlice, PaintBucket, ChefHat, MessageCircle } from 'lucide-react'

// Sipariş Adımları Verileri
const STEPS = [
  { id: 1, title: 'Boyut Seçimi', icon: Layers },
  { id: 2, title: 'Kek ve İçerik', icon: CakeSlice },
  { id: 3, title: 'Dış Kaplama', icon: PaintBucket },
  { id: 4, title: 'Sipariş Özeti', icon: ChefHat },
]

const OPTIONS = {
  size: [
    { id: '6-8', name: '6-8 Kişilik', desc: 'Küçük Kutlamalar İçin (Tek Katlı)', price: '₺850' },
    { id: '10-12', name: '10-12 Kişilik', desc: 'Orta Boy Kutlamalar (Geniş Tek Kat)', price: '₺1200' },
    { id: '15-20', name: '15-20 Kişilik', desc: 'Kalabalık Partiler (İki Katlı)', price: '₺1850' },
  ],
  base: [
    { id: 'vanilla', name: 'Sade Vanilyalı Sünger', desc: 'Hafif ve klasik lezzet' },
    { id: 'cacao', name: 'Zengin Kakaolu Sünger', desc: 'Yoğun çikolata tutkunları için' },
    { id: 'redvelvet', name: 'Red Velvet (Kırmızı Kadife)', desc: 'Özel dokusuyla premium seçim' },
  ],
  filling: [
    { id: 'choco-banana', name: 'Çikolata & Muz', desc: 'Klasikleşmiş efsane uyum' },
    { id: 'raspberry-white', name: 'Frambuaz & Beyaz Çikolata', desc: 'Hafif ekşi ve tatlı dengesi' },
    { id: 'pistachio', name: 'Antep Fıstığı & Krokan', desc: 'Geleneksel lüks lezzet' },
  ],
  frosting: [
    { id: 'fondant', name: 'Şeker Hamuru', desc: 'Kusursuz pürüzsüzlük ve özel figürler için' },
    { id: 'ganache', name: 'Çikolata Ganaj', desc: 'Dripping efektli enfes çikolata kaplama' },
    { id: 'naked', name: 'Naked Cake', desc: 'Rustik, doğal ve kremalı görünüm' },
  ]
}

export default function CakeBuilder() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selections, setSelections] = useState({
    size: '',
    base: '',
    filling: '',
    frosting: '',
    note: ''
  })

  const handleSelect = (category: string, value: string) => {
    setSelections(prev => ({ ...prev, [category]: value }))
  }

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(prev => prev + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1)
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return selections.size !== '';
      case 2: return selections.base !== '' && selections.filling !== '';
      case 3: return selections.frosting !== '';
      default: return true;
    }
  }

  const handleOrder = () => {
    const sizeName = OPTIONS.size.find(o => o.id === selections.size)?.name
    const baseName = OPTIONS.base.find(o => o.id === selections.base)?.name
    const fillingName = OPTIONS.filling.find(o => o.id === selections.filling)?.name
    const frostingName = OPTIONS.frosting.find(o => o.id === selections.frosting)?.name
    
    const message = `Merhaba, özel bir pasta tasarladım ve sipariş vermek istiyorum:%0A%0A🎂 *Pasta Detayları*%0A- *Boyut:* ${sizeName}%0A- *Kek Tipi:* ${baseName}%0A- *İç Krema:* ${fillingName}%0A- *Dış Kaplama:* ${frostingName}%0A- *Özel Not/Yazı:* ${selections.note || 'Yok'}%0A%0ADetayları görüşebilir miyiz?`
    
    window.open(`https://wa.me/902164256114?text=${message}`, '_blank')
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      
      {/* Progress Header */}
      <div className="bg-gray-50 border-b border-gray-100 p-6 sm:p-8">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full hidden sm:block"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-dilim-portakal rounded-full transition-all duration-500 hidden sm:block"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          ></div>

          {STEPS.map((step) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isPassed = currentStep > step.id

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 bg-gray-50 px-2 sm:px-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive ? 'bg-dilim-portakal text-white shadow-lg scale-110' : 
                  isPassed ? 'bg-dilim-yaldiz text-white' : 'bg-white text-gray-400 border border-gray-200'
                }`}>
                  {isPassed ? <Check className="w-5 h-5 sm:w-6 sm:h-6" /> : <Icon className="w-5 h-5 sm:w-6 sm:h-6" />}
                </div>
                <span className={`text-xs sm:text-sm font-medium hidden sm:block ${isActive ? 'text-dilim-siyah' : 'text-gray-400'}`}>
                  {step.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 sm:p-12 min-h-[400px]">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: BOYUT */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-serif text-dilim-siyah mb-2">Pastanız Kaç Kişilik Olacak?</h3>
                <p className="text-gray-500">Misafir sayınıza en uygun boyutu seçin.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {OPTIONS.size.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect('size', opt.id)}
                    className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                      selections.size === opt.id 
                        ? 'border-dilim-portakal bg-orange-50 shadow-md transform scale-[1.02]' 
                        : 'border-gray-100 hover:border-dilim-portakal/30 hover:bg-gray-50'
                    }`}
                  >
                    <h4 className="text-lg font-bold text-dilim-siyah mb-1">{opt.name}</h4>
                    <p className="text-sm text-gray-500 mb-4">{opt.desc}</p>
                    <span className="inline-block px-3 py-1 bg-white rounded-full text-sm font-semibold text-dilim-yaldiz border border-gray-100">
                      Başlangıç: {opt.price}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: KEK VE İÇERİK */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-serif text-dilim-siyah mb-2">Lezzet Profili</h3>
                <p className="text-gray-500">Kek tipini ve iç dolgusunu belirleyin.</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-dilim-siyah mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-dilim-siyah text-white flex items-center justify-center text-xs">1</span>
                  Kek Tipi
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {OPTIONS.base.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect('base', opt.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selections.base === opt.id ? 'border-dilim-portakal bg-orange-50' : 'border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-bold text-dilim-siyah text-sm mb-1">{opt.name}</div>
                      <div className="text-xs text-gray-500">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-dilim-siyah mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-dilim-siyah text-white flex items-center justify-center text-xs">2</span>
                  İç Dolgu & Krema
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {OPTIONS.filling.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect('filling', opt.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selections.filling === opt.id ? 'border-dilim-portakal bg-orange-50' : 'border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-bold text-dilim-siyah text-sm mb-1">{opt.name}</div>
                      <div className="text-xs text-gray-500">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: DIŞ KAPLAMA */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-serif text-dilim-siyah mb-2">Dış Görünüm ve Kaplama</h3>
                <p className="text-gray-500">Pastanızın dışarıdan nasıl görüneceğini seçin.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {OPTIONS.frosting.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect('frosting', opt.id)}
                    className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                      selections.frosting === opt.id 
                        ? 'border-dilim-portakal bg-orange-50 shadow-md transform scale-[1.02]' 
                        : 'border-gray-100 hover:border-dilim-portakal/30 hover:bg-gray-50'
                    }`}
                  >
                    <h4 className="text-lg font-bold text-dilim-siyah mb-2">{opt.name}</h4>
                    <p className="text-sm text-gray-500">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 4: ÖZET VE SİPARİŞ */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h3 className="text-3xl font-serif text-dilim-siyah mb-2">Harika Bir Seçim!</h3>
                <p className="text-gray-500">Pastanızın detaylarını kontrol edin ve siparişinizi WhatsApp üzerinden tamamlayın.</p>
              </div>

              <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
                <ul className="space-y-4">
                  <li className="flex justify-between items-center border-b border-orange-100 pb-3">
                    <span className="text-gray-500">Boyut:</span>
                    <span className="font-bold text-dilim-siyah">{OPTIONS.size.find(o => o.id === selections.size)?.name}</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-orange-100 pb-3">
                    <span className="text-gray-500">Kek Tipi:</span>
                    <span className="font-bold text-dilim-siyah">{OPTIONS.base.find(o => o.id === selections.base)?.name}</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-orange-100 pb-3">
                    <span className="text-gray-500">İç Dolgu:</span>
                    <span className="font-bold text-dilim-siyah">{OPTIONS.filling.find(o => o.id === selections.filling)?.name}</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-500">Dış Kaplama:</span>
                    <span className="font-bold text-dilim-siyah">{OPTIONS.frosting.find(o => o.id === selections.frosting)?.name}</span>
                  </li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pasta Üzerine Yazılacak Not / Özel İstekleriniz</label>
                <textarea
                  value={selections.note}
                  onChange={(e) => handleSelect('note', e.target.value)}
                  placeholder="Örn: İyi ki doğdun Ayşe! Üzerinde prenses figürü olsun..."
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all resize-none h-32"
                ></textarea>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="bg-gray-50 border-t border-gray-100 p-6 flex justify-between items-center">
        <button
          onClick={prevStep}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
            currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          Geri
        </button>

        {currentStep < 4 ? (
          <button
            onClick={nextStep}
            disabled={!isStepValid()}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-medium transition-all ${
              isStepValid() 
                ? 'bg-dilim-siyah text-white hover:bg-dilim-portakal shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            İleri
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleOrder}
            className="flex items-center gap-2 px-8 py-3 rounded-full font-bold bg-[#25D366] text-white hover:bg-[#1EBE56] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp'tan Sipariş Ver
          </button>
        )}
      </div>

    </div>
  )
}
