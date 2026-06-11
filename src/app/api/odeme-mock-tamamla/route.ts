import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json()

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'orderId gerekli' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })
    
    await payload.update({
      collection: 'orders' as any,
      id: orderId,
      data: {
        paymentStatus: 'paid',
      }
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Mock ödeme hatası:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
