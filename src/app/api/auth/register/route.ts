import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: Request) {
  try {
    const { name, surname, email, phone, password, birthDate, gender } = await req.json()

    if (!name || !surname || !email || !phone || !password) {
      return NextResponse.json({ success: false, error: 'Lütfen zorunlu alanları doldurun.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    // E-posta adresi kullanımda mı kontrolü
    const existingUsers = await payload.find({
      collection: 'customers' as any,
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (existingUsers.totalDocs > 0) {
      return NextResponse.json({ success: false, error: 'Bu e-posta adresi zaten kullanımda.' }, { status: 400 })
    }

    // Yeni müşteriyi (customer) Payload CMS'e kaydet
    const newUser = await payload.create({
      collection: 'customers' as any,
      data: {
        name,
        surname,
        email,
        phone,
        gender,
        password, // Payload auth koleksiyonlarında şifreyi otomatik hash'ler
        birthDate: birthDate ? new Date(birthDate).toISOString() : undefined,
        provider: 'credentials',
      },
    })

    return NextResponse.json({ 
      success: true, 
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      }
    })

  } catch (error: any) {
    console.error('Kayıt hatası:', error)
    return NextResponse.json({ success: false, error: 'Kayıt sırasında bir hata oluştu.' }, { status: 500 })
  }
}
