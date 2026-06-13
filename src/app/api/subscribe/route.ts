import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Geçerli bir e-posta adresi giriniz.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    // Check if already subscribed
    const existing = await payload.find({
      collection: 'subscribers' as any,
      where: { email: { equals: email } },
    })

    if (existing.docs.length > 0) {
      return NextResponse.json({ error: 'Bu e-posta adresi zaten bültene kayıtlı.' }, { status: 400 })
    }

    // Create new subscriber
    await payload.create({
      collection: 'subscribers' as any,
      data: {
        email,
        source: 'footer',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Bülten abonelik hatası:', error?.message || error)
    return NextResponse.json({ error: 'Abonelik işlemi sırasında bir hata oluştu.' }, { status: 500 })
  }
}
