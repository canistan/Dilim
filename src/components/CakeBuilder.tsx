'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Check, Layers, CakeSlice, PaintBucket, ChefHat, MessageCircle, User, MapPin, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

// Sipariş Adımları Verileri
const STEPS = [
  { id: 1, title: 'Krema Çeşidi', icon: PaintBucket },
  { id: 2, title: 'Kek Çeşidi', icon: CakeSlice },
  { id: 3, title: 'İçerik', icon: Layers },
  { id: 4, title: 'Yapı & Şekil', icon: Layers },
  { id: 5, title: 'Kişi Sayısı', icon: User },
  { id: 6, title: 'Teslimat', icon: MapPin },
  { id: 7, title: 'Notlar', icon: ChefHat },
]

const OPTIONS = {
  krema: [
    { id: 'Çikolata Kremalı', name: 'Çikolata Kremalı', desc: 'Yoğun çikolata lezzeti', color: 'from-amber-700 to-amber-900' },
    { id: 'Beyaz Kremalı', name: 'Beyaz Kremalı', desc: 'Hafif ve sade vanilya dokunuşu', color: 'from-orange-100 to-orange-50 text-gray-800' },
    { id: 'Akışkan Kremalı', name: 'Akışkan Kremalı', desc: 'Taze, ıslak ve akışkan doku', color: 'from-orange-400 to-dilim-portakal' },
  ],
  kek: [
    { id: 'Çikolatalı Kek', name: 'Çikolatalı Kek', desc: 'Klasik yoğun kakaolu sünger', color: 'from-amber-800 to-amber-950' },
    { id: 'Beyaz Kek', name: 'Beyaz Kek', desc: 'Sade, yumuşacık sünger kek', color: 'from-gray-100 to-gray-50' },
  ],
  icerik: [
    { id: 'Çilekli', name: 'Çilekli' },
    { id: 'Muzlu', name: 'Muzlu' },
    { id: 'Karışık Meyveli', name: 'Karışık Meyveli' },
    { id: 'Profiterollü', name: 'Profiterollü' },
    { id: 'Fıstıklı', name: 'Fıstıklı' },
    { id: 'Parça Çikolatalı', name: 'Parça Çikolatalı' },
    { id: 'Frambuazlı', name: 'Frambuazlı' },
    { id: 'Böğürtlenli', name: 'Böğürtlenli' },
    { id: 'Krokanlı', name: 'Krokanlı' },
    { id: 'Kestaneli', name: 'Kestaneli' },
    { id: 'Orman Meyveli', name: 'Orman Meyveli' },
    { id: 'Oreolu', name: 'Oreolu' },
    { id: 'Lotus Bisküvili', name: 'Lotus Bisküvili' },
  ],
  pat: [
    { id: 'Standart Pat', name: 'Standart Pat (Normal Yükseklik)' },
    { id: 'Yüksek Pat', name: 'Yüksek Pat (Gösterişli)' },
  ],
  sekil: [
    { id: 'Yuvarlak', name: 'Yuvarlak (Klasik)' },
    { id: 'Kare', name: 'Kare (Modern)' },
    { id: 'Kalp', name: 'Kalp (Romantik)' },
    { id: 'Diğer', name: 'Özel Şekil (Notlarda)' },
  ],
  kisi: [
    { id: '10 Kişilik', name: '10 Kişilik' },
    { id: '15 Kişilik', name: '15 Kişilik' },
    { id: '20 Kişilik', name: '20 Kişilik' },
    { id: '25 Kişilik', name: '25 Kişilik' },
    { id: '30 Kişilik ve Üzeri', name: '30 Kişilik ve Üzeri (Büyük)' },
  ]
}

type TimeSlot = {
  id: string | number;
  timeRange: string;
}

