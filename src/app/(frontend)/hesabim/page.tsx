"use client"

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Trash2, MapPin, Building2 } from 'lucide-react'

const ALLOWED_DISTRICTS = [
  "Beykoz",
  "Ümraniye",
  "Üsküdar",
  "Kadıköy",
  "Ataşehir",
  "Çekmeköy"
]

export default function HesabimPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [activeTab, setActiveTab] = useState('profil')
  const [birthDate, setBirthDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  
  // Addresses State
  const [addresses, setAddresses] = useState<any[]>([])
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressForm, setAddressForm] = useState({
    id: '',
    title: '',
    district: '',
    address: '',
    isCorporate: false,
    companyName: '',
    taxOffice: '',
    taxNumber: ''
  })
  const [savingAddress, setSavingAddress] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/giris')
    } else if (status === 'authenticated') {
      fetch('/api/customer/me')
        .then(res => res.json())
        .then(data => {
          if (data.user?.birthDate) {
            const date = new Date(data.user.birthDate)
            setBirthDate(date.toISOString().split('T')[0])
          }
          if (data.user?.addresses) {
            setAddresses(data.user.addresses)
          }
        })
        .catch(console.error)
    }
  }, [status, router])

  if (status === 'loading' || status === 'unauthenticated') {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>
  }

  const handleSaveBirthDate = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/customer/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthDate })
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        toast.error("Kaydedilemedi.")
      }
    } catch (e) {
      toast.error("Kaydedilemedi.")
    }
    setSaving(false)
  }

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addressForm.title || !addressForm.district || !addressForm.address) {
      toast.error("Lütfen zorunlu alanları doldurun.")
      return
    }
    
    setSavingAddress(true)
    try {
      const res = await fetch('/api/customer/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: addressForm.id ? 'update' : 'add', 
          address: addressForm,
          addressId: addressForm.id 
        })
      })
      const data = await res.json()
      if (res.ok) {
        setAddresses(data.addresses)
        setShowAddressForm(false)
        toast.success("Adres kaydedildi.")
        setAddressForm({
          id: '', title: '', district: '', address: '', isCorporate: false, companyName: '', taxOffice: '', taxNumber: ''
        })
      } else {
        toast.error("Adres kaydedilemedi.")
      }
    } catch (e) {
      toast.error("Adres kaydedilemedi.")
    }
    setSavingAddress(false)
  }

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Bu adresi silmek istediğinize emin misiniz?")) return
    try {
      const res = await fetch('/api/customer/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', addressId: id })
      })
      const data = await res.json()
      if (res.ok) {
        setAddresses(data.addresses)
        toast.success("Adres silindi.")
      }
    } catch (e) {
      toast.error("Adres silinemedi.")
    }
  }

  return (
    <div className="container mx-auto px-4 py-20 max-w-5xl min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-dilim-portakal/10 text-dilim-portakal rounded-full flex items-center justify-center text-2xl font-bold">
                {session?.user?.name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <h2 className="font-bold text-dilim-siyah text-lg truncate">{session?.user?.name}</h2>
                <p className="text-gray-500 text-sm truncate">{session?.user?.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('profil')}
                className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'profil' ? 'bg-orange-50 text-dilim-portakal' : 'hover:bg-gray-50 text-gray-600'}`}
              >
                Profil Bilgilerim
              </button>
              <button 
                onClick={() => setActiveTab('adresler')}
                className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'adresler' ? 'bg-orange-50 text-dilim-portakal' : 'hover:bg-gray-50 text-gray-600'}`}
              >
                Adreslerim
              </button>
              <button 
                onClick={() => setActiveTab('siparisler')}
                className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'siparisler' ? 'bg-orange-50 text-dilim-portakal' : 'hover:bg-gray-50 text-gray-600'}`}
              >
                Siparişlerim
              </button>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 font-medium text-red-600 transition-colors mt-4">
                Çıkış Yap
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 min-h-[500px]">
            
            {/* Profil Tab */}
            {activeTab === 'profil' && (
              <div className="animate-in fade-in duration-300">
                <h3 className="text-2xl font-bold text-dilim-siyah mb-6">Profil Bilgilerim</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Ad Soyad</label>
                      <input type="text" disabled value={session?.user?.name || ''} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">E-Posta Adresi</label>
                      <input type="email" disabled value={session?.user?.email || ''} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed" />
                    </div>
                  </div>

                  <div className="p-5 bg-[#FFF8F3] border border-[#FFE8D6] rounded-2xl relative overflow-hidden mt-8">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-dilim-portakal/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <h4 className="font-bold text-dilim-portakal text-lg mb-2 relative z-10">🎂 Doğum Günü Hediyenizi Kaçırmayın!</h4>
                    <p className="text-sm text-gray-600 mb-4 relative z-10">Doğum tarihinizi kaydedin, size özel sürpriz indirim ve hediyelerden faydalanın.</p>
                    
                    <div className="flex gap-4 items-end relative z-10">
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Doğum Tarihiniz</label>
                        <input 
                          type="date" 
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal outline-none" 
                        />
                      </div>
                      <button 
                        onClick={handleSaveBirthDate}
                        disabled={!birthDate || saving}
                        className="px-6 py-3 bg-dilim-siyah text-white font-semibold rounded-xl hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
                      >
                        {saving ? 'Kaydediliyor...' : saved ? 'Kaydedildi!' : 'Kaydet'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Adresler Tab */}
            {activeTab === 'adresler' && (
              <div className="animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-dilim-siyah">Adreslerim</h3>
                  {!showAddressForm && (
                    <button 
                      onClick={() => setShowAddressForm(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-dilim-portakal text-white rounded-xl hover:bg-dilim-turuncu transition-colors text-sm font-semibold shadow-md shadow-orange-200"
                    >
                      <Plus className="w-4 h-4" /> Yeni Adres Ekle
                    </button>
                  )}
                </div>

                {showAddressForm ? (
                  <form onSubmit={handleSaveAddress} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 animate-in slide-in-from-top-4 duration-300">
                    <h4 className="font-bold text-dilim-siyah mb-4 border-b pb-2">{addressForm.id ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Adres Başlığı (Örn: Ev, İş)</label>
                          <input type="text" value={addressForm.title} onChange={e => setAddressForm({...addressForm, title: e.target.value})} required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal outline-none" placeholder="Ev Adresim" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">İlçe</label>
                          <select value={addressForm.district} onChange={e => setAddressForm({...addressForm, district: e.target.value})} required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal outline-none">
                            <option value="">İlçe Seçiniz</option>
                            {ALLOWED_DISTRICTS.map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Açık Adres</label>
                        <textarea value={addressForm.address} onChange={e => setAddressForm({...addressForm, address: e.target.value})} required rows={3} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal outline-none resize-none" placeholder="Mahalle, sokak, bina no..."></textarea>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <label className="flex items-center gap-2 cursor-pointer font-semibold text-sm text-gray-700 mb-4">
                          <input type="checkbox" checked={addressForm.isCorporate} onChange={e => setAddressForm({...addressForm, isCorporate: e.target.checked})} className="w-4 h-4 text-dilim-portakal rounded focus:ring-dilim-portakal" />
                          Kurumsal Fatura İstiyorum
                        </label>
                        
                        {addressForm.isCorporate && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Firma Adı</label>
                              <input type="text" value={addressForm.companyName} onChange={e => setAddressForm({...addressForm, companyName: e.target.value})} required={addressForm.isCorporate} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dilim-portakal outline-none" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Vergi Dairesi</label>
                              <input type="text" value={addressForm.taxOffice} onChange={e => setAddressForm({...addressForm, taxOffice: e.target.value})} required={addressForm.isCorporate} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dilim-portakal outline-none" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Vergi No</label>
                              <input type="text" value={addressForm.taxNumber} onChange={e => setAddressForm({...addressForm, taxNumber: e.target.value})} required={addressForm.isCorporate} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dilim-portakal outline-none" />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3 justify-end pt-4">
                        <button type="button" onClick={() => {setShowAddressForm(false); setAddressForm({id: '', title: '', district: '', address: '', isCorporate: false, companyName: '', taxOffice: '', taxNumber: ''});}} className="px-5 py-2.5 rounded-xl text-gray-600 font-semibold hover:bg-gray-200 transition-colors">
                          İptal
                        </button>
                        <button type="submit" disabled={savingAddress} className="px-5 py-2.5 rounded-xl bg-dilim-siyah text-white font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50">
                          {savingAddress ? 'Kaydediliyor...' : 'Adresi Kaydet'}
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.length === 0 ? (
                      <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">Henüz kayıtlı bir adresiniz bulunmuyor.</p>
                      </div>
                    ) : (
                      addresses.map(addr => (
                        <div key={addr.id} className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-dilim-portakal/50 transition-colors shadow-sm relative group">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-dilim-siyah flex items-center gap-2">
                              {addr.isCorporate ? <Building2 className="w-4 h-4 text-dilim-portakal" /> : <MapPin className="w-4 h-4 text-dilim-portakal" />}
                              {addr.title}
                            </h4>
                            <div className="flex gap-2">
                              <button onClick={() => {setAddressForm(addr); setShowAddressForm(true);}} className="text-xs text-blue-500 hover:underline">Düzenle</button>
                              <button onClick={() => handleDeleteAddress(addr.id)} className="text-xs text-red-500 hover:underline">Sil</button>
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-gray-700">{addr.district} / İstanbul</p>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{addr.address}</p>
                          {addr.isCorporate && (
                            <p className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100">{addr.companyName}</p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Siparisler Tab */}
            {activeTab === 'siparisler' && (
              <div className="animate-in fade-in duration-300">
                <h3 className="text-2xl font-bold text-dilim-siyah mb-6">Siparişlerim</h3>
                <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-500 font-medium">Henüz bir siparişiniz bulunmuyor.</p>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}
