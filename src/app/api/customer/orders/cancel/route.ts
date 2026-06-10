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
    
    // Check if order belongs to the user and is in 'pending' status
    const order = await payload.findByID({
      collection: 'orders' as any,
      id: orderId,
      overrideAccess: true,
    })

    if (!order) return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 })
    if (order.customerInfo?.email !== session.user.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    
    if (order.status !== 'pending') {
      return NextResponse.json({ error: 'Sadece onay bekleyen siparişler iptal edilebilir.' }, { status: 400 })
    }

    // Update status to 'cancelled'
    const updatedOrder = await payload.update({
      collection: 'orders' as any,
      id: orderId,
      data: {
        status: 'cancelled',
      },
      overrideAccess: true,
    })
    
    return NextResponse.json({ success: true, order: updatedOrder })
  } catch (error) {
    console.error('Sipariş iptal hatası:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