export default function CakeBuilder({ timeSlots = [], contactSettings }: { timeSlots?: TimeSlot[], globalOptions?: any, contactSettings?: any }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)
  const [whatsappMessage, setWhatsappMessage] = useState('')
  const [orderId, setOrderId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const [selections, setSelections] = useState<{
    krema: string; kek: string; icerik: string[]; pat: string; sekil: string; kisi: string;
    note: string; customerName: string; customerPhone: string; customerEmail: string;
    customerAddress: string; requestedDate: string; timeSlot: string; referenceImage: File | null;
  }>({
    krema: '', kek: '', icerik: [], pat: '', sekil: '', kisi: '',
    note: '', customerName: '', customerPhone: '', customerEmail: '',
    customerAddress: '', requestedDate: '', timeSlot: '', referenceImage: null
  })

  const [userAddresses, setUserAddresses] = useState<any[]>([])
  const [selectedAddressType, setSelectedAddressType] = useState<'saved' | 'new'>('saved')

  const getMinDate = () => {
    const now = new Date();
    now.setDate(now.getDate() + 1);
    if (now.getDay() === 6) {
      now.setDate(now.getDate() + 2);
    } else if (now.getDay() === 0) {
      now.setDate(now.getDate() + 1);
    }
    return now.toISOString().split('T')[0];
  }

  const handleDateChange = (val: string) => {
    if (!val) {
      handleSelect('requestedDate', '');
      return;
    }
    const selectedDate = new Date(val);
    const day = selectedDate.getDay();
    if (day === 0 || day === 6) {
      toast.error("Hafta sonları (Cumartesi ve Pazar) özel sipariş alamıyoruz. Lütfen hafta içi bir gün seçiniz.");
      handleSelect('requestedDate', '');
      return;
    }
    handleSelect('requestedDate', val);
  }

  const getFilteredTimeSlots = () => {
    return timeSlots.length > 0 ? timeSlots : [
      { id: '1', timeRange: "10:00 - 14:00" },
      { id: '2', timeRange: "14:00 - 18:00" }
    ];
  }

  const { status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/customer/me')
        .then(res => res.json())
        .then(data => {
          if (data.customer) {
            setSelections(prev => ({
              ...prev,
              customerName: `${data.customer.firstName || ''} ${data.customer.lastName || ''}`.trim(),
              customerPhone: data.customer.phone || '',
              customerEmail: data.customer.email || '',
              customerAddress: data.customer.address || '',
            }))
            
            if (data.customer.savedAddresses && data.customer.savedAddresses.length > 0) {
              setUserAddresses(data.customer.savedAddresses)
              const defaultAddr = data.customer.savedAddresses.find((a:any) => a.isDefault) || data.customer.savedAddresses[0]
              setSelections(prev => ({
                ...prev,
                customerAddress: `${defaultAddr.district} - ${defaultAddr.details}`
              }))
            }
          }
        })
        .catch(err => console.error("Kullanıcı bilgileri alınamadı:", err))
    }
  }, [status])

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleSelect = (key: string, value: any) => {
    setSelections(prev => ({ ...prev, [key]: value }))
  }

  const handleToggleIcerik = (id: string) => {
    setSelections(prev => {
      const exists = prev.icerik.includes(id);
      if (exists) {
        return { ...prev, icerik: prev.icerik.filter(item => item !== id) }
      } else {
        if (prev.icerik.length >= 3) {
          toast.error("En fazla 3 içerik seçebilirsiniz.");
          return prev;
        }
        return { ...prev, icerik: [...prev.icerik, id] }
      }
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Dosya boyutu 5MB'dan küçük olmalıdır.")
        return
      }
      handleSelect('referenceImage', file)
    }
  }

  const nextStep = () => {
    if (currentStep < STEPS.length && isStepValid()) {
      setCurrentStep(prev => prev + 1)
      setTimeout(scrollToTop, 100)
    } else {
      toast.error('Lütfen bu adımdaki gerekli seçimleri yapınız.')
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
      case 1: return selections.krema !== '';
      case 2: return selections.kek !== '';
      case 3: return selections.icerik.length > 0 && selections.icerik.length <= 3;
      case 4: return selections.pat !== '' && selections.sekil !== '';
      case 5: return selections.kisi !== '';
      case 6: return selections.customerName !== '' && selections.customerPhone !== '' && selections.customerAddress !== '' && selections.requestedDate !== '' && selections.timeSlot !== '';
      case 7: return true;
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
      formData.append('size', selections.kisi)
      formData.append('base', selections.kek)
      formData.append('filling', selections.icerik.join(', '))
      formData.append('frosting', selections.krema)
      const fullNote = `Pat Sayısı: ${selections.pat} | Şekil: ${selections.sekil}\\nÖzel Not: ${selections.note}`
      formData.append('note', fullNote)
      formData.append('requestedDate', selections.requestedDate)
      formData.append('timeSlot', selections.timeSlot)
      
      if (selections.referenceImage) {
        formData.append('referenceImage', selections.referenceImage, selections.referenceImage.name || 'image.jpg')
      }

      const res = await fetch('/api/custom-cakes', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setOrderId(data.id)
        
        let mediaUrlStr = '';
        if (data.mediaUrl) {
          if (data.mediaUrl.startsWith('http')) {
            mediaUrlStr = data.mediaUrl;
          } else {
            mediaUrlStr = `${window.location.origin}${data.mediaUrl.startsWith('/') ? '' : '/'}${data.mediaUrl}`;
          }
        }
        
        const rawMessage = `Merhaba, web siteniz üzerinden özel bir pasta tasarımı gönderdim (Talep No: ${data.id}).\n\n👤 *İletişim Bilgilerim*\n- *Ad Soyad:* ${selections.customerName}\n- *Adres:* ${selections.customerAddress}\n- *İstenen Teslimat:* ${selections.requestedDate} (${selections.timeSlot})\n\n🎂 *Tasarım Özeti*\n- *Kişi Sayısı:* ${selections.kisi}\n- *Krema:* ${selections.krema}\n- *Kek:* ${selections.kek}\n- *İçerikler:* ${selections.icerik.join(', ')}\n- *Yapı & Şekil:* ${selections.pat}, ${selections.sekil}\n- *Özel Not:* ${selections.note || 'Yok'}\n${mediaUrlStr ? `\n📎 *Referans Görselim:* ${mediaUrlStr}\n` : ''}Fiyat teklifinizi ve onayınızı bekliyorum.`;

        const encodedMessage = encodeURIComponent(rawMessage);
        setWhatsappMessage(encodedMessage)
        setIsSuccess(true)
        
        const waNumber = contactSettings?.phone?.replace(/[^0-9]/g, '') || '905059638021';
        window.open(`https://wa.me/${waNumber}?text=${encodedMessage}`, '_blank')
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {OPTIONS.krema.map((opt) => (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} key={opt.id} onClick={() => handleSelect('krema', opt.id)} 
                className={`relative group cursor-pointer overflow-hidden rounded-[2rem] border-2 transition-all duration-300 min-h-[160px] flex flex-col justify-end p-6 
                ${selections.krema === opt.id ? 'border-dilim-portakal shadow-[0_8px_30px_rgba(234,88,12,0.2)]' : 'border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]'}`}>
                
                <div className={`absolute inset-0 bg-gradient-to-br ${opt.color} opacity-[0.85] transition-opacity duration-300 ${selections.krema === opt.id ? 'opacity-100' : 'group-hover:opacity-100'}`} />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-black text-2xl tracking-tight ${opt.id === 'Beyaz Kremalı' ? 'text-gray-900' : 'text-white'}`}>{opt.name}</h3>
                    {selections.krema === opt.id && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                        <Check className={`w-5 h-5 ${opt.id === 'Beyaz Kremalı' ? 'text-gray-900' : 'text-white'}`} />
                      </motion.div>
                    )}
                  </div>
                  <p className={`font-medium ${opt.id === 'Beyaz Kremalı' ? 'text-gray-600' : 'text-white/80'}`}>{opt.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {OPTIONS.kek.map((opt) => (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} key={opt.id} onClick={() => handleSelect('kek', opt.id)} 
                className={`relative group cursor-pointer overflow-hidden rounded-[2rem] border-2 transition-all duration-300 min-h-[180px] flex flex-col justify-end p-8 
                ${selections.kek === opt.id ? 'border-dilim-portakal shadow-[0_8px_30px_rgba(234,88,12,0.2)]' : 'border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.06)] bg-white'}`}>
                
                <div className={`absolute inset-0 bg-gradient-to-br ${opt.color} opacity-90 transition-opacity duration-300 ${selections.kek === opt.id ? 'opacity-100' : 'group-hover:opacity-100'}`} />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-black text-3xl tracking-tight ${opt.id === 'Beyaz Kek' ? 'text-gray-900' : 'text-white'}`}>{opt.name}</h3>
                    {selections.kek === opt.id && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-8 h-8 bg-black/10 backdrop-blur-md rounded-full flex items-center justify-center">
                        <Check className={`w-5 h-5 ${opt.id === 'Beyaz Kek' ? 'text-gray-900' : 'text-white'}`} />
                      </motion.div>
                    )}
                  </div>
                  <p className={`font-medium text-lg ${opt.id === 'Beyaz Kek' ? 'text-gray-600' : 'text-white/80'}`}>{opt.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="max-w-5xl mx-auto">
            <div className="bg-orange-50/50 rounded-2xl p-4 mb-8 flex items-center gap-3 border border-orange-100">
              <Sparkles className="w-6 h-6 text-dilim-portakal shrink-0" />
              <p className="text-gray-700 font-medium">Kusursuz bir lezzet dengesi için <span className="font-bold text-dilim-siyah">en az 1, en fazla 3</span> özel içerik seçebilirsiniz.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {OPTIONS.icerik.map((opt) => {
                const isSelected = selections.icerik.includes(opt.id);
                return (
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} key={opt.id} onClick={() => handleToggleIcerik(opt.id)} 
                    className={`relative p-5 rounded-2xl border-2 font-bold transition-all duration-300 flex items-center justify-center text-center
                    ${isSelected ? 'border-dilim-portakal bg-gradient-to-br from-dilim-portakal to-orange-500 text-white shadow-lg shadow-orange-500/25' : 'border-gray-100 bg-white text-gray-600 hover:border-orange-200 hover:bg-orange-50'}`}>
                    {isSelected && <Check className="w-5 h-5 absolute top-2 right-2 text-white/80" />}
                    {opt.name}
                  </motion.button>
                )
              })}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <Layers className="w-8 h-8 text-dilim-portakal" />
                <h4 className="text-2xl font-black text-gray-900 tracking-tight">Katman & Yükseklik</h4>
              </div>
              <div className="flex flex-col gap-4">
                {OPTIONS.pat.map((opt) => (
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} key={opt.id} onClick={() => handleSelect('pat', opt.id)} 
                    className={`p-6 rounded-[2rem] border-2 font-bold text-lg cursor-pointer transition-all flex items-center justify-between
                    ${selections.pat === opt.id ? 'border-dilim-portakal bg-orange-50 text-dilim-portakal shadow-md' : 'border-gray-100 bg-white text-gray-600 hover:border-orange-200'}`}>
                    {opt.name}
                    {selections.pat === opt.id && <Check className="w-6 h-6 text-dilim-portakal" />}
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <CakeSlice className="w-8 h-8 text-dilim-portakal" />
                <h4 className="text-2xl font-black text-gray-900 tracking-tight">Pasta Şekli</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {OPTIONS.sekil.map((opt) => (
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} key={opt.id} onClick={() => handleSelect('sekil', opt.id)} 
                    className={`p-6 text-center font-bold rounded-3xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-2
                    ${selections.sekil === opt.id ? 'border-dilim-portakal bg-orange-50 text-dilim-portakal shadow-md' : 'border-gray-100 bg-white text-gray-600 hover:border-orange-200'}`}>
                    {opt.name}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {OPTIONS.kisi.map((opt) => (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} key={opt.id} onClick={() => handleSelect('kisi', opt.id)} 
                className={`relative cursor-pointer rounded-3xl p-6 border-2 transition-all duration-300 flex flex-col items-center justify-center text-center h-40
                ${selections.kisi === opt.id ? 'border-dilim-portakal bg-gradient-to-b from-orange-50 to-orange-100 shadow-lg shadow-orange-500/20' : 'border-gray-100 bg-white hover:border-orange-200 hover:shadow-md'}`}>
                {selections.kisi === opt.id && <div className="absolute top-3 right-3"><Check className="w-5 h-5 text-dilim-portakal" /></div>}
                <User className={`w-10 h-10 mb-3 ${selections.kisi === opt.id ? 'text-dilim-portakal' : 'text-gray-300'}`} />
                <h3 className={`font-black text-lg ${selections.kisi === opt.id ? 'text-dilim-siyah' : 'text-gray-500'}`}>{opt.name}</h3>
              </motion.div>
            ))}
          </div>
        );
      case 6:
        return (
          <div className="max-w-5xl mx-auto">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Sol: İletişim */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-dilim-portakal">
                    <User className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-2xl text-gray-900 tracking-tight">Kişisel Bilgiler</h3>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Ad Soyad <span className="text-red-500">*</span></label>
                    <input type="text" value={selections.customerName} onChange={(e) => handleSelect('customerName', e.target.value)} 
                      className="w-full px-5 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl focus:ring-0 focus:border-dilim-portakal outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400" placeholder="Örn: Ayşe Yılmaz" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Telefon <span className="text-red-500">*</span></label>
                      <input type="tel" value={selections.customerPhone} onChange={(e) => handleSelect('customerPhone', e.target.value)} 
                        className="w-full px-5 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl focus:ring-0 focus:border-dilim-portakal outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400" placeholder="05XX XXX XX XX" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">E-posta</label>
                      <input type="email" value={selections.customerEmail} onChange={(e) => handleSelect('customerEmail', e.target.value)} 
                        className="w-full px-5 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl focus:ring-0 focus:border-dilim-portakal outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400" placeholder="Opsiyonel" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sağ: Teslimat */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-dilim-portakal">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-2xl text-gray-900 tracking-tight">Teslimat Detayları</h3>
                </div>

                <div className="space-y-6">
                  {status === 'authenticated' && userAddresses.length > 0 && (
                    <div>
                      <div className="flex bg-gray-50 rounded-xl p-1 mb-4 border border-gray-100">
                        <button onClick={() => setSelectedAddressType('saved')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${selectedAddressType === 'saved' ? 'bg-white shadow-sm text-dilim-portakal' : 'text-gray-500 hover:text-gray-700'}`}>Kayıtlı Adresler</button>
                        <button onClick={() => setSelectedAddressType('new')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${selectedAddressType === 'new' ? 'bg-white shadow-sm text-dilim-portakal' : 'text-gray-500 hover:text-gray-700'}`}>Yeni Adres Gir</button>
                      </div>

                      {selectedAddressType === 'saved' && (
                        <select className="w-full px-5 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl focus:ring-0 focus:border-dilim-portakal outline-none transition-all font-medium text-gray-900 appearance-none"
                          onChange={(e) => { const addr = userAddresses.find(a => a.id === e.target.value); if (addr) handleSelect('customerAddress', `${addr.district} - ${addr.details}`); }}>
                          <option value="">Kayıtlı Adres Seçin</option>
                          {userAddresses.map((addr) => <option key={addr.id} value={addr.id}>{addr.title} ({addr.district})</option>)}
                        </select>
                      )}
                    </div>
                  )}
                  
                  {(status !== 'authenticated' || selectedAddressType === 'new') && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Teslimat Adresi <span className="text-red-500">*</span></label>
                      <textarea value={selections.customerAddress} onChange={(e) => handleSelect('customerAddress', e.target.value)} rows={3} 
                        className="w-full px-5 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl focus:ring-0 focus:border-dilim-portakal outline-none transition-all font-medium text-gray-900 resize-none placeholder:text-gray-400" placeholder="Açık adresinizi detaylıca giriniz..."></textarea>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Tarih <span className="text-red-500">*</span></label>
                      <input type="date" min={getMinDate()} value={selections.requestedDate} onChange={(e) => handleDateChange(e.target.value)} 
                        className="w-full px-5 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl focus:ring-0 focus:border-dilim-portakal outline-none transition-all font-medium text-gray-900" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Saat <span className="text-red-500">*</span></label>
                      <select value={selections.timeSlot} onChange={(e) => handleSelect('timeSlot', e.target.value)} 
                        className="w-full px-5 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl focus:ring-0 focus:border-dilim-portakal outline-none transition-all font-medium text-gray-900 appearance-none">
                        <option value="" disabled>Saat Aralığı</option>
                        {getFilteredTimeSlots().map((slot) => <option key={slot.id} value={slot.timeRange}>{slot.timeRange}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <div className="text-center mb-10">
              <h3 className="font-black text-3xl text-gray-900 mb-3">Tasarımınızı Kişiselleştirin</h3>
              <p className="text-gray-500 font-medium">Özel bir mesajınız, şekil isteğiniz veya referans görseliniz varsa bize iletin.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">Referans Görsel (Opsiyonel)</label>
                <label className={`flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-3xl cursor-pointer transition-all ${selections.referenceImage ? 'border-dilim-portakal bg-orange-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'}`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                    {selections.referenceImage ? (
                      <>
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4 text-dilim-portakal">
                          <Check className="w-8 h-8" />
                        </div>
                        <p className="text-sm font-bold text-dilim-siyah mb-1">Görsel Eklendi</p>
                        <p className="text-xs text-gray-500 max-w-[200px] truncate">{selections.referenceImage.name}</p>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-gray-400">
                          <PaintBucket className="w-8 h-8" />
                        </div>
                        <p className="text-sm font-bold text-gray-700 mb-1">Dosya Yükle</p>
                        <p className="text-xs text-gray-500">Tıkla veya Sürükle (Maks 5MB)</p>
                      </>
                    )}
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e)} />
                </label>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">Ek Notlar & Üzerine Yazılacaklar</label>
                <textarea value={selections.note} onChange={(e) => handleSelect('note', e.target.value)} 
                  className="w-full h-56 p-6 bg-gray-50/50 border-2 border-gray-100 rounded-3xl focus:ring-0 focus:border-dilim-portakal outline-none transition-all font-medium text-gray-900 resize-none placeholder:text-gray-400" 
                  placeholder="İyi ki doğdun Can..., Pembe renk tonları olsun..., İçinde ekstra fındık olabilir mi? vb."></textarea>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-orange-50 py-16 px-4 sm:px-6 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/80 backdrop-blur-xl border border-white rounded-[3rem] p-10 sm:p-16 shadow-[0_20px_60px_rgb(0,0,0,0.05)] text-center max-w-2xl w-full">
          <div className="w-32 h-32 bg-gradient-to-tr from-green-400 to-green-300 rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl shadow-green-500/20">
            <Check className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Harika! Tasarımınız Alındı.</h2>
          <p className="text-gray-600 mb-10 text-xl leading-relaxed">
            Pasta detaylarınız sistemimize ulaştı <span className="font-bold text-gray-900">(Talep No: {orderId})</span>.<br/>Şimdi fiyat teklifi almak ve siparişi kesinleştirmek için WhatsApp'a yönlendirileceksiniz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`https://wa.me/${contactSettings?.phone?.replace(/[^0-9]/g, '') || '905059638021'}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" 
              className="bg-[#25D366] text-white rounded-2xl px-8 py-5 font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#128C7E] transition-all hover:shadow-lg hover:shadow-[#25D366]/30 hover:-translate-y-1">
              <MessageCircle className="w-6 h-6" /> WhatsApp İle Onayla
            </a>
            <Link href="/urunler" className="bg-white text-gray-900 border-2 border-gray-200 rounded-2xl px-8 py-5 font-bold text-lg hover:border-gray-300 transition-all hover:-translate-y-1">
              Alışverişe Dön
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-orange-50 pb-20 pt-10" ref={scrollRef}>
      
      {/* Premium Header */}
      <div className="text-center max-w-3xl mx-auto px-4 mb-12">
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight mb-6">Hayalindeki Pastayı <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-dilim-portakal to-orange-400">Bizimle Tasarla</span></h1>
        <p className="text-lg md:text-xl text-gray-600 font-medium">Adım adım seçimlerini yap, ustalarımız hayallerini gerçeğe dönüştürsün. Tamamen sana özel, eşsiz bir lezzet serüveni.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-[0_20px_60px_rgb(0,0,0,0.03)] border border-white overflow-hidden">
          
          {/* Stepper (Progress) */}
          <div className="border-b border-gray-100/50 bg-white/40 px-6 sm:px-12 py-8">
            <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4 hide-scrollbar gap-4 sm:gap-0">
              {STEPS.map((step, index) => {
                const Icon = step.icon
                const isActive = currentStep === step.id
                const isPassed = currentStep > step.id

                return (
                  <div key={step.id} className="flex flex-col items-center relative min-w-[90px] group">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-all duration-500 z-10
                      ${isActive ? 'bg-gradient-to-br from-dilim-portakal to-orange-500 text-white shadow-xl shadow-orange-500/30 scale-110' 
                        : isPassed ? 'bg-gray-900 text-white shadow-lg' 
                        : 'bg-white text-gray-400 border-2 border-gray-100'}`}>
                      {isPassed ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <span className={`text-[11px] sm:text-xs font-black uppercase tracking-widest text-center transition-colors duration-300
                      ${isActive ? 'text-dilim-portakal' : isPassed ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.title}
                    </span>
                    {index < STEPS.length - 1 && (
                      <div className="absolute top-7 left-[50%] w-full h-1 -z-0 bg-gray-100 rounded-full" style={{ width: 'calc(100% + 2rem)' }}>
                        <motion.div 
                          className="h-full bg-gradient-to-r from-gray-900 to-gray-700 rounded-full"
                          initial={{ width: '0%' }}
                          animate={{ width: isPassed ? '100%' : '0%' }}
                          transition={{ duration: 0.5, ease: 'easeInOut' }}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="p-6 sm:p-12 md:p-16 min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div key={currentStep} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: "easeOut" }}>
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          <div className="bg-white/40 border-t border-gray-100/50 p-6 sm:px-12 sm:py-8 flex items-center justify-between">
            <button onClick={prevStep} className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-600 bg-white hover:bg-gray-50 shadow-sm border border-gray-100 hover:shadow-md'}`}>
              <ChevronLeft className="w-6 h-6" /> Geri
            </button>
            
            {currentStep < STEPS.length ? (
              <button onClick={nextStep} disabled={!isStepValid()} className={`flex items-center gap-2 px-10 py-4 rounded-2xl font-bold text-lg transition-all ${isStepValid() ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/20 hover:bg-black hover:-translate-y-1' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                Sonraki Adım <ChevronRight className="w-6 h-6" />
              </button>
            ) : (
              <button onClick={handleOrder} disabled={!isStepValid() || isSubmitting} className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-lg transition-all ${!isStepValid() || isSubmitting ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-dilim-portakal to-orange-500 text-white shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:-translate-y-1'}`}>
                {isSubmitting ? 'Gönderiliyor...' : (
                  <>
                    <MessageCircle className="w-6 h-6" /> Gönder & Fiyat Al
                  </>
                )}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
