import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const { code, cartTotal } = await req.json()

    if (!code) {
      return NextResponse.json({ success: false, error: 'Kupon kodu gerekli' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    // Kuponu veritabanında ara
    const result = await payload.find({
      collection: 'coupons',
      where: {
        code: {
          equals: code.toUpperCase().trim()
        }
      }
    })

    if (result.totalDocs === 0) {
      return NextResponse.json({ success: false, error: 'Geçersiz kupon kodu' }, { status: 400 })
    }

    const coupon = result.docs[0]

    // Aktif mi?
    if (!coupon.isActive) {
      return NextResponse.json({ success: false, error: 'Bu kupon kodu pasif durumda' }, { status: 400 })
    }

    // Süresi dolmuş mu?
    if (coupon.expiryDate) {
      const expiry = new Date(coupon.expiryDate)
      if (expiry < new Date()) {
        return NextResponse.json({ success: false, error: 'Bu kuponun süresi dolmuş' }, { status: 400 })
      }
    }

    // Minimum sepet tutarı sağlanıyor mu?
    if (coupon.minimumCartValue && cartTotal < coupon.minimumCartValue) {
      return NextResponse.json({ 
        success: false, 
        error: `Bu kuponu kullanmak için minimum sepet tutarı ${coupon.minimumCartValue} TL olmalıdır.` 
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue
      }
    })

  } catch (error: any) {
    console.error('Kupon doğrulama hatası:', error)
    return NextResponse.json(
      { success: false, error: 'Kupon doğrulanırken bir hata oluştu' },
      { status: 500 }
    )
  }
}
