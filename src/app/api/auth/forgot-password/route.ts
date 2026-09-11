import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getResetPasswordEmailHTML } from '@/lib/emailTemplates'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ success: false, error: 'E-posta adresi gereklidir.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    // Payload'ın varsayılan e-postasını devre dışı bırak, sadece token al
    const token = await payload.forgotPassword({
      collection: 'customers' as any,
      data: { email },
      disableEmail: true, // Payload'ın çirkin varsayılan e-postasını engelle
    })

    if (!token) {
      // Güvenlik gereği "Kullanıcı bulunamadı" demek yerine her zaman başarılı dönüyoruz
      return NextResponse.json({ success: true })
    }

    // Kendi kurumsal e-postamızı gönder
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dilim.com.tr'
    const resetUrl = `${siteUrl}/sifre-sifirla?token=${token}`

    try {
      await payload.sendEmail({
        to: email,
        subject: 'Şifre Sıfırlama - Dilim Pastaneleri',
        html: getResetPasswordEmailHTML(resetUrl),
      })
    } catch (emailError) {
      console.error('E-posta gönderme hatası:', emailError)
      // E-posta gönderilemese bile güvenlik gereği başarılı dönüyoruz
    }

    return NextResponse.json({ 
      success: true,
      message: 'Şifre sıfırlama e-postası gönderildi.'
    })

  } catch (error: any) {
    console.error('Forgot password hatası:', error)
    // Payload kullanıcı bulamazsa hata fırlatabilir, güvenlik için her zaman başarılı gibi dönüyoruz.
    return NextResponse.json({ success: true })
  }
}
