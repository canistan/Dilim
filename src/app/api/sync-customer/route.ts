import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { email, name, provider, providerAccountId } = data

    if (!email) {
      return NextResponse.json({ success: false, error: 'E-posta zorunlu' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    const existingCustomers = await payload.find({
      collection: 'customers',
      where: {
        email: {
          equals: email
        }
      }
    });

    if (existingCustomers.docs.length === 0) {
      // Yeni müşteri oluştur
      await payload.create({
        collection: 'customers',
        data: {
          name: name || email.split('@')[0],
          email: email,
          provider: provider || 'credentials',
          providerAccountId: providerAccountId || '',
        }
      })
    } else {
      // Mevcut müşteriyi güncelle (eğer sosyal giriş ise ID'sini kaydet)
      if (provider !== 'credentials' && !existingCustomers.docs[0].providerAccountId) {
        await payload.update({
          collection: 'customers',
          id: existingCustomers.docs[0].id,
          data: {
            provider: provider,
            providerAccountId: providerAccountId
          }
        })
      }
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Customer sync error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
