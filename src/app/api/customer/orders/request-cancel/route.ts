import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const { orderId } = await req.json()
    if (!orderId) return NextResponse.json({ error: 'Order ID required' }, { status: 400 })

    const payload = await getPayload({ config: configPromise })
    
    // Check if order belongs to the user
    const order = await payload.findByID({
      collection: 'orders' as any,
      id: orderId,
      overrideAccess: true,
    })

    if (!order) return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 })
    if (order.customerInfo?.email !== session.user.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    
    // Validate that order can be requested for cancellation
    if (order.orderType === 'custom') {
      return NextResponse.json({ error: 'Özel sipariş iptalleri için lütfen WhatsApp üzerinden iletişime geçiniz.' }, { status: 400 })
    }

    if (order.status === 'delivered') {
      return NextResponse.json({ error: 'Teslim edilmiş siparişler iptal edilemez.' }, { status: 400 })
    }

    if (order.status === 'cancelled') {
      return NextResponse.json({ error: 'Bu sipariş zaten iptal edilmiş.' }, { status: 400 })
    }

    if (order.cancellationRequest?.requested) {
      return NextResponse.json({ error: 'Bu sipariş için zaten bir iptal talebiniz bulunuyor.' }, { status: 400 })
    }

    // Update the cancellation request without changing the order status
    const updatedOrder = await payload.update({
      collection: 'orders' as any,
      id: orderId,
      data: {
        cancellationRequest: {
          requested: true,
          requestedAt: new Date().toISOString(),
          decision: 'pending',
        }
      },
      overrideAccess: true,
    })
    
    return NextResponse.json({ success: true, order: updatedOrder })
  } catch (error) {
    console.error('Sipariş iptal talebi hatası:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
