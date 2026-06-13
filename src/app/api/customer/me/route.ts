import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const payload = await getPayload({ config: configPromise })
    const users = await payload.find({
      collection: 'customers' as any,
      where: { email: { equals: session.user.email } },
      overrideAccess: true,
      depth: 0,
    })
    
    if (users.docs.length > 0) {
      return NextResponse.json({ user: users.docs[0] })
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  } catch (error: any) {
    console.error('Müşteri bilgi hatası:', error?.message || error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
