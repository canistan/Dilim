"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronLeft, ChevronRight, Upload } from 'lucide-react'
import toast from 'react-hot-toast'

type WizardData = {
  cakeSize: string
  spongeType: string
  creamFlavor: string
  extraIngredients: string[]
  image: File | null
}

const steps = [
  { id: 1, title: 'Kişi Sayısı' },
  { id: 2, title: 'Kek Tipi' },
  { id: 3, title: 'Krema' },
  { id: 4, title: 'Ekstralar' },
  { id: 5, title: 'Tamamla' },
]

export const CakeWizard = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<WizardData>({
    cakeSize: '',
    spongeType: '',
    creamFlavor: '',
    extraIngredients: [],
    image: null,
  })

  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep((p) => p + 1)
  }

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((p) => p - 1)
  }

  const toggleExtra = (item: string) => {
    setData((prev) => ({
      ...prev,
      extraIngredients: prev.extraIngredients.includes(item)
        ? prev.extraIngredients.filter((i) => i !== item)
        : [...prev.extraIngredients, item],
    }))
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-dilim-siyah/5 overflow-hidden border border-gray-100">
      {/* Header Progress */}
      <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-dilim-portakal rounded-full z-0 transition-all duration-500 ease-in-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {steps.map((step) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                  isActive ? 'bg-dilim-portakal text-white shadow-lg shadow-dilim-portakal/40' : 
                  isCompleted ? 'bg-dilim-turuncu text-white' : 'bg-white text-gray-400 border-2 border-gray-200'
                }`}>
                  {isCompleted ? <Check className="w-5 h-5" /> : step.id}
                </div>
                <span className={`text-xs font-semibold ${isActive || isCompleted ? 'text-dilim-siyah' : 'text-gray-400'}`}>
                  {step.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8 md:p-12 min-h-[400px] flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col justify-center"
          >
            {/* Step 1 */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-3xl font-extrabold text-dilim-siyah mb-2">Kaç kişilik bir pasta hayal ediyorsunuz?</h3>
                <p className="text-gray-500">Pastanızın boyutunu belirlemek için kişi sayısını seçin.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  {['6-8 Kişilik', '10-12 Kişilik', '15-20 Kişilik', '20+ Kişilik'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setData({ ...data, cakeSize: size })}
                      className={`py-6 px-4 rounded-2xl border-2 font-bold transition-all ${
                        data.cakeSize === size 
                          ? 'border-dilim-portakal bg-dilim-portakal/10 text-dilim-portakal' 
                          : 'border-gray-100 hover:border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-3xl font-extrabold text-dilim-siyah mb-2">Kek tipini seçin</h3>
                <p className="text-gray-500">Pastanızın temelini oluşturacak sünger kek tipini belirleyin.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  {['Sade (Vanilyalı) Sünger Kek', 'Kakaolu Sünger Kek'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setData({ ...data, spongeType: type })}
                      className={`py-8 px-6 rounded-2xl border-2 font-bold text-lg text-left transition-all ${
                        data.spongeType === type 
                          ? 'border-dilim-portakal bg-dilim-portakal/10 text-dilim-portakal' 
                          : 'border-gray-100 hover:border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-3xl font-extrabold text-dilim-siyah mb-2">Krema Aroması</h3>
                <p className="text-gray-500">İç kremanızın lezzetini nasıl istersiniz?</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  {['Çikolatalı', 'Vanilyalı', 'Meyveli'].map((flavor) => (
                    <button
                      key={flavor}
                      onClick={() => setData({ ...data, creamFlavor: flavor })}
                      className={`py-6 px-4 rounded-2xl border-2 font-bold transition-all ${
                        data.creamFlavor === flavor 
                          ? 'border-dilim-portakal bg-dilim-portakal/10 text-dilim-portakal' 
                          : 'border-gray-100 hover:border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {flavor}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4 */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-3xl font-extrabold text-dilim-siyah mb-2">Ekstra Malzemeler</h3>
                <p className="text-gray-500">Pastanıza eklemek istediğiniz çıtır veya taze detaylar (Birden fazla seçebilirsiniz).</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                  {['Fıstık', 'Ceviz', 'Damla Çikolata', 'Muz', 'Çilek', 'Krokan'].map((item) => {
                    const isSelected = data.extraIngredients.includes(item)
                    return (
                      <button
                        key={item}
                        onClick={() => toggleExtra(item)}
                        className={`py-4 px-4 rounded-xl border-2 font-bold transition-all flex justify-between items-center ${
                          isSelected 
                            ? 'border-dilim-bordo bg-dilim-bordo/10 text-dilim-bordo' 
                            : 'border-gray-100 hover:border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {item}
                        {isSelected && <Check className="w-5 h-5 text-dilim-bordo" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 5 */}
            {currentStep === 5 && (
              <div className="space-y-6 text-center">
                <div className="w-20 h-20 bg-dilim-portakal/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-10 h-10 text-dilim-portakal" />
                </div>
                <h3 className="text-3xl font-extrabold text-dilim-siyah mb-2">Örnek Görsel Yükleyin</h3>
                <p className="text-gray-500 max-w-md mx-auto">Hayalinizdeki pastanın bir fotoğrafı veya taslağı varsa bizimle paylaşın.</p>
                
                <div className="mt-8">
                  <label className="cursor-pointer inline-flex items-center justify-center px-8 py-4 border-2 border-dashed border-dilim-portakal rounded-2xl bg-dilim-portakal/5 hover:bg-dilim-portakal/10 transition-colors text-dilim-portakal font-bold">
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setData({ ...data, image: e.target.files?.[0] || null })} />
                    {data.image ? data.image.name : 'Görsel Seç (.jpg, .png)'}
                  </label>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer Actions */}
        <div className="mt-12 flex items-center justify-between border-t border-gray-100 pt-8">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`flex items-center px-6 py-3 font-bold rounded-full transition-all ${
              currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-5 h-5 mr-2" /> Geri
          </button>
          
          <button
            onClick={currentStep === steps.length ? () => toast.success('Sipariş Onayına Gidiliyor!') : handleNext}
            className="flex items-center px-8 py-3 font-bold rounded-full bg-dilim-portakal hover:bg-dilim-turuncu text-white shadow-lg shadow-dilim-portakal/30 transition-all"
          >
            {currentStep === steps.length ? 'Sepete Ekle' : 'Devam Et'}
            {currentStep !== steps.length && <ChevronRight className="w-5 h-5 ml-2" />}
          </button>
        </div>
      </div>
    </div>
  )
}
