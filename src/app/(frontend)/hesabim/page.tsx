"use client"

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function HesabimPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [birthDate, setBirthDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/giris')
    }
  }, [status, router])

  if (status === 'loading' || status === 'unauthenticated') {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>
  }

  const handleSaveBirthDate = async () => {
    setSaving(true)
    try {
      // In a real scenario, this would call an API endpoint to update the Customer record in Payload CMS
      await new Promise(r => setTimeout(r, 1000)); // Simulate API call
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      alert("Kaydedilemedi.")
    }
    setSaving(false)
  }

  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-1/3">
          <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-dilim-portakal/10 text-dilim-portakal rounded-full flex items-center justify-center text-2xl font-bold">
                {session?.user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h2 className="font-bold text-dilim-siyah text-lg">{session?.user?.name}</h2>
                <p className="text-gray-500 text-sm">{session?.user?.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <a href="#" className="block px-4 py-3 rounded-xl bg-gray-50 font-semibold text-dilim-portakal">
                Profil Bilgilerim
              </a>
              <a href="#" className="block px-4 py-3 rounded-xl hover:bg-gray-50 font-medium text-gray-600 transition-colors">
                Siparişlerim
              </a>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 font-medium text-red-600 transition-colors mt-4">
                Çıkış Yap
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="w-full md:w-2/3">
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
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

              <div className="p-5 bg-[#FFF8F3] border border-[#FFE8D6] rounded-2xl relative overflow-hidden">
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
        </div>

      </div>
    </div>
  )
}
