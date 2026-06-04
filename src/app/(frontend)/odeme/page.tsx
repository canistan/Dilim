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
  
  const { cartTotal, items, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [legalConsent, setLegalConsent] = useState(false)
  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerInfo: formData,
          items: items,
          totalAmount: cartTotal
        })
      })
      
      const data = await res.json()
      
      if (res.ok && data.success) {
        // Sepeti temizle ve başarı sayfasına git
        window.location.href = `/odeme/basarili?orderNumber=${data.orderNumber}`
      } else {
        alert("Sipariş oluşturulamadı: " + data.error)
      }
    } catch (err) {
      alert("Bir hata oluştu. Lütfen tekrar deneyin.")
    }
    setLoading(false)
  }

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
              {loading ? 'Yükleniyor...' : `Siparişi Tamamla (${cartTotal} ₺)`}
            </button>
          </div>
        </div>
    </div>
  )
}
