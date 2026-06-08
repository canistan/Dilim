import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const { birthDate } = await req.json()
    
    const payload = await getPayload({ config: configPromise })
    const users = await payload.find({
      collection: 'customers' as any,
      where: { email: { equals: session.user.email } }
    })
    
    if (users.docs.length > 0) {
      await payload.update({
        collection: 'customers' as any,
        id: users.docs[0].id,
        data: { birthDate: birthDate ? new Date(birthDate).toISOString() : null }
      })
      return NextResponse.json({ success: true })
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
