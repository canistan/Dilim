"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { KeyRound, Mail, ArrowRight } from 'lucide-react'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Lütfen e-posta adresinizi girin.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (data.success) {
        setSuccess(true)
        toast.success('Şifre sıfırlama bağlantısı gönderildi.')
        
        // SUNUM SİMÜLASYONU (Canlıda kaldırılıp sadece başarılı mesajı gösterilecek)
        if (data.simulatedToken) {
          setTimeout(() => {
            toast('Simülasyon: Maile tıkladığınız varsayılarak yönlendiriliyorsunuz...', { icon: '🤖', duration: 4000 })
            router.push(`/sifre-sifirla?token=${data.simulatedToken}`)
          }, 3000)
        }
      } else {
        toast.error(data.error || 'Bir hata oluştu.')
        setLoading(false)
      }
    } catch (error) {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-20 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 max-w-md w-full">
        
        <div className="w-16 h-16 bg-dilim-portakal/10 text-dilim-portakal rounded-2xl flex items-center justify-center mx-auto mb-6">
          <KeyRound className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold text-center text-dilim-siyah mb-2">Şifremi Unuttum</h1>
        <p className="text-gray-500 text-center text-sm mb-8">
          Kayıtlı e-posta adresinizi girin, size şifrenizi yenilemeniz için bir bağlantı gönderelim.
        </p>

        {success ? (
          <div className="bg-green-50 border border-green-200 p-6 rounded-2xl text-center animate-in fade-in zoom-in duration-300">
            <h3 className="font-bold text-green-700 mb-2">Bağlantı Gönderildi!</h3>
            <p className="text-sm text-green-600">
              Lütfen e-posta kutunuzu (ve gerekiyorsa spam klasörünü) kontrol edin.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">E-Posta Adresiniz</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal outline-none bg-white transition-shadow"
                  placeholder="ornek@mail.com"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-dilim-portakal text-white font-bold rounded-xl hover:bg-dilim-turuncu transition-colors disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? 'Gönderiliyor...' : 'Bağlantı Gönder'}
              {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link href="/giris" className="text-sm font-semibold text-gray-500 hover:text-dilim-portakal transition-colors">
            Giriş ekranına geri dön
          </Link>
        </div>
      </div>
    </div>
  )
}
