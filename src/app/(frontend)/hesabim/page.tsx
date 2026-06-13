"use client"

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Plus, Trash2, MapPin, Building2, Package, Calendar, CreditCard, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { taxOffices } from '@/data/taxOffices'
import Image from 'next/image'

const ALLOWED_DISTRICTS = [
  "Beykoz",
  "Ümraniye",
  "Üsküdar",
  "Kadıköy",
  "Ataşehir",
  "Çekmeköy"
]

export default function HesabimPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  
  // Default tab is 'siparisler'
  const [activeTab, setActiveTab] = useState('siparisler')
  
  // Profile State
  const [profileForm, setProfileForm] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '', // read-only
  })
  const [savingProfile, setSavingProfile] = useState(false)
  const [savedProfile, setSavedProfile] = useState(false)
  // Delete Account State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteInput, setDeleteInput] = useState('')
  const [deletingAccount, setDeletingAccount] = useState(false)

  // Birth Date State
  const [birthDate, setBirthDate] = useState('')
  const [savingBirth, setSavingBirth] = useState(false)
  const [hasExistingBirthDate, setHasExistingBirthDate] = useState(false)

  // Orders State
  const [orders, setOrders] = useState<any[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null)

  // Addresses State
  const [addresses, setAddresses] = useState<any[]>([])
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressForm, setAddressForm] = useState({
    id: '', title: '', district: '', address: '', isCorporate: false, companyName: '', taxOffice: '', taxNumber: ''
  })
  const [savingAddress, setSavingAddress] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/giris')
    } else if (status === 'authenticated') {
      
      // Hemen session verilerini forma koyalım (beklerken boş durmasın)
      setProfileForm(prev => ({
        ...prev,
        name: prev.name || session.user?.name || '',
        email: prev.email || session.user?.email || '',
      }))

      // Fetch Customer Data
      fetch('/api/customer/me')
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setProfileForm({
              name: data.user.name || session.user?.name || '',
              surname: data.user.surname || '',
              phone: data.user.phone || '',
              email: data.user.email || session.user?.email || '',
            })
            if (data.user.birthDate) {
              const date = new Date(data.user.birthDate)
              setBirthDate(date.toISOString().split('T')[0])
              setHasExistingBirthDate(true)
            }
            if (data.user.addresses) {
              setAddresses(data.user.addresses)
            }
          }
        })
        .catch(console.error)

      // Fetch Orders
      fetch('/api/customer/orders')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrders(data.orders)
          }
        })
        .catch(console.error)
        .finally(() => setLoadingOrders(false))
    }
  }, [status, router])
  const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]

  if (status === 'loading' || status === 'unauthenticated') {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>
  }

  // --- Profile Handlers ---
  const handleSaveProfile = async () => {
    setSavingProfile(true)
    try {
      const res = await fetch('/api/customer/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: profileForm.name,
          surname: profileForm.surname,
          phone: profileForm.phone
        })
      })
      const data = await res.json()
      if (res.ok) {
        setSavedProfile(true)
        toast.success("Profiliniz güncellendi.")
        setTimeout(() => setSavedProfile(false), 3000)
        // Update session client-side to reflect new name
        update()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        toast.error(`Kaydedilemedi: ${data.details || data.error || 'Bilinmeyen hata'}`)
      }
    } catch (e: any) {
      toast.error(`Bağlantı hatası: ${e.message}`)
    }
    setSavingProfile(false)
  }

  const handleSaveBirthDate = async () => {
    setSavingBirth(true)
    try {
      const res = await fetch('/api/customer/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthDate })
      })
      const data = await res.json()
      if (res.ok) {
        toast.success("Doğum tarihi kaydedildi.")
        setHasExistingBirthDate(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        toast.error(`Kaydedilemedi: ${data.details || data.error || 'Bilinmeyen hata'}`)
      }
    } catch (e: any) {
      toast.error(`Bağlantı hatası: ${e.message}`)
    }
    setSavingBirth(false)
  }

  const handleDeleteAccount = async () => {
    if (deleteInput !== 'HESABIMI SİL') {
      toast.error('Lütfen kutucuğa tam olarak HESABIMI SİL yazın.')
      return
    }
    setDeletingAccount(true)
    try {
      const res = await fetch('/api/customer/delete', { method: 'DELETE' })
      if (res.ok) {
        toast.success("Hesabınız silindi.")
        signOut({ callbackUrl: '/' })
      } else {
        toast.error("Hesap silinemedi.")
        setDeletingAccount(false)
      }
    } catch (e) {
      toast.error("Bir hata oluştu.")
      setDeletingAccount(false)
    }
  }

  // --- Address Handlers ---
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
        window.scrollTo({ top: 0, behavior: 'smooth' })
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

  const confirmDeleteAddress = async () => {
    if (!addressToDelete) return;
    try {
      const res = await fetch('/api/customer/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', addressId: addressToDelete })
      })
      const data = await res.json()
      if (res.ok) {
        setAddresses(data.addresses)
        toast.success("Adres silindi.")
      }
    } catch (e) {
      toast.error("Adres silinemedi.")
    } finally {
      setAddressToDelete(null)
    }
  }

  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'pending': return { text: 'Onay Bekliyor', icon: <Clock className="w-4 h-4 text-orange-500"/>, bg: 'bg-orange-50', color: 'text-orange-600' }
      case 'preparing': return { text: 'Hazırlanıyor', icon: <Package className="w-4 h-4 text-blue-500"/>, bg: 'bg-blue-50', color: 'text-blue-600' }
      case 'shipped': return { text: 'Kargoya Verildi', icon: <MapPin className="w-4 h-4 text-indigo-500"/>, bg: 'bg-indigo-50', color: 'text-indigo-600' }
      case 'delivered': return { text: 'Teslim Edildi', icon: <CheckCircle2 className="w-4 h-4 text-green-500"/>, bg: 'bg-green-50', color: 'text-green-600' }
      case 'cancelled': return { text: 'İptal Edildi', icon: <XCircle className="w-4 h-4 text-red-500"/>, bg: 'bg-red-50', color: 'text-red-600' }
      default: return { text: 'Bilinmiyor', icon: <Clock className="w-4 h-4 text-gray-500"/>, bg: 'bg-gray-50', color: 'text-gray-600' }
    }
  }

  const confirmCancelOrder = async () => {
    if (!orderToCancel) return;
    
    try {
      const res = await fetch('/api/customer/orders/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderToCancel })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Siparişiniz iptal edildi.");
        // Siparişi listede güncelle
        setOrders(orders.map(o => o.id === orderToCancel ? { ...o, status: 'cancelled' } : o));
      } else {
        toast.error(data.error || "Sipariş iptal edilemedi.");
      }
    } catch (error) {
      toast.error("Bir hata oluştu.");
    } finally {
      setOrderToCancel(null)
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-5xl min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-dilim-portakal/10 text-dilim-portakal rounded-full flex items-center justify-center text-2xl font-bold">
                {profileForm.name?.charAt(0) || session?.user?.name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <h2 className="font-bold text-dilim-siyah text-lg truncate">{profileForm.name || session?.user?.name}</h2>
                <p className="text-gray-500 text-sm truncate">{profileForm.email || session?.user?.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('siparisler')}
                className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'siparisler' ? 'bg-orange-50 text-dilim-portakal' : 'hover:bg-gray-50 text-gray-600'}`}
              >
                Siparişlerim
              </button>
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
              <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 font-medium text-red-600 transition-colors mt-4">
                Çıkış Yap
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 min-h-[500px]">
            
            {/* Siparisler Tab */}
            {activeTab === 'siparisler' && (
              <div className="animate-in fade-in duration-300">
                <h3 className="text-2xl font-bold text-dilim-siyah mb-6">Siparişlerim</h3>
                
                {loadingOrders ? (
                  <div className="py-12 text-center text-gray-500">Siparişleriniz yükleniyor...</div>
                ) : orders.length === 0 ? (
                  <div className="py-12 px-4 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium mb-6">Henüz bir siparişiniz bulunmuyor.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <Link href="/urunler" className="bg-dilim-siyah text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors w-full sm:w-auto inline-block">
                        Hemen Sipariş Ver
                      </Link>
                      <Link href="/tasarla" className="bg-dilim-portakal text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-500 transition-colors w-full sm:w-auto inline-block">
                        Kendi Pastanı Tasarla
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => {
                      const statusInfo = getStatusInfo(order.status)
                      return (
                        <div key={order.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-300 transition-colors shadow-sm">
                          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 border-b border-gray-100 pb-4">
                            <div>
                              <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5" /> 
                                {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                              </p>
                              <h4 className="font-bold text-dilim-siyah">Sipariş No: {order.orderNumber}</h4>
                            </div>
                            <div className="flex flex-col items-start md:items-end gap-2">
                              <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${statusInfo.bg} ${statusInfo.color}`}>
                                  {statusInfo.icon}
                                  {statusInfo.text}
                                </span>
                                {order.status === 'pending' && (
                                  <button 
                                    onClick={() => setOrderToCancel(order.id)}
                                    className="px-3 py-1 rounded-full text-xs font-bold bg-white border border-red-200 text-red-500 hover:bg-red-50 transition-colors flex items-center gap-1"
                                    title="Siparişi İptal Et"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    İptal Et
                                  </button>
                                )}
                              </div>
                              <span className="font-bold text-dilim-portakal">{order.totalAmount} ₺</span>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            {order.orderItems?.map((item: any, index: number) => {
                              const prod = typeof item.product === 'object' ? item.product : null;
                              return (
                                <div key={index} className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-gray-100 rounded-xl relative overflow-hidden flex-shrink-0 border border-gray-200">
                                    <Image src={prod?.images?.[0]?.url || '/generated/hero_cake.png'} alt={prod?.name || 'Ürün'} fill className="object-cover" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-gray-800">{prod?.name || 'Özel Ürün'}</p>
                                    <p className="text-xs text-gray-500">{item.quantity} Adet x {item.price} ₺</p>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Profil Tab */}
            {activeTab === 'profil' && (
              <div className="animate-in fade-in duration-300">
                <h3 className="text-2xl font-bold text-dilim-siyah mb-6">Profil Bilgilerim</h3>
                <div className="space-y-6">
                  
                  {/* Güncellenebilir Profil Alanı */}
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Adınız</label>
                        <input type="text" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-dilim-portakal outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Soyadınız</label>
                        <input type="text" value={profileForm.surname} onChange={e => setProfileForm({...profileForm, surname: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-dilim-portakal outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Telefon Numarası</label>
                        <input type="tel" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-dilim-portakal outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-500 mb-1">E-Posta Adresi <span className="text-xs text-red-500 font-normal">(Değiştirilemez)</span></label>
                        <input type="email" disabled value={profileForm.email} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed" />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button 
                        onClick={handleSaveProfile}
                        disabled={savingProfile}
                        className="px-6 py-2.5 bg-dilim-portakal text-white font-bold rounded-xl hover:bg-dilim-turuncu disabled:opacity-70 transition-colors"
                      >
                        {savingProfile ? 'Kaydediliyor...' : savedProfile ? 'Kaydedildi!' : 'Bilgileri Güncelle'}
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mt-6">
                    <div className="flex gap-4 items-end">
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Doğum Tarihi</label>
                        <input 
                          type="date" 
                          value={birthDate}
                          max={maxDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-dilim-portakal outline-none" 
                        />
                      </div>
                      <button 
                        onClick={handleSaveBirthDate}
                        disabled={!birthDate || savingBirth}
                        className="px-6 py-3 bg-dilim-portakal text-white font-semibold rounded-xl hover:bg-dilim-turuncu disabled:bg-gray-400 transition-colors"
                      >
                        {savingBirth ? 'Kaydediliyor...' : hasExistingBirthDate ? 'Güncelle' : 'Kaydet'}
                      </button>
                    </div>
                  </div>

                  {/* Hesabımı Sil Bölümü */}
                  <div className="mt-12 pt-8 border-t border-gray-100">
                    <h4 className="font-bold text-red-600 mb-2">Hesap İşlemleri</h4>
                    <p className="text-sm text-gray-500 mb-4">
                      Hesabınızı silmek geri alınamaz bir işlemdir. Kişisel verileriniz sistemden tamamen kaldırılır, ancak sipariş geçmişiniz veri bütünlüğü nedeniyle anonim olarak tutulur.
                    </p>
                    
                    {!showDeleteConfirm ? (
                      <button 
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-5 py-2.5 border border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 hover:border-red-300 transition-colors text-sm"
                      >
                        Hesabımı Sil
                      </button>
                    ) : (
                      <div className="bg-red-50 p-5 rounded-2xl border border-red-200 animate-in slide-in-from-top-2 duration-200">
                        <p className="text-sm font-semibold text-red-800 mb-3">
                          Onaylamak için aşağıdaki kutucuğa <strong>HESABIMI SİL</strong> yazın:
                        </p>
                        <div className="flex gap-3 max-w-sm">
                          <input 
                            type="text" 
                            placeholder="HESABIMI SİL" 
                            value={deleteInput}
                            onChange={(e) => setDeleteInput(e.target.value)}
                            className="flex-1 p-2.5 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none uppercase"
                          />
                          <button 
                            onClick={handleDeleteAccount}
                            disabled={deletingAccount || deleteInput !== 'HESABIMI SİL'}
                            className="px-4 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                          >
                            Sil
                          </button>
                        </div>
                        <button 
                          onClick={() => {setShowDeleteConfirm(false); setDeleteInput('');}}
                          className="text-xs text-gray-500 hover:text-gray-800 mt-3 font-semibold"
                        >
                          İptal Et
                        </button>
                      </div>
                    )}
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
                          <input type="text" value={addressForm.title} onChange={e => setAddressForm({...addressForm, title: e.target.value})} required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal outline-none bg-white" placeholder="Ev Adresim" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">İlçe</label>
                          <select value={addressForm.district} onChange={e => setAddressForm({...addressForm, district: e.target.value})} required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal outline-none bg-white">
                            <option value="">İlçe Seçiniz</option>
                            {ALLOWED_DISTRICTS.map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Açık Adres</label>
                        <textarea value={addressForm.address} onChange={e => setAddressForm({...addressForm, address: e.target.value})} required rows={3} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal outline-none resize-none bg-white" placeholder="Mahalle, sokak, bina no..."></textarea>
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
                              <input 
                                list="tax-offices-list-hesabim"
                                type="text" 
                                value={addressForm.taxOffice} 
                                onChange={e => setAddressForm({...addressForm, taxOffice: e.target.value})} 
                                required={addressForm.isCorporate} 
                                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-dilim-portakal outline-none" 
                                placeholder="Yazın veya seçin"
                              />
                              <datalist id="tax-offices-list-hesabim">
                                {taxOffices.map((office, idx) => (
                                  <option key={idx} value={office} />
                                ))}
                              </datalist>
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
                              <button onClick={() => setAddressToDelete(addr.id)} className="text-xs text-red-500 hover:underline">Sil</button>
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

          </div>
        </div>

      </div>

      {/* Order Cancel Modal */}
      {orderToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-center text-dilim-siyah mb-2">Siparişi İptal Et</h3>
            <p className="text-gray-500 text-center mb-6 text-sm">Siparişinizi iptal etmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setOrderToCancel(null)}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Vazgeç
              </button>
              <button 
                onClick={confirmCancelOrder}
                className="flex-1 py-3 px-4 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors"
              >
                İptal Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address Delete Modal */}
      {addressToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-center text-dilim-siyah mb-2">Adresi Sil</h3>
            <p className="text-gray-500 text-center mb-6 text-sm">Bu adresi silmek istediğinize emin misiniz?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setAddressToDelete(null)}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Vazgeç
              </button>
              <button 
                onClick={confirmDeleteAddress}
                className="flex-1 py-3 px-4 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
