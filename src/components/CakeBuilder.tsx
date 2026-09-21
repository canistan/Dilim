'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Check, Layers, CakeSlice, PaintBucket, ChefHat, MessageCircle, User, MapPin } from 'lucide-react'
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
    { id: 'Çikolata Kremalı', name: 'Çikolata Kremalı', desc: 'Yoğun çikolata lezzeti' },
    { id: 'Beyaz Kremalı', name: 'Beyaz Kremalı', desc: 'Hafif ve sade vanilya dokunuşu' },
    { id: 'Akışkan Kremalı', name: 'Akışkan Kremalı', desc: 'Taze, ıslak ve akışkan doku' },
  ],
  kek: [
    { id: 'Çikolatalı Kek', name: 'Çikolatalı Kek', desc: 'Klasik yoğun kakaolu sünger' },
    { id: 'Beyaz Kek', name: 'Beyaz Kek', desc: 'Sade, yumuşacık sünger kek' },
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
    { id: 'Standart Pat', name: 'Standart Pat (Normal)' },
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
    { id: '30 Kişilik ve Üzeri', name: '30 Kişilik ve Üzeri' },
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

  const handlePhoneChange = (val: string) => {
    let numbers = val.replace(/\D/g, '');
    if (numbers.length > 0 && numbers[0] !== '0') {
      numbers = '0' + numbers;
    }
    numbers = numbers.substring(0, 11);
    
    let formatted = '';
    if (numbers.length > 0) formatted += numbers.substring(0, 4);
    if (numbers.length > 4) formatted += ' ' + numbers.substring(4, 7);
    if (numbers.length > 7) formatted += ' ' + numbers.substring(7, 9);
    if (numbers.length > 9) formatted += ' ' + numbers.substring(9, 11);
    
    handleSelect('customerPhone', formatted);
  }

  const { status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/customer/me')
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setSelections(prev => ({
              ...prev,
              customerName: `${data.user.name || ''} ${data.user.surname || ''}`.trim(),
              customerPhone: data.user.phone || '',
              customerEmail: data.user.email || '',
            }))
            
            if (data.user.addresses && data.user.addresses.length > 0) {
              setUserAddresses(data.user.addresses)
              const defaultAddr = data.user.addresses[0]
              setSelections(prev => ({
                ...prev,
                customerAddress: `${defaultAddr.district} - ${defaultAddr.address}`
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
      toast.error('Lütfen bu adımdaki seçimlerinizi tamamlayınız.')
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      setTimeout(scrollToTop, 100)
    }
  }

  // Kullanıcı daha önce geçtiği adımlara üstteki ikonlardan tıklayarak geri dönebilir
  const handleStepClick = (targetStep: number) => {
    if (targetStep < currentStep) {
      setCurrentStep(targetStep)
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
      case 6: return selections.customerName.trim() !== '' && selections.customerPhone.replace(/\D/g, '').length === 11 && selections.customerAddress.trim() !== '' && selections.requestedDate !== '' && selections.timeSlot !== '';
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
              <div key={opt.id} onClick={() => handleSelect('krema', opt.id)} 
                className={`relative cursor-pointer rounded-2xl p-6 border transition-all duration-200 
                ${selections.krema === opt.id 
                  ? 'border-dilim-portakal ring-1 ring-dilim-portakal bg-orange-50/30' 
                  : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                {selections.krema === opt.id && (
                  <div className="absolute top-4 right-4">
                    <Check className="w-5 h-5 text-dilim-portakal" />
                  </div>
                )}
                <div>
                  <h3 className={`font-semibold text-lg mb-1 ${selections.krema === opt.id ? 'text-dilim-portakal' : 'text-gray-900'}`}>{opt.name}</h3>
                  <p className="text-sm text-gray-500">{opt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {OPTIONS.kek.map((opt) => (
              <div key={opt.id} onClick={() => handleSelect('kek', opt.id)} 
                className={`relative cursor-pointer rounded-2xl p-8 border transition-all duration-200 
                ${selections.kek === opt.id 
                  ? 'border-dilim-portakal ring-1 ring-dilim-portakal bg-orange-50/30' 
                  : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                {selections.kek === opt.id && (
                  <div className="absolute top-4 right-4">
                    <Check className="w-5 h-5 text-dilim-portakal" />
                  </div>
                )}
                <div>
                  <h3 className={`font-semibold text-xl mb-2 ${selections.kek === opt.id ? 'text-dilim-portakal' : 'text-gray-900'}`}>{opt.name}</h3>
                  <p className="text-sm text-gray-500">{opt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="max-w-5xl mx-auto">
            <p className="text-gray-500 text-sm mb-6">Lütfen en az 1, en fazla 3 içerik seçiniz.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {OPTIONS.icerik.map((opt) => {
                const isSelected = selections.icerik.includes(opt.id);
                return (
                  <button key={opt.id} onClick={() => handleToggleIcerik(opt.id)} 
                    className={`relative p-4 rounded-xl border transition-all duration-200 text-center font-medium
                    ${isSelected 
                      ? 'border-dilim-portakal ring-1 ring-dilim-portakal bg-orange-50 text-dilim-portakal' 
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'}`}>
                    {isSelected && <Check className="w-4 h-4 absolute top-2 right-2 text-dilim-portakal" />}
                    {opt.name}
                  </button>
                )
              })}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">Katman & Yükseklik</h4>
              <div className="flex flex-col gap-4">
                {OPTIONS.pat.map((opt) => (
                  <div key={opt.id} onClick={() => handleSelect('pat', opt.id)} 
                    className={`p-5 rounded-xl border cursor-pointer transition-all flex items-center justify-between font-medium
                    ${selections.pat === opt.id 
                      ? 'border-dilim-portakal ring-1 ring-dilim-portakal bg-orange-50/30 text-dilim-portakal' 
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}>
                    {opt.name}
                    {selections.pat === opt.id && <Check className="w-5 h-5 text-dilim-portakal" />}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">Pasta Şekli</h4>
              <div className="grid grid-cols-2 gap-4">
                {OPTIONS.sekil.map((opt) => (
                  <div key={opt.id} onClick={() => handleSelect('sekil', opt.id)} 
                    className={`p-5 text-center rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-center font-medium
                    ${selections.sekil === opt.id 
                      ? 'border-dilim-portakal ring-1 ring-dilim-portakal bg-orange-50/30 text-dilim-portakal' 
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}>
                    {opt.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {OPTIONS.kisi.map((opt) => (
              <div key={opt.id} onClick={() => handleSelect('kisi', opt.id)} 
                className={`relative cursor-pointer rounded-2xl p-6 border transition-all duration-200 flex flex-col items-center justify-center text-center
                ${selections.kisi === opt.id 
                  ? 'border-dilim-portakal ring-1 ring-dilim-portakal bg-orange-50/30 text-dilim-portakal' 
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}`}>
                {selections.kisi === opt.id && <div className="absolute top-3 right-3"><Check className="w-4 h-4 text-dilim-portakal" /></div>}
                <User className={`w-8 h-8 mb-3 ${selections.kisi === opt.id ? 'text-dilim-portakal' : 'text-gray-400'}`} />
                <h3 className="font-semibold text-sm">{opt.name}</h3>
              </div>
            ))}
          </div>
        );
      case 6:
        return (
          <div className="max-w-4xl mx-auto space-y-12">
            <div>
              <h3 className="font-semibold text-xl text-gray-900 mb-6 border-b border-gray-100 pb-3">Kişisel Bilgiler</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad <span className="text-red-500">*</span></label>
                  <input type="text" value={selections.customerName} onChange={(e) => handleSelect('customerName', e.target.value)} 
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-dilim-portakal outline-none transition-all text-sm placeholder:text-gray-400" placeholder="Örn: Ayşe Yılmaz" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefon <span className="text-red-500">*</span></label>
                    <input type="tel" value={selections.customerPhone} onChange={(e) => handlePhoneChange(e.target.value)} 
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-dilim-portakal outline-none transition-all text-sm placeholder:text-gray-400" placeholder="05XX XXX XX XX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                    <input type="email" value={selections.customerEmail} onChange={(e) => handleSelect('customerEmail', e.target.value)} 
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-dilim-portakal outline-none transition-all text-sm placeholder:text-gray-400" placeholder="Opsiyonel" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-xl text-gray-900 mb-6 border-b border-gray-100 pb-3">Teslimat Detayları</h3>
              <div className="space-y-6">
                {status === 'authenticated' && userAddresses.length > 0 && (
                  <div>
                    <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
                      <button onClick={() => setSelectedAddressType('saved')} className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${selectedAddressType === 'saved' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>Kayıtlı Adresler</button>
                      <button onClick={() => setSelectedAddressType('new')} className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${selectedAddressType === 'new' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>Yeni Adres Gir</button>
                    </div>

                    {selectedAddressType === 'saved' && (
                      <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-dilim-portakal outline-none transition-all text-sm"
                        onChange={(e) => { const addr = userAddresses.find(a => a.id === e.target.value); if (addr) handleSelect('customerAddress', `${addr.district} - ${addr.address}`); }}>
                        <option value="">Kayıtlı Adres Seçin</option>
                        {userAddresses.map((addr) => <option key={addr.id} value={addr.id}>{addr.title} ({addr.district})</option>)}
                      </select>
                    )}
                  </div>
                )}
                
                {(status !== 'authenticated' || selectedAddressType === 'new' || userAddresses.length === 0) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teslimat Adresi <span className="text-red-500">*</span></label>
                    <textarea value={selections.customerAddress} onChange={(e) => handleSelect('customerAddress', e.target.value)} rows={3} 
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-dilim-portakal outline-none transition-all text-sm resize-none placeholder:text-gray-400" placeholder="Açık adresinizi detaylıca giriniz..."></textarea>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tarih <span className="text-red-500">*</span></label>
                    <input type="date" min={getMinDate()} value={selections.requestedDate} onChange={(e) => handleDateChange(e.target.value)} 
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-dilim-portakal outline-none transition-all text-sm text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Saat <span className="text-red-500">*</span></label>
                    <select value={selections.timeSlot} onChange={(e) => handleSelect('timeSlot', e.target.value)} 
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-dilim-portakal outline-none transition-all text-sm text-gray-900">
                      <option value="" disabled>Saat Aralığı</option>
                      {getFilteredTimeSlots().map((slot) => <option key={slot.id} value={slot.timeRange}>{slot.timeRange}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-500 text-sm mb-8">Özel bir mesajınız, şekil isteğiniz veya referans görseliniz varsa bize iletin.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Referans Görsel (Opsiyonel)</label>
                <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${selections.referenceImage ? 'border-dilim-portakal bg-orange-50/50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'}`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                    {selections.referenceImage ? (
                      <>
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 text-dilim-portakal">
                          <Check className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Görsel Eklendi</p>
                        <p className="text-xs text-gray-500 max-w-[200px] truncate">{selections.referenceImage.name}</p>
                      </>
                    ) : (
                      <>
                        <PaintBucket className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="text-sm font-medium text-gray-700 mb-1">Dosya Yükle</p>
                        <p className="text-xs text-gray-500">Tıkla veya Sürükle (Maks 5MB)</p>
                      </>
                    )}
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e)} />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Ek Notlar & Üzerine Yazılacaklar</label>
                <textarea value={selections.note} onChange={(e) => handleSelect('note', e.target.value)} 
                  className="w-full h-48 p-5 bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-dilim-portakal focus:border-dilim-portakal outline-none transition-all text-sm resize-none placeholder:text-gray-400" 
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
      <div className="min-h-[70vh] bg-[#FAFAFA] flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-3xl p-10 sm:p-14 shadow-sm border border-gray-100 text-center max-w-xl w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Talebiniz Alındı!</h2>
          <p className="text-gray-500 mb-10 text-sm leading-relaxed">
            Tasarım detaylarınız bize ulaştı (Talep No: {orderId}). Şimdi onay ve fiyat teklifi için WhatsApp'a yönlendirileceksiniz.
          </p>
          <div className="flex flex-col gap-3">
            <a href={`https://wa.me/${contactSettings?.phone?.replace(/[^0-9]/g, '') || '905059638021'}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" 
              className="bg-[#25D366] text-white rounded-xl px-6 py-4 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#128C7E] transition-all">
              <MessageCircle className="w-5 h-5" /> WhatsApp'a Git
            </a>
            <Link href="/urunler" className="bg-white text-gray-700 border border-gray-200 rounded-xl px-6 py-4 font-semibold text-sm hover:bg-gray-50 transition-all">
              Alışverişe Devam Et
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20 pt-10" ref={scrollRef}>
      
      {/* Clean Header */}
      <div className="text-center max-w-2xl mx-auto px-4 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Kendi Pastanı Tasarla</h1>
        <p className="text-sm md:text-base text-gray-500">Adım adım seçimlerini yap, ustalarımız hayallerini gerçeğe dönüştürsün.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Minimalist Stepper */}
          <div className="border-b border-gray-100 px-6 sm:px-10 py-8">
            <div className="flex items-center justify-between mb-2 overflow-x-auto pb-4 hide-scrollbar">
              {STEPS.map((step, index) => {
                const isActive = currentStep === step.id
                const isPassed = currentStep > step.id
                const isClickable = step.id < currentStep

                return (
                  <div key={step.id} className="flex flex-col items-center relative min-w-[70px]">
                    <button 
                      onClick={() => handleStepClick(step.id)}
                      disabled={!isClickable}
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-all z-10 text-sm font-medium outline-none
                      ${isActive ? 'bg-dilim-portakal text-white shadow-md shadow-orange-500/20' 
                        : isPassed ? 'bg-gray-900 text-white cursor-pointer hover:bg-gray-800' 
                        : 'bg-white text-gray-300 border-2 border-gray-100 cursor-not-allowed'}`}>
                      {isPassed ? <Check className="w-4 h-4" /> : step.id}
                    </button>
                    <span className={`text-[10px] sm:text-xs font-semibold tracking-wide text-center transition-colors
                      ${isActive ? 'text-dilim-portakal' : isPassed ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.title}
                    </span>
                    {index < STEPS.length - 1 && (
                      <div className="absolute top-5 left-[50%] w-full h-[2px] -z-0 bg-gray-100" style={{ width: 'calc(100% + 2rem)' }}>
                        <div 
                          className="h-full bg-gray-900 transition-all duration-300"
                          style={{ width: isPassed ? '100%' : '0%' }}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="p-8 sm:p-12 min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div key={currentStep} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Clean Footer Navigation */}
          <div className="bg-white border-t border-gray-100 p-6 sm:px-10 sm:py-6 flex items-center justify-between">
            <button onClick={prevStep} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-600 hover:bg-gray-50'}`}>
              <ChevronLeft className="w-4 h-4" /> Geri
            </button>
            
            {currentStep < STEPS.length ? (
              <button onClick={nextStep} disabled={!isStepValid()} className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium text-sm transition-all ${isStepValid() ? 'bg-gray-900 text-white hover:bg-black' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                Devam Et <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleOrder} disabled={!isStepValid() || isSubmitting} className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium text-sm transition-all ${!isStepValid() || isSubmitting ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-dilim-portakal text-white hover:bg-orange-600'}`}>
                {isSubmitting ? 'Gönderiliyor...' : (
                  <>
                    <MessageCircle className="w-4 h-4" /> Gönder & Fiyat Al
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
