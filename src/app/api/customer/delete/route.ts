import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const payload = await getPayload({ config: configPromise })
    const users = await payload.find({
      collection: 'customers' as any,
      where: { email: { equals: session.user.email } },
      overrideAccess: true,
    })
    
    if (users.docs.length > 0) {
      await payload.delete({
        collection: 'customers' as any,
        id: users.docs[0].id,
        overrideAccess: true,
      })
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  } catch (error) {
    console.error('Kullanıcı hesabı silinirken hata:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
