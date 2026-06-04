"use client"

import { useState, useEffect, useRef } from 'react'
import { useCart } from '@/context/CartContext'

export default function OdemePage() {
  const [formData, setFormData] = useState({
    name: 'Can Albayrak',
    email: 'can@example.com',
    phone: '+905554443322',
    address: 'Kavacık Mah. Beykoz / İstanbul'
  })
  
  const { cartTotal } = useCart()
  const [loading, setLoading] = useState(false)
  const [checkoutHtml, setCheckoutHtml] = useState('')
  const iframeContainerRef = useRef<HTMLDivElement>(null)
  const [legalConsent, setLegalConsent] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/iyzico/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerInfo: formData,
          amount: cartTotal > 0 ? cartTotal : 500.0
        })
      })
      
      const data = await res.json()
      
      if (data.pageUrl) {
        // Redirect to iyzico hosted payment page (Safest for Next.js)
        window.location.href = data.pageUrl + '&iframe=true'
      } else if (data.checkoutFormContent) {
        // Fallback to HTML content injection
        setCheckoutHtml(data.checkoutFormContent)
      } else {
        alert("Ödeme başlatılamadı: " + data.error)
      }
    } catch (err) {
      alert("Bir hata oluştu")
    }
    setLoading(false)
  }

  // Effect to handle script injection if using raw HTML form content
  useEffect(() => {
    if (checkoutHtml && iframeContainerRef.current) {
      iframeContainerRef.current.innerHTML = checkoutHtml;
      // Extract script and execute it
      const scripts = iframeContainerRef.current.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        const newScript = document.createElement('script');
        newScript.text = scripts[i].text;
        document.body.appendChild(newScript);
      }
    }
  }, [checkoutHtml])

  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl min-h-screen">
      <h1 className="text-4xl font-extrabold text-dilim-siyah mb-8 text-center">Güvenli Ödeme</h1>
      
      {!checkoutHtml ? (
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-dilim-siyah/5 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-dilim-siyah">Fatura ve Teslimat Bilgileri</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Ad Soyad</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">E-Posta</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Telefon</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Açık Adres</label>
              <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal focus:border-transparent outline-none transition-all" rows={3} placeholder="Siparişinizin teslim edileceği tam adresinizi giriniz."></textarea>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={legalConsent} 
                  onChange={(e) => setLegalConsent(e.target.checked)}
                  className="mt-1 w-5 h-5 text-dilim-portakal rounded border-gray-300 focus:ring-dilim-portakal"
                />
                <span className="text-sm text-gray-600 leading-relaxed">
                  <a href="/mesafeli-satis" target="_blank" className="text-dilim-portakal hover:underline font-semibold">Mesafeli Satış Sözleşmesi</a>'ni ve <a href="/iptal-iade" target="_blank" className="text-dilim-portakal hover:underline font-semibold">İptal/İade Koşulları</a>'nı okudum ve onaylıyorum.
                </span>
              </label>
            </div>
            <button onClick={handleCheckout} disabled={loading || cartTotal === 0 || !legalConsent} className={`w-full py-4 mt-6 text-white text-lg font-bold rounded-xl transition-all shadow-lg ${loading || cartTotal === 0 || !legalConsent ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-dilim-portakal hover:bg-[#e06c00] shadow-dilim-portakal/30'}`}>
              {loading ? 'Yükleniyor...' : `Güvenli Ödemeye Geç (${cartTotal} ₺)`}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-4 sm:p-8 rounded-3xl shadow-xl border border-gray-100 flex justify-center items-center min-h-[400px]">
           <div ref={iframeContainerRef} className="w-full max-w-[600px] mx-auto" />
        </div>
      )}
    </div>
  )
}
