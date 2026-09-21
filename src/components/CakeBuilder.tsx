'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Check, Layers, CakeSlice, PaintBucket, ChefHat, MessageCircle, User, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'

// Sipariş Adımları Verileri
const STEPS = [
  { id: 1, title: 'Krema Çeşidi', icon: PaintBucket },
  { id: 2, title: 'Kek Çeşidi', icon: CakeSlice },
  { id: 3, title: 'İçerik Çeşitleri', icon: Layers },
  { id: 4, title: 'Yapı ve Şekil', icon: Layers },
  { id: 5, title: 'Kişi Sayısı', icon: User },
  { id: 6, title: 'İletişim & Teslimat', icon: MapPin },
  { id: 7, title: 'Özel Notlar', icon: ChefHat },
]

const OPTIONS = {
  krema: [
    { id: 'Çikolata Kremalı', name: 'Çikolata Kremalı', desc: 'Yoğun çikolata lezzeti' },
    { id: 'Beyaz Kremalı', name: 'Beyaz Kremalı', desc: 'Hafif ve sade' },
    { id: 'Akışkan Kremalı', name: 'Akışkan Kremalı', desc: 'Taze ve akışkan doku' },
  ],
  kek: [
    { id: 'Çikolatalı Kek', name: 'Çikolatalı Kek', desc: 'Klasik kakaolu' },
    { id: 'Beyaz Kek', name: 'Beyaz Kek', desc: 'Sade sünger kek' },
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
    { id: 'Standart Pat', name: 'Standart Pat' },
    { id: 'Yüksek Pat', name: 'Yüksek Pat' },
  ],
  sekil: [
    { id: 'Yuvarlak', name: 'Yuvarlak (Standart)' },
    { id: 'Kare', name: 'Kare' },
    { id: 'Kalp', name: 'Kalp' },
    { id: 'Diğer', name: 'Diğer (Notlarda belirtin)' },
  ],
  kisi: [
    { id: '10 Kişilik', name: '10 Kişilik' },
    { id: '15 Kişilik', name: '15 Kişilik' },
    { id: '20 Kişilik', name: '20 Kişilik' },
    { id: '25 Kişilik', name: '25 Kişilik' },
    { id: '30 Kişilik ve Üzeri', name: '30 Kişilik ve Üzeri (Not)' },
  ]
}

type TimeSlot = {
  id: string | number;
  timeRange: string;
}

