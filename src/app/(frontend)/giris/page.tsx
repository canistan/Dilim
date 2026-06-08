"use client"

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function GirisPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/hesabim')
    }
  }, [status, router])

  if (status === 'loading' || status === 'authenticated') {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>
  }

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password
    })
    
    if (res?.error) {
      toast.error("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.")
    } else {
      router.push('/hesabim')
    }
    setLoading(false)
  }

  return (
    <div className="flex-1 bg-gray-50 flex flex-col justify-center py-24 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-dilim-siyah">
          Hoş Geldiniz
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Siparişlerinizi takip etmek ve kampanyalardan yararlanmak için giriş yapın.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
          
          {/* Social Login Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => signIn('google')}
              className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Google ile Devam Et
            </button>

            <button
              onClick={() => signIn('facebook')}
              className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-transparent rounded-xl shadow-sm bg-[#1877F2] text-sm font-medium text-white hover:bg-[#166FE5] transition-colors"
            >
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-5 h-5 brightness-0 invert" />
              Facebook ile Devam Et
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">veya e-posta / telefon ile</span>
              </div>
            </div>
          </div>

          <form className="space-y-4 mt-6" onSubmit={handleCredentialsLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700">E-posta adresi veya cep telefonu numarası</label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-dilim-portakal focus:border-dilim-portakal sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Şifre</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-dilim-portakal focus:border-dilim-portakal sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-dilim-portakal hover:bg-dilim-turuncu focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dilim-portakal disabled:opacity-70 transition-colors"
              >
                {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <a href="#" className="text-sm font-medium text-dilim-portakal hover:text-dilim-turuncu transition-colors">
                Şifreni mi unuttun?
              </a>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <a 
                href="/kayit" 
                className="w-full flex justify-center py-3 px-4 border border-dilim-portakal rounded-xl shadow-sm text-sm font-bold text-dilim-portakal bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dilim-portakal transition-colors"
              >
                Yeni hesap oluştur
              </a>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  )
}
