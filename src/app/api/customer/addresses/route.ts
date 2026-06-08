import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const body = await req.json()
    const { action, address, addressId } = body
    
    const payload = await getPayload({ config: configPromise })
    const users = await payload.find({
      collection: 'customers' as any,
      where: { email: { equals: session.user.email } }
    })
    
    if (users.docs.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const user = users.docs[0]
    let addresses = user.addresses || []

    if (action === 'add') {
      addresses.push(address)
    } else if (action === 'delete') {
      addresses = addresses.filter((a: any) => a.id !== addressId)
    } else if (action === 'update') {
      addresses = addresses.map((a: any) => a.id === addressId ? { ...a, ...address, id: a.id } : a)
    }

    await payload.update({
      collection: 'customers' as any,
      id: user.id,
      data: { addresses }
    })
    
    return NextResponse.json({ success: true, addresses })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
