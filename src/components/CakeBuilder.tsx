'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Check, Layers, CakeSlice, PaintBucket, ChefHat, MessageCircle, User } from 'lucide-react'
import toast from 'react-hot-toast'

// Sipariş Adımları Verileri
const STEPS = [
  { id: 1, title: 'Boyut Seçimi', icon: Layers },
  { id: 2, title: 'Kek ve İçerik', icon: CakeSlice },
  { id: 3, title: 'Dış Kaplama', icon: PaintBucket },
  { id: 4, title: 'İletişim', icon: User },
  { id: 5, title: 'Özel Notlar', icon: ChefHat },
]

const OPTIONS = {
  size: [
    { id: '6-8', name: '6-8 Kişilik', desc: 'Küçük Kutlamalar İçin (Tek Katlı)', price: '₺850', image: '/images/builder/cake_size_small_1780532313283.png' },
    { id: '10-12', name: '10-12 Kişilik', desc: 'Orta Boy Kutlamalar (Geniş Tek Kat)', price: '₺1200', image: '/images/builder/cake_size_medium_1780532323926.png' },
    { id: '15-20+', name: '15-20+ Kişilik', desc: 'Kalabalık Partiler (İki Katlı)', price: '₺1850', image: '/images/builder/cake_size_large_1780532334670.png' },
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
    { id: 'strawberry-choco', name: 'Çilek & Çikolata', desc: 'Taze çilekler ve enfes çikolata uyumu' },
    { id: 'lotus-caramel', name: 'Lotus & Karamel', desc: 'Kıtır Lotus bisküvisi ve akışkan karamel' },
    { id: 'black-forest', name: 'Kara Orman (Black Forest)', desc: 'Vişne, kakao ve çikolata parçacıkları' },
    { id: 'banoffee', name: 'Muz & Karamel (Banoffee tarzı)', desc: 'Taze muz ve karamelin baş döndüren tadı' },
  ],
  frosting: [
    { id: 'fondant', name: 'Şeker Hamuru', desc: 'Kusursuz pürüzsüzlük ve özel figürler için' },
    { id: 'ganache', name: 'Çikolata Ganaj', desc: 'Dripping efektli enfes çikolata kaplama' },
    { id: 'naked', name: 'Naked Cake', desc: 'Rustik, doğal ve kremalı görünüm' },
  ]
}

