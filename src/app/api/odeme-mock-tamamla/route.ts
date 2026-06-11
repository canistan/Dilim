import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const maxDuration = 60; // Vercel timeout'u uzat

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json()

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'orderId gerekli' }, { status: 400 })
    }

    // Kullaniciyi bekletmemek icin DB guncellemesini beklemeden basarili donuyoruz
    // (Arka planda calismaya devam eder)
    getPayload({ config: configPromise }).then(async (payload) => {
      try {
        await payload.update({
          collection: 'orders' as any,
          id: orderId,
          data: {
            paymentStatus: 'paid',
          }
        });
      } catch (e) {
        console.error("Mock order update background error:", e);
      }
    }).catch(e => console.error("Payload init error:", e));

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Mock ödeme hatası:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
