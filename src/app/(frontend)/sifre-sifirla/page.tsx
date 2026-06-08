"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      toast.error('Geçersiz şifre sıfırlama bağlantısı.')
      router.push('/sifremi-unuttum')
    }
  }, [token, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== passwordConfirm) {
      toast.error('Şifreler eşleşmiyor.')
      return
    }

    if (password.length < 6) {
      toast.error('Şifreniz en az 6 karakter olmalıdır.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      })

      const data = await res.json()

      if (data.success) {
        toast.success('Şifreniz başarıyla yenilendi!', { duration: 4000 })
        router.push('/giris')
      } else {
        toast.error(data.error || 'Şifre sıfırlanamadı. Bağlantınızın süresi dolmuş olabilir.')
        setLoading(false)
      }
    } catch (error) {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.')
      setLoading(false)
    }
  }

  if (!token) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-20 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 max-w-md w-full">
        
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold text-center text-dilim-siyah mb-2">Yeni Şifre Belirle</h1>
        <p className="text-gray-500 text-center text-sm mb-8">
          Lütfen hesabınız için kullanmak istediğiniz yeni şifrenizi girin.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Yeni Şifre</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal outline-none bg-white transition-shadow"
                placeholder="••••••••"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Yeni Şifre (Tekrar)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-dilim-portakal outline-none bg-white transition-shadow"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-dilim-portakal text-white font-bold rounded-xl hover:bg-dilim-turuncu transition-colors disabled:opacity-70 disabled:cursor-not-allowed group mt-2"
          >
            {loading ? 'Güncelleniyor...' : 'Şifremi Güncelle'}
            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/giris" className="text-sm font-semibold text-gray-500 hover:text-dilim-portakal transition-colors">
            Giriş ekranına dön
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
