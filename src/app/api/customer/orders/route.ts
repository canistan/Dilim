import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const payload = await getPayload({ config: configPromise })
    
    const orders = await payload.find({
      collection: 'orders' as any,
      where: { 
        'customerInfo.email': { 
          equals: session.user.email 
        } 
      },
      sort: '-createdAt', // En yeniler en üstte
      limit: 50,
      overrideAccess: true,
    })
    
    return NextResponse.json({ success: true, orders: orders.docs })
  } catch (error) {
    console.error('Siparişleri çekerken hata:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
