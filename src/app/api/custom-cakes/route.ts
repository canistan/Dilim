import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    
    const customerName = formData.get('customerName') as string
    const customerPhone = formData.get('customerPhone') as string
    const customerEmail = formData.get('customerEmail') as string
    const customerAddress = formData.get('customerAddress') as string
    
    const size = formData.get('size') as string
    const base = formData.get('base') as string
    const filling = formData.get('filling') as string
    const frosting = formData.get('frosting') as string
    const note = formData.get('note') as string
    
    // Yüklenen dosyayı al (isteğe bağlı)
    const file = formData.get('referenceImage') as File | null
    
    if (!customerName || !customerPhone || !customerAddress) {
      return NextResponse.json({ success: false, error: 'Eksik müşteri bilgisi' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })
    let uploadedMediaId = null
    let uploadedMediaUrl = null

    // Dosya varsa Media koleksiyonuna yükle
    if (file && file.size > 0) {
      // Güvenlik: Dosya türü ve boyutu doğrulaması
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ success: false, error: 'Sadece görsel dosyaları (.jpg, .png, .webp) yüklenebilir.' }, { status: 400 })
      }
      
      const maxSize = 5 * 1024 * 1024; // 5 MB
      if (file.size > maxSize) {
        return NextResponse.json({ success: false, error: 'Görsel boyutu maksimum 5MB olmalıdır.' }, { status: 400 })
      }

      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      const media = await payload.create({
        collection: 'media',
        data: {
          alt: `${customerName} - Referans Görseli`
        },
        file: {
          data: buffer,
          name: file.name,
          mimetype: file.type,
          size: file.size,
        }
      })
      uploadedMediaId = media.id
      uploadedMediaUrl = media.url
    }

    // Seçilen değerleri CakeSize numarasına çevir (örneğin '6-8' -> 8)
    const sizeMatch = size ? size.match(/\d+/g) : null;
    const cakeSizeNum = sizeMatch ? parseInt(sizeMatch[sizeMatch.length - 1], 10) : 10;

    // Müşteri oturumu var mı kontrol et
    const session = await getServerSession(authOptions);
    let customerId = null;

    if (session?.user?.email) {
      const users = await payload.find({
        collection: 'customers',
        where: { email: { equals: session.user.email } }
      });
      if (users.docs.length > 0) {
        customerId = users.docs[0].id;
      }
    }

    // orders koleksiyonuna kaydet
    const customCake = await payload.create({
      collection: 'orders' as any,
      data: {
        orderType: 'custom',
        status: 'pending',
        paymentStatus: 'unpaid',
        totalAmount: 0, // Fiyat admin tarafından girilecek
        customer: customerId ? customerId : undefined,
        customerInfo: {
          firstName: customerName.split(' ')[0] || customerName,
          lastName: customerName.split(' ').slice(1).join(' ') || 'Belirtilmedi',
          email: customerEmail || 'belirtilmedi@dilim.com',
          phone: customerPhone,
          district: 'Belirtilmedi',
          address: customerAddress || 'Belirtilmedi',
        },
        customCakeDetails: {
          cakeSize: cakeSizeNum,
          spongeType: base.includes('cacao') ? 'kakaolu' : 'sade',
          creamFlavor: filling.includes('choco') ? 'cikolata' : (filling.includes('raspberry') ? 'meyveli' : 'vanilya'),
          referenceImage: uploadedMediaId,
          note: note || '',
        }
      }
    })

    try {
      await payload.sendEmail({
        to: 'siparis@dilim.com', // Değiştirilebilir
        from: 'sistem@dilim.com', // Değiştirilebilir
        subject: `Yeni Özel Pasta Tasarım Talebi: ${customerName}`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
            <h2 style="color: #FF8A00;">Yeni Özel Pasta Tasarımı (Talep No: ${customCake.id})</h2>
            <p>Sistem üzerinden yeni bir fiyat teklifi talebi oluşturuldu.</p>
            
            <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Müşteri Bilgileri</h3>
            <p><strong>Ad Soyad:</strong> ${customerName}</p>
            <p><strong>Telefon:</strong> ${customerPhone}</p>
            <p><strong>E-posta:</strong> ${customerEmail || 'Belirtilmedi'}</p>
            <p><strong>Adres:</strong> ${customerAddress}</p>
            
            <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Tasarım Detayları</h3>
            <p><strong>Boyut:</strong> ${size}</p>
            <p><strong>Kek:</strong> ${base}</p>
            <p><strong>İç Dolgu:</strong> ${filling}</p>
            <p><strong>Dış Kaplama:</strong> ${frosting}</p>
            <p><strong>Not:</strong> ${note || 'Yok'}</p>
            
            <p style="margin-top: 20px;">
              <a href="${req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/collections/orders/${customCake.id}" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Siparişlerde Görüntüle</a>
            </p>
          </div>
        `
      })
    } catch (emailErr) {
      console.log('E-posta gönderimi başarısız (SMTP ayarı eksik olabilir):', emailErr)
    }

    return NextResponse.json({ 
      success: true, 
      id: customCake.id,
      mediaUrl: uploadedMediaUrl,
      message: 'Tasarım başarıyla kaydedildi'
    })

  } catch (error: any) {
    console.error('Custom Cake error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
