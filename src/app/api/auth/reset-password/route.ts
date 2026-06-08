import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json({ success: false, error: 'Token ve yeni şifre gereklidir.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    // Payload CMS auth koleksiyonlarında yerleşik bir resetPassword fonksiyonu vardır.
    const result = await payload.resetPassword({
      collection: 'customers' as any,
      data: {
        token,
        password,
      },
    })

    if (result.token) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: 'Şifre sıfırlama işlemi başarısız oldu.' }, { status: 400 })
    }

  } catch (error: any) {
    console.error('Reset password hatası:', error)
    return NextResponse.json({ success: false, error: 'Geçersiz veya süresi dolmuş kod.' }, { status: 400 })
  }
}
