import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const { birthDate, name, surname, phone } = await req.json()
    
    const payload = await getPayload({ config: configPromise })
    const users = await payload.find({
      collection: 'customers' as any,
      where: { email: { equals: session.user.email } },
      overrideAccess: true,
      depth: 0,
    })
    
    if (users.docs.length > 0) {
      const updateData: any = {}
      if (birthDate !== undefined) updateData.birthDate = birthDate ? new Date(birthDate).toISOString() : null
      if (name !== undefined) updateData.name = name
      if (surname !== undefined) updateData.surname = surname
      if (phone !== undefined) updateData.phone = phone

      try {
        await payload.update({
          collection: 'customers' as any,
          id: users.docs[0].id,
          data: updateData,
          overrideAccess: true,
          depth: 0,
        })
        return NextResponse.json({ success: true })
      } catch (updateError: any) {
        console.error('Payload update payload error:', updateError?.data || updateError)
        return NextResponse.json({ error: 'Update failed', details: updateError?.data?.errors?.[0]?.message || updateError.message }, { status: 400 })
      }
    }

    // Müşteri kaydı yoksa (eski OAuth girişlerinden kalmış olabilir), otomatik oluştur
    try {
      const fullName = session.user.name || '';
      const nameParts = fullName.trim().split(' ');
      const sessionSurname = nameParts.length > 1 ? nameParts.pop() : '';
      const sessionFirstName = nameParts.join(' ') || session.user.email.split('@')[0];

      const randomPassword = crypto.randomBytes(32).toString('hex')
      const createData: any = {
        email: session.user.email,
        name: name || sessionFirstName,
        password: randomPassword,
        provider: 'social',
      }
      if (surname !== undefined) {
        createData.surname = surname
      } else if (sessionSurname) {
        createData.surname = sessionSurname
      }
      if (phone !== undefined) createData.phone = phone
      if (birthDate !== undefined) createData.birthDate = birthDate ? new Date(birthDate).toISOString() : null

      await payload.create({
        collection: 'customers' as any,
        data: createData,
        overrideAccess: true,
      })
      return NextResponse.json({ success: true })
    } catch (createError: any) {
      console.error('Customer auto-create error:', createError?.data || createError)
      return NextResponse.json({ error: 'Not found', details: 'Müşteri kaydı oluşturulamadı' }, { status: 404 })
    }
  } catch (error: any) {
    console.error('Profil güncelleme hatası:', error?.data?.errors || error?.message || error)
    return NextResponse.json({ error: 'Server error', details: error?.message }, { status: 500 })
  }
}
