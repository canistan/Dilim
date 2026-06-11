"use client"

import { useState, useEffect, useRef } from 'react'
import { useCart } from '@/context/CartContext'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { MapPin, Building2, CheckCircle2 } from 'lucide-react'
import { taxOffices } from '@/data/taxOffices'

const ALLOWED_DISTRICTS = [
  "Beykoz",
  "Ümraniye",
  "Üsküdar",
  "Kadıköy",
  "Ataşehir",
  "Çekmeköy"
]

export default function OdemePage() {
  const { data: session, status } = useSession()
  const { cartTotal, items, clearCart } = useCart()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    district: '',
    address: '',
    isCorporate: false,
    companyName: '',
    taxOffice: '',
    taxNumber: ''
  })
  
  const [savedAddresses, setSavedAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [legalConsent, setLegalConsent] = useState(false)
  const [checkoutHtml, setCheckoutHtml] = useState('')
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/customer/me')
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setFormData(prev => ({
              ...prev,
              firstName: data.user.name || prev.firstName,
              lastName: data.user.surname || prev.lastName,
              email: data.user.email || prev.email,
              phone: data.user.phone || prev.phone,
            }))
            if (data.user.addresses && data.user.addresses.length > 0) {
              setSavedAddresses(data.user.addresses)
            }
          }
        })
        .catch(console.error)
    }
  }, [status])

  useEffect(() => {
    if (checkoutHtml && formRef.current) {
      // Scriptlerin çalışması için createContextualFragment kullanıyoruz
      formRef.current.innerHTML = ''
      const fragment = document.createRange().createContextualFragment(checkoutHtml)
      formRef.current.appendChild(fragment)
    }
  }, [checkoutHtml])

  const handleSelectAddress = (addr: any) => {
    setSelectedAddressId(addr.id)
    setFormData(prev => ({
      ...prev,
      district: addr.district,
      address: addr.address,
      isCorporate: addr.isCorporate,
      companyName: addr.companyName || '',
      taxOffice: addr.taxOffice || '',
      taxNumber: addr.taxNumber || ''
    }))
  }

  const handleCheckout = async () => {
    if (!formData.district) {
      toast.error("Lütfen teslimat ilçesi seçiniz.")
      return
    }
    
    if (formData.isCorporate && (!formData.companyName || !formData.taxOffice || !formData.taxNumber)) {
      toast.error("Lütfen kurumsal fatura bilgilerinizi eksiksiz giriniz.")
      return
    }

    setLoading(true)
    try {
      let res;
      try {
        const bodyStr = JSON.stringify({
          customerInfo: formData,
          items: items,
          totalAmount: cartTotal
        }).replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|([^\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '');

        res = await fetch('/api/odeme-baslat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: bodyStr
        });
      } catch (fetchErr: any) {
        throw new Error("Adım 1 (Fetch) Hatası: " + fetchErr.message);
      }
      
      let data;
      try {
        data = await res.json()
      } catch (jsonErr: any) {
        throw new Error("Adım 2 (JSON) Hatası: " + jsonErr.message);
      }
      
      if (res.ok && data.success) {
        if (data.paymentPageUrl) {
          try {
            const cleanUrl = data.paymentPageUrl.toString().trim().replace(/[\n\r]/g, '');
            window.location.href = cleanUrl;
          } catch (urlErr: any) {
            throw new Error("Adım 3 (URL) Hatası: " + urlErr.message);
          }
        } else if (data.checkoutFormContent) {
          setCheckoutHtml(data.checkoutFormContent)
        } else {
          window.location.href = `/odeme/basarili?orderNumber=${data.orderNumber}`
        }
      } else {
        console.error("Checkout failed API response:", data);
        toast.error("Sipariş oluşturulamadı: " + (data.error || "Bilinmeyen hata"))
      }
    } catch (err: any) {
      console.error("Checkout network or parse error:", err);
      toast.error("Sistem Hatası: " + err.message)
    }
    setLoading(false)
  }

  return (
    <div className="bg-gray-50/50 min-h-screen py-12 lg:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-dilim-siyah mb-10 text-center">Güvenli Ödeme</h1>
        
        {!checkoutHtml ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* SOL SÜTUN: FORM */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* İletişim Bilgileri */}
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-6 text-dilim-siyah border-b pb-4">İletişim Bilgileri</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adınız</label>
                    <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Soyadınız</label>
                    <input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-Posta Adresi</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon Numarası</label>
                    <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all" />
                  </div>
                </div>
              </div>

              {/* Teslimat ve Fatura Adresi */}
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-dilim-siyah mb-6 border-b pb-4">Teslimat Adresi</h2>
                
                {savedAddresses.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Kayıtlı Adreslerimden Seç</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {savedAddresses.map(addr => (
                        <button
                          key={addr.id}
                          onClick={() => handleSelectAddress(addr)}
                          className={`p-4 text-left rounded-2xl border-2 transition-all relative ${selectedAddressId === addr.id ? 'border-dilim-portakal bg-orange-50 shadow-sm' : 'border-gray-100 bg-gray-50 hover:border-gray-300'}`}
                        >
                          {selectedAddressId === addr.id && (
                            <CheckCircle2 className="w-5 h-5 text-dilim-portakal absolute top-4 right-4" />
                          )}
                          <div className="flex items-center gap-2 mb-1">
                            {addr.isCorporate ? <Building2 className="w-4 h-4 text-dilim-siyah" /> : <MapPin className="w-4 h-4 text-dilim-siyah" />}
                            <h4 className="font-bold text-dilim-siyah">{addr.title}</h4>
                          </div>
                          <p className="text-xs text-gray-600 mb-1">{addr.district} / İstanbul</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{addr.address}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end items-center mb-6">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={formData.isCorporate} 
                      onChange={(e) => setFormData({...formData, isCorporate: e.target.checked})}
                      className="w-4 h-4 text-dilim-portakal rounded border-gray-300 focus:ring-dilim-portakal"
                    />
                    Kurumsal Fatura İstiyorum
                  </label>
                </div>
                
                {/* Kurumsal Bilgiler (Gizli/Açık) */}
                {formData.isCorporate && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Firma Adı</label>
                      <input type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal outline-none" />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vergi Dairesi</label>
                      <input 
                        list="tax-offices-list"
                        type="text" 
                        value={formData.taxOffice} 
                        onChange={e => setFormData({...formData, taxOffice: e.target.value})} 
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal outline-none" 
                        placeholder="Yazın veya listeden seçin"
                      />
                      <datalist id="tax-offices-list">
                        {taxOffices.map((office, idx) => (
                          <option key={idx} value={office} />
                        ))}
                      </datalist>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vergi Numarası</label>
                      <input type="text" value={formData.taxNumber} onChange={e => setFormData({...formData, taxNumber: e.target.value})} className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal outline-none" />
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">İl</label>
                      <input type="text" value="İstanbul" disabled className="w-full p-3 bg-gray-100 text-gray-500 border border-gray-200 rounded-xl cursor-not-allowed" />
                      <p className="text-xs text-gray-400 mt-1">Sadece İstanbul içi teslimat yapmaktayız.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">İlçe Seçiniz <span className="text-red-500">*</span></label>
                      <select 
                        value={formData.district} 
                        onChange={e => {
                          setFormData({...formData, district: e.target.value})
                          setSelectedAddressId(null) // Form manipule edilirse secili adres isaretini kaldir
                        }} 
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-dilim-portakal outline-none"
                      >
                        <option value="">İlçe Seçin...</option>
                        {ALLOWED_DISTRICTS.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                      <p className="text-xs text-dilim-portakal/80 mt-1">Sadece seçili ilçelere taze teslimatımız vardır.</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Açık Adres (Mahalle, Sokak vb.)</label>
                    <textarea 
                      value={formData.address} 
                      onChange={e => {
                        setFormData({...formData, address: e.target.value})
                        setSelectedAddressId(null)
                      }} 
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-dilim-portakal outline-none" 
                      rows={3} 
                      placeholder="Siparişinizin teslim edileceği tam adresinizi giriniz."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* SAĞ SÜTUN: SİPARİŞ ÖZETİ */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
                <h3 className="text-xl font-bold mb-6 text-dilim-siyah border-b pb-4">Sipariş Özeti</h3>
                
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image src={item.image || '/generated/hero_cake.png'} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{item.name}</h4>
                        <p className="text-xs text-gray-500">{item.quantity} Adet</p>
                      </div>
                      <div className="text-sm font-semibold text-dilim-siyah">
                        {item.price}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Ara Toplam</span>
                    <span>{cartTotal} ₺</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Kargo Ücreti</span>
                    <span className="text-green-600">Ücretsiz</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-dilim-siyah border-t pt-3 mt-3">
                    <span>Genel Toplam</span>
                    <span>{cartTotal} ₺</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={legalConsent} 
                      onChange={(e) => setLegalConsent(e.target.checked)}
                      className="mt-0.5 w-5 h-5 text-dilim-portakal rounded border-gray-300 focus:ring-dilim-portakal"
                    />
                    <span className="text-xs text-gray-600 leading-relaxed">
                      <a href="/mesafeli-satis" target="_blank" className="text-dilim-portakal hover:underline font-semibold">Ön Bilgilendirme Koşullarını</a> ve <a href="/mesafeli-satis" target="_blank" className="text-dilim-portakal hover:underline font-semibold">Mesafeli Satış Sözleşmesini</a> okudum, onaylıyorum.
                    </span>
                  </label>
                </div>

                <button 
                  onClick={() => {
                    if (cartTotal === 0) return toast.error("Sepetiniz boş.")
                    if (!formData.district) return toast.error("Lütfen bir teslimat adresi seçiniz (İlçe gerekli).")
                    if (!legalConsent) return toast.error("Lütfen sözleşmeleri okuyup onay kutusunu işaretleyin.")
                    handleCheckout()
                  }} 
                  disabled={loading} 
                  className={`w-full py-4 text-white text-lg font-bold rounded-2xl transition-all shadow-lg flex justify-center items-center gap-2
                    ${loading ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-green-600 hover:bg-green-700 shadow-green-600/30'}
                  `}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Yükleniyor...
                    </>
                  ) : (
                    `Güvenli Ödeme Adımına Geç`
                  )}
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-2xl mx-auto min-h-[500px]">
            <h2 className="text-2xl font-bold mb-6 text-dilim-siyah text-center">Ödeme Ekranı</h2>
            {/* Iyzico Form Container */}
            <div ref={formRef} id="iyzi-payment-container"></div>
          </div>
        )}
      </div>
    </div>
  )
}