export default function CakeBuilder({ timeSlots = [], globalOptions, contactSettings }: { timeSlots?: TimeSlot[], globalOptions?: any, contactSettings?: any }) {
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
      toast.error('Lütfen gerekli seçimleri yapınız.')
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {OPTIONS.krema.map((opt) => (
              <div key={opt.id} onClick={() => handleSelect('krema', opt.id)} className={`relative group cursor-pointer rounded-3xl p-6 border-2 transition-all duration-300 hover:shadow-xl ${selections.krema === opt.id ? 'border-dilim-portakal bg-orange-50' : 'border-gray-100 bg-white hover:border-orange-200'}`}>
                {selections.krema === opt.id && <div className="absolute top-4 right-4 w-6 h-6 bg-dilim-portakal rounded-full flex items-center justify-center"><Check className="w-4 h-4 text-white" /></div>}
                <div className="mt-4">
                  <h3 className="font-bold text-lg text-dilim-siyah mb-2 group-hover:text-dilim-portakal transition-colors">{opt.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{opt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {OPTIONS.kek.map((opt) => (
              <div key={opt.id} onClick={() => handleSelect('kek', opt.id)} className={`relative group cursor-pointer rounded-3xl p-6 border-2 transition-all duration-300 hover:shadow-xl ${selections.kek === opt.id ? 'border-dilim-portakal bg-orange-50' : 'border-gray-100 bg-white hover:border-orange-200'}`}>
                {selections.kek === opt.id && <div className="absolute top-4 right-4 w-6 h-6 bg-dilim-portakal rounded-full flex items-center justify-center"><Check className="w-4 h-4 text-white" /></div>}
                <div className="mt-4">
                  <h3 className="font-bold text-lg text-dilim-siyah mb-2 group-hover:text-dilim-portakal transition-colors">{opt.name}</h3>
                  <p className="text-sm text-gray-500">{opt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        );
      case 3:
        return (
          <div>
            <p className="mb-4 text-gray-500 text-sm">Lütfen en az 1, en fazla 3 içerik seçiniz.</p>
            <div className="flex flex-wrap gap-3">
              {OPTIONS.icerik.map((opt) => {
                const isSelected = selections.icerik.includes(opt.id);
                return (
                  <button key={opt.id} onClick={() => handleToggleIcerik(opt.id)} className={`px-4 py-2 rounded-full border-2 font-medium transition-all ${isSelected ? 'border-dilim-portakal bg-dilim-portakal text-white shadow-md' : 'border-gray-200 text-gray-600 hover:border-dilim-portakal hover:text-dilim-portakal'}`}>
                    {isSelected && <Check className="w-4 h-4 inline-block mr-1" />}
                    {opt.name}
                  </button>
                )
              })}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8">
            <div>
              <h4 className="text-lg font-bold mb-4 border-b pb-2">Pat Sayısı (Pasta Katı)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {OPTIONS.pat.map((opt) => (
                  <div key={opt.id} onClick={() => handleSelect('pat', opt.id)} className={`p-5 rounded-2xl border-2 font-medium cursor-pointer transition-all ${selections.pat === opt.id ? 'border-dilim-portakal bg-orange-50 text-dilim-portakal' : 'border-gray-100 hover:border-orange-200'}`}>
                    {opt.name}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4 border-b pb-2">Pasta Şekli</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {OPTIONS.sekil.map((opt) => (
                  <div key={opt.id} onClick={() => handleSelect('sekil', opt.id)} className={`p-4 text-center font-medium rounded-2xl border-2 cursor-pointer transition-all ${selections.sekil === opt.id ? 'border-dilim-portakal bg-orange-50 text-dilim-portakal' : 'border-gray-100 hover:border-orange-200'}`}>
                    {opt.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {OPTIONS.kisi.map((opt) => (
              <div key={opt.id} onClick={() => handleSelect('kisi', opt.id)} className={`relative group cursor-pointer rounded-3xl p-6 border-2 transition-all duration-300 hover:shadow-xl ${selections.kisi === opt.id ? 'border-dilim-portakal bg-orange-50' : 'border-gray-100 bg-white hover:border-orange-200'}`}>
                {selections.kisi === opt.id && <div className="absolute top-4 right-4 w-6 h-6 bg-dilim-portakal rounded-full flex items-center justify-center"><Check className="w-4 h-4 text-white" /></div>}
                <div className="mt-2">
                  <h3 className="font-bold text-lg text-dilim-siyah group-hover:text-dilim-portakal transition-colors">{opt.name}</h3>
                </div>
              </div>
            ))}
          </div>
        );
      case 6:
        return (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="font-bold text-xl text-dilim-siyah border-b pb-2">Kişisel Bilgiler</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad <span className="text-red-500">*</span></label>
                  <input type="text" value={selections.customerName} onChange={(e) => handleSelect('customerName', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all bg-gray-50/50" placeholder="Örn: Ayşe Yılmaz" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon <span className="text-red-500">*</span></label>
                    <input type="tel" value={selections.customerPhone} onChange={(e) => handleSelect('customerPhone', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all bg-gray-50/50" placeholder="05XX XXX XX XX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                    <input type="email" value={selections.customerEmail} onChange={(e) => handleSelect('customerEmail', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all bg-gray-50/50" placeholder="Opsiyonel" />
                  </div>
                </div>
                
                {status === 'authenticated' && userAddresses.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adres Seçimi</label>
                    <div className="flex bg-gray-100 rounded-xl p-1 mb-3">
                      <button 
                        onClick={() => setSelectedAddressType('saved')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${selectedAddressType === 'saved' ? 'bg-white shadow-sm text-dilim-portakal' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        Kayıtlı Adresler
                      </button>
                      <button 
                        onClick={() => setSelectedAddressType('new')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${selectedAddressType === 'new' ? 'bg-white shadow-sm text-dilim-portakal' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        Yeni Adres Gir
                      </button>
                    </div>

                    {selectedAddressType === 'saved' && (
                      <select 
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal bg-gray-50 outline-none"
                        onChange={(e) => {
                          const addr = userAddresses.find(a => a.id === e.target.value)
                          if (addr) handleSelect('customerAddress', `${addr.district} - ${addr.details}`)
                        }}
                      >
                        <option value="">Kayıtlı Adres Seçin</option>
                        {userAddresses.map((addr) => (
                          <option key={addr.id} value={addr.id}>
                            {addr.title} ({addr.district})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
                
                {(status !== 'authenticated' || selectedAddressType === 'new') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teslimat Adresi <span className="text-red-500">*</span></label>
                    <textarea value={selections.customerAddress} onChange={(e) => handleSelect('customerAddress', e.target.value)} rows={3} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all bg-gray-50/50 resize-none" placeholder="Açık adresinizi giriniz..."></textarea>
                  </div>
                )}
              </div>
              <div className="space-y-6">
                <h3 className="font-bold text-xl text-dilim-siyah border-b pb-2">Teslimat Zamanı</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teslimat Tarihi <span className="text-red-500">*</span></label>
                  <input type="date" min={getMinDate()} value={selections.requestedDate} onChange={(e) => handleDateChange(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all" />
                  <p className="text-xs text-gray-400 mt-1">Hafta sonları (Cumartesi ve Pazar) özel sipariş alamıyoruz.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teslimat Saati <span className="text-red-500">*</span></label>
                  <select value={selections.timeSlot} onChange={(e) => handleSelect('timeSlot', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all bg-white">
                    <option value="" disabled>Saat Aralığı Seçin</option>
                    {getFilteredTimeSlots().map((slot) => (
                      <option key={slot.id} value={slot.timeRange}>{slot.timeRange}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <h3 className="font-bold text-xl text-dilim-siyah mb-6">Özel İstekleriniz ve Görsel (Opsiyonel)</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tasarım İçin Referans Görsel (Varsa)</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <PaintBucket className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Resim yüklemek için tıklayın</span> veya sürükleyin</p>
                      <p className="text-xs text-gray-500">PNG, JPG, WEBP (Maks. 5MB)</p>
                      {selections.referenceImage && (
                        <p className="mt-2 text-sm text-dilim-portakal font-medium">Seçilen Dosya: {selections.referenceImage.name}</p>
                      )}
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e)} />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Eklemek İstediğiniz Notlar</label>
                <textarea value={selections.note} onChange={(e) => handleSelect('note', e.target.value)} rows={4} className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all resize-none" placeholder="Pastanın üzerine yazılacak yazı, renk tercihleri vb. özel isteklerinizi buraya yazabilirsiniz..."></textarea>
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
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] p-8 sm:p-12 shadow-xl text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Check className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-dilim-siyah mb-4">Talebiniz Alındı!</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Tasarım detaylarınız bize ulaştı (Talep No: {orderId}). 
              Şimdi onay ve fiyat teklifi için WhatsApp'a yönlendirileceksiniz.
            </p>
            <div className="space-y-4">
              <a href={`https://wa.me/${contactSettings?.phone?.replace(/[^0-9]/g, '') || '905059638021'}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="block w-full bg-[#25D366] text-white rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#128C7E] transition-all">
                <MessageCircle className="w-6 h-6" /> WhatsApp'a Git
              </a>
              <Link href="/urunler" className="block w-full bg-gray-100 text-gray-700 rounded-2xl py-4 font-bold text-lg hover:bg-gray-200 transition-all">Alışverişe Devam Et</Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" ref={scrollRef}>
      {/* Hero Section */}
      <div className="w-full relative z-10">
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden">
          {/* Progress Bar */}
          <div className="bg-gray-50 border-b border-gray-100 px-6 sm:px-10 py-6">
            <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4 hide-scrollbar">
              {STEPS.map((step, index) => {
                const Icon = step.icon
                const isActive = currentStep === step.id
                const isPassed = currentStep > step.id

                return (
                  <div key={step.id} className={`flex flex-col items-center min-w-[80px] relative ${isActive ? 'text-dilim-portakal' : isPassed ? 'text-green-500' : 'text-gray-400'}`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 ${isActive ? 'bg-dilim-portakal text-white shadow-lg shadow-dilim-portakal/30 scale-110' : isPassed ? 'bg-green-100 text-green-500' : 'bg-white border-2 border-gray-200'}`}>
                      {isPassed ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-center whitespace-nowrap">{step.title}</span>
                    {index < STEPS.length - 1 && (
                      <div className={`absolute top-6 left-1/2 w-full h-[2px] -z-10 ${isPassed ? 'bg-green-500' : 'bg-gray-200'}`} style={{ width: 'calc(100% + 2rem)', marginLeft: '1.5rem' }}></div>
                    )}
                  </div>
                )
              })}
            </div>
            
            <div className="flex justify-between items-center bg-white rounded-2xl p-4 shadow-sm">
              <span className="text-gray-500 font-medium">Adım {currentStep} / {STEPS.length}</span>
              <h2 className="text-xl font-bold text-dilim-siyah">{STEPS.find(s => s.id === currentStep)?.title}</h2>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            <div className="mt-12 flex items-center justify-between border-t border-gray-100 pt-8">
              <button onClick={prevStep} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-500 hover:bg-gray-100'}`}>
                <ChevronLeft className="w-5 h-5" /> Geri
              </button>
              
              {currentStep < STEPS.length ? (
                <button onClick={nextStep} disabled={!isStepValid()} className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all shadow-lg ${isStepValid() ? 'bg-dilim-portakal hover:bg-dilim-turuncu hover:-translate-y-1' : 'bg-gray-300 cursor-not-allowed'}`}>
                  Devam Et <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  onClick={handleOrder} 
                  disabled={!isStepValid() || isSubmitting} 
                  className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
                    !isStepValid() || isSubmitting
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-[#25D366] hover:bg-[#128C7E] hover:-translate-y-1'
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                  {isSubmitting ? 'Gönderiliyor...' : 'Tasarımımı Gönder & Teklif İste'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
