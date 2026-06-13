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
      where: { email: { equals: session.user.email } },
      overrideAccess: true,
      depth: 0,
    })
    
    if (users.docs.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const user = users.docs[0]
    let addresses = user.addresses || []

    // Payload CMS boş string ID veya gereksiz alanları sevmez, temizleyelim:
    let cleanAddress = { ...address }
    if (!cleanAddress.id) delete cleanAddress.id
    if (!cleanAddress.isCorporate) {
      delete cleanAddress.companyName
      delete cleanAddress.taxOffice
      delete cleanAddress.taxNumber
      cleanAddress.isCorporate = false
    }

    if (action === 'add') {
      addresses.unshift(cleanAddress)
    } else if (action === 'delete') {
      addresses = addresses.filter((a: any) => a.id !== addressId)
    } else if (action === 'update') {
      addresses = addresses.map((a: any) => a.id === addressId ? { ...a, ...cleanAddress, id: a.id } : a)
    }

    // Mevcut adreslerden de boş ID'leri temizle
    addresses = addresses.map((a: any) => {
      const cleaned = { ...a }
      if (!cleaned.id) delete cleaned.id
      if (!cleaned.isCorporate) {
        delete cleaned.companyName
        delete cleaned.taxOffice
        delete cleaned.taxNumber
      }
      return cleaned
    })

    const updatedUser = await payload.update({
      collection: 'customers' as any,
      id: user.id,
      data: { 
        addresses
      },
      overrideAccess: true,
      depth: 0,
    })
    
    return NextResponse.json({ success: true, addresses: updatedUser.addresses || [] })
  } catch (error: any) {
    console.error('Adres kaydetme hatası:', error?.data?.errors || error?.message || error)
    return NextResponse.json({ error: 'Server error', details: error?.message }, { status: 500 })
  }
}