export default function CakeBuilder() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [selections, setSelections] = useState({
    size: '',
    base: '',
    filling: '',
    frosting: '',
    note: '',
    referenceImage: null as File | null,
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const { status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/customer/me')
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setSelections(prev => ({
              ...prev,
              customerName: prev.customerName || (data.user.name + (data.user.surname ? ' ' + data.user.surname : '')).trim(),
              customerPhone: prev.customerPhone || data.user.phone || '',
              customerEmail: prev.customerEmail || data.user.email || '',
              // Sadece ilk adresi otomatik dolduralım varsa
              customerAddress: prev.customerAddress || (data.user.addresses && data.user.addresses.length > 0 ? data.user.addresses[0].address : '')
            }))
          }
        })
        .catch(console.error)
    }
  }, [status])

  const handleSelect = (category: string, value: string) => {
    setSelections(prev => ({ ...prev, [category]: value }))
  }

  const scrollToTop = () => {
    if (containerRef.current) {
      const y = containerRef.current.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1)
      setTimeout(scrollToTop, 100)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      setTimeout(scrollToTop, 100)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return selections.size !== '';
      case 2: return selections.base !== '' && selections.filling !== '';
      case 3: return selections.frosting !== '';
      case 4: return selections.customerName !== '' && selections.customerPhone !== '' && selections.customerAddress !== '';
      case 5: return true;
      default: return true;
    }
  }

  const handleOrder = async () => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('customerName', selections.customerName)
      formData.append('customerPhone', selections.customerPhone)
      formData.append('customerEmail', selections.customerEmail)
      formData.append('customerAddress', selections.customerAddress)
      formData.append('size', selections.size)
      formData.append('base', selections.base)
      formData.append('filling', selections.filling)
      formData.append('frosting', selections.frosting)
      formData.append('note', selections.note)
      if (selections.referenceImage) {
        formData.append('referenceImage', selections.referenceImage)
      }

      const res = await fetch('/api/custom-cakes', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setOrderId(data.id)
        setIsSuccess(true)
        
        const sizeName = OPTIONS.size.find(o => o.id === selections.size)?.name
        const baseName = OPTIONS.base.find(o => o.id === selections.base)?.name
        const fillingName = OPTIONS.filling.find(o => o.id === selections.filling)?.name
        const frostingName = OPTIONS.frosting.find(o => o.id === selections.frosting)?.name
        
        const message = `Merhaba, web siteniz üzerinden özel bir pasta tasarımı gönderdim (Talep No: ${data.id}). %0A%0A🎂 *Tasarım Özeti*%0A- *Ad Soyad:* ${selections.customerName}%0A- *Boyut:* ${sizeName}%0A- *Kek:* ${baseName}%0A- *Krema:* ${fillingName}%0A- *Kaplama:* ${frostingName}%0A%0AFiyat teklifinizi ve onayınızı bekliyorum.`
        
        // Yeni sekmede WhatsApp'ı aç (Popup engelleyiciye takılabilir, o yüzden butonu da sunacağız)
        window.open(`https://wa.me/905059638021?text=${message}`, '_blank')
      } else {
        toast.error("Talebiniz gönderilirken bir hata oluştu: " + data.error)
        setIsSubmitting(false)
      }
    } catch (err: unknown) {
      console.error(err)
      toast.error("Sistemsel bir hata oluştu. Lütfen tekrar deneyin.")
      setIsSubmitting(false)
    }
  }

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      
      {/* Progress Header */}
      <div className="bg-gray-50 border-b border-gray-100 p-6 sm:p-8">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full hidden sm:block"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-dilim-portakal rounded-full transition-all duration-500 hidden sm:block"
            style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
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
        {isSuccess ? (
          <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-3xl font-serif text-dilim-siyah mb-2">Tebrikler, Siparişinizi Aldık!</h3>
            <p className="text-gray-500 text-lg max-w-lg mx-auto">Özel pasta tasarım talebiniz bize ulaştı. Tasarımınızla ilgili detayları görüşmek ve teklif almak için WhatsApp üzerinden bizimle iletişime geçin.</p>
            
            <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100 max-w-2xl mx-auto text-left mt-8">
              <h4 className="font-bold text-dilim-siyah mb-4 border-b border-orange-100 pb-2">Sipariş Özeti (Talep No: {orderId})</h4>
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
                <li className="flex justify-between items-center border-b border-orange-100 pb-3">
                  <span className="text-gray-500">Dış Kaplama:</span>
                  <span className="font-bold text-dilim-siyah">{OPTIONS.frosting.find(o => o.id === selections.frosting)?.name}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-500">Teslimat Adresi:</span>
                  <span className="font-bold text-dilim-siyah max-w-[200px] truncate">{selections.customerAddress}</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 flex flex-col items-center gap-4">
              <a 
                href={`https://wa.me/905059638021?text=Merhaba, web siteniz üzerinden özel bir pasta tasarımı gönderdim (Talep No: ${orderId}).`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 rounded-2xl text-lg font-bold bg-[#25D366] text-white hover:bg-[#1EBE56] shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
              >
                <MessageCircle className="w-6 h-6" />
                WhatsApp ile Onayla
              </a>
              <p className="text-sm text-gray-400">Yeni sekme açılmadıysa yukarıdaki butona tıklayabilirsiniz.</p>
            </div>
          </div>
        ) : (
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
                    className={`p-6 rounded-2xl border-2 text-center flex flex-col items-center transition-all duration-300 ${
                      selections.size === opt.id 
                        ? 'border-dilim-portakal bg-orange-50 shadow-md transform scale-[1.02]' 
                        : 'border-gray-100 hover:border-dilim-portakal/30 hover:bg-gray-50'
                    }`}
                  >
                    <div className="relative w-full aspect-square mb-4 rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm">
                      <img src={opt.image} alt={opt.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                    <h4 className="text-lg font-bold text-dilim-siyah mb-1">{opt.name}</h4>
                    <p className="text-sm text-gray-500 mb-4">{opt.desc}</p>
                    <span className="inline-block px-3 py-1 mt-auto bg-white rounded-full text-sm font-semibold text-dilim-yaldiz border border-gray-100">
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

          {/* STEP 4: İLETİŞİM BİLGİLERİ */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h3 className="text-3xl font-serif text-dilim-siyah mb-2">İletişim & Teslimat Bilgileri</h3>
                <p className="text-gray-500">Sipariş teklifini size iletebilmemiz için lütfen iletişim bilgilerinizi giriniz.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad <span className="text-red-500">*</span></label>
                  <input type="text" value={selections.customerName} onChange={(e) => handleSelect('customerName', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all" placeholder="Adınız Soyadınız" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon <span className="text-red-500">*</span></label>
                  <input type="text" value={selections.customerPhone} onChange={(e) => handleSelect('customerPhone', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all" placeholder="0555 555 5555" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-Posta</label>
                  <input type="email" value={selections.customerEmail} onChange={(e) => handleSelect('customerEmail', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all" placeholder="ornek@email.com" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Açık Adres <span className="text-red-500">*</span></label>
                  <textarea value={selections.customerAddress} onChange={(e) => handleSelect('customerAddress', e.target.value)} rows={3} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all resize-none" placeholder="Teslimat adresinizi giriniz..."></textarea>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: ÖZEL NOTLAR VE GÖRSEL */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h3 className="text-3xl font-serif text-dilim-siyah mb-2">Özel Notlar & Görseller</h3>
                <p className="text-gray-500 font-medium">Pasta üzerine yazılacak yazıları ve benzerini istediğiniz referans görsellerini ekleyin.</p>
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

              <div className="mt-8 border-t border-gray-100 pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Örnek Görsel Yükle (İsteğe Bağlı)</label>
                <p className="text-xs text-gray-500 mb-4">Pastanızın benzemesini istediğiniz bir tasarım varsa referans olarak ekleyebilirsiniz.</p>
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${selections.referenceImage ? 'border-dilim-portakal bg-orange-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-dilim-portakal'}`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                      <svg className={`w-8 h-8 mb-3 ${selections.referenceImage ? 'text-dilim-portakal' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                      {selections.referenceImage ? (
                        <>
                          <p className="text-sm font-bold text-dilim-siyah mb-1">Görsel Eklendi</p>
                          <p className="text-xs text-dilim-portakal truncate max-w-[250px]">{selections.referenceImage.name}</p>
                        </>
                      ) : (
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Görsel seçmek için tıklayın</span> veya sürükleyin</p>
                      )}
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={(e) => {
                      if(e.target.files && e.target.files[0]) {
                        handleSelect('referenceImage', e.target.files[0] as unknown as string)
                      }
                    }} />
                  </label>
                </div>
              </div>

              <div className="mt-10 flex justify-center">
                <button
                  onClick={handleOrder}
                  disabled={!isStepValid() || isSubmitting}
                  className={`flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-5 rounded-2xl text-lg font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all ${
                    !isStepValid() || isSubmitting
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#25D366] to-[#1EBE56] text-white hover:from-[#1EBE56] hover:to-[#128C7E]'
                  }`}
                >
                  <MessageCircle className="w-6 h-6" />
                  {isSubmitting ? 'Gönderiliyor...' : 'Tasarımımı Gönder & Teklif İste'}
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
        )}
      </div>

      {/* Footer Navigation */}
      {!isSuccess && (
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

          {currentStep < 5 && (
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
          )}
        </div>
      )}

    </div>
  )
}
