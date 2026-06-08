"use client"

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function KayitPage() {
  const { status } = useSession()
  const router = useRouter()
  
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [birthDay, setBirthDay] = useState('')
  const [birthMonth, setBirthMonth] = useState('')
  const [birthYear, setBirthYear] = useState('')
  const [gender, setGender] = useState('other')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/hesabim')
    }
  }, [status, router])

  if (status === 'loading' || status === 'authenticated') {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      // Doğum tarihini birleştir (Yıl-Ay-Gün formatı)
      let birthDate = undefined;
      if (birthYear && birthMonth && birthDay) {
        birthDate = `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, surname, email, phone, password, birthDate, gender }),
      })

      const data = await res.json()

      if (!data.success) {
        setErrorMsg(data.error || 'Kayıt olurken bir hata oluştu.')
        setLoading(false)
        return
      }

      // Kayıt başarılı, otomatik giriş yap
      const signInRes = await signIn('credentials', {
        redirect: false,
        email,
        password
      })

      if (signInRes?.error) {
        setErrorMsg('Kayıt başarılı ancak otomatik giriş yapılamadı. Lütfen giriş sayfasından giriş yapın.')
        setLoading(false)
        setTimeout(() => router.push('/giris'), 2000)
      } else {
        router.push('/hesabim')
      }

    } catch (err) {
      console.error(err)
      setErrorMsg('Beklenmeyen bir sunucu hatası oluştu.')
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 bg-gray-50 flex flex-col justify-center py-24 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-dilim-siyah">
          Yeni Hesap Oluştur
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Dilim dünyasının ayrıcalıklarından faydalanmak için hemen üye olun.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
          
          {errorMsg && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <p className="text-sm text-red-700">{errorMsg}</p>
            </div>
          )}

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => signIn('google')}
              className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Google ile Kayıt Ol
            </button>

            <button
              type="button"
              onClick={() => signIn('facebook')}
              className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-transparent rounded-xl shadow-sm bg-[#1877F2] text-sm font-medium text-white hover:bg-[#166FE5] transition-colors"
            >
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-5 h-5 brightness-0 invert" />
              Facebook ile Kayıt Ol
            </button>
          </div>

          <div className="mt-6 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">veya form ile kayıt olun</span>
              </div>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Ad</label>
                <div className="mt-1">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-dilim-portakal focus:border-dilim-portakal sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Soyadı</label>
                <div className="mt-1">
                  <input
                    type="text"
                    required
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-dilim-portakal focus:border-dilim-portakal sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Doğum Günü (Opsiyonel)</label>
              <div className="mt-1 flex gap-2">
                <select
                  value={birthDay}
                  onChange={(e) => setBirthDay(e.target.value)}
                  className="block w-full px-3 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-dilim-portakal focus:border-dilim-portakal sm:text-sm"
                >
                  <option value="">Gün</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                
                <select
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(e.target.value)}
                  className="block w-full px-3 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-dilim-portakal focus:border-dilim-portakal sm:text-sm"
                >
                  <option value="">Ay</option>
                  {['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'].map((month, i) => (
                    <option key={i} value={i + 1}>{month}</option>
                  ))}
                </select>

                <select
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  className="block w-full px-3 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-dilim-portakal focus:border-dilim-portakal sm:text-sm"
                >
                  <option value="">Yıl</option>
                  {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Cinsiyet (Opsiyonel)</label>
              <div className="mt-1">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="block w-full px-3 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-dilim-portakal focus:border-dilim-portakal sm:text-sm"
                >
                  <option value="female">Kadın</option>
                  <option value="male">Erkek</option>
                  <option value="other">Belirtmek İstemiyorum</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Cep Telefonu Numarası</label>
              <div className="mt-1">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-dilim-portakal focus:border-dilim-portakal sm:text-sm"
                  placeholder="05XX XXX XX XX"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">E-Posta Adresi</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-dilim-portakal focus:border-dilim-portakal sm:text-sm"
                  placeholder="ornek@mail.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Şifre</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-dilim-portakal focus:border-dilim-portakal sm:text-sm"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-dilim-portakal hover:bg-dilim-turuncu focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dilim-portakal disabled:opacity-70 transition-colors"
              >
                {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
              </button>
            </div>
            
            <div className="mt-6 text-center text-sm text-gray-600">
              Zaten bir hesabınız var mı?{' '}
              <a href="/giris" className="font-bold text-dilim-portakal hover:text-dilim-turuncu transition-colors">
                Giriş Yapın
              </a>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  )
}
