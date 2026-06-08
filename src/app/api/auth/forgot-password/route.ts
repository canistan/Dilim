import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ success: false, error: 'E-posta adresi gereklidir.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    // Payload CMS auth koleksiyonlarında yerleşik bir forgotPassword fonksiyonu vardır.
    // Eğer SMTP_HOST ayarlanmışsa gerçek mail atılır, ayarlanmamışsa simülasyon token'ı döner.
    const token = await payload.forgotPassword({
      collection: 'customers' as any,
      data: { email },
      disableEmail: !process.env.SMTP_HOST,
    })

    if (!token) {
      // Güvenlik gereği "Kullanıcı bulunamadı" demek yerine her zaman başarılı dönüyoruz
      return NextResponse.json({ success: true, simulatedToken: null })
    }

    // SMTP ayarları yoksa sunum simülasyonu için token gönderilir, varsa gerçek maile gidilir
    return NextResponse.json({ 
      success: true, 
      simulatedToken: process.env.SMTP_HOST ? null : token 
    })

  } catch (error: any) {
    console.error('Forgot password hatası:', error)
    // Payload kullanıcı bulamazsa hata fırlatabilir, güvenlik için her zaman başarılı gibi dönüyoruz.
    return NextResponse.json({ success: true, simulatedToken: null })
  }
}
