import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })

    const cat1 = await payload.create({
      collection: 'categories' as any,
      data: { title: 'Kahveler', showInHome: true }
    })
    const cat2 = await payload.create({
      collection: 'categories' as any,
      data: { title: 'Dilim Pastalar', showInHome: true }
    })

    await payload.create({
      collection: 'products' as any,
      data: { title: 'Nitelikli Filtre Kahve', price: 90, category: cat1.id, description: 'Taze kavrulmuş, dengeli asiditeye sahip yöresel filtre kahve.', showInMenu: true, stock: 100 }
    })
    
    await payload.create({
      collection: 'products' as any,
      data: { title: 'Caffe Latte', price: 110, category: cat1.id, description: 'Özenle çekilmiş espresso ve ipeksi dokulu sütün mükemmel uyumu.', showInMenu: true, stock: 100 }
    })

    await payload.create({
      collection: 'products' as any,
      data: { title: 'San Sebastian Cheesecake', price: 195, category: cat2.id, description: 'Üzeri yanık, içi akışkan İspanyol klasiği. İsteğe bağlı çikolata sosuyla.', showInMenu: true, stock: 50 }
    })
    
    await payload.create({
      collection: 'products' as any,
      data: { title: 'Orman Meyveli Tart', price: 185, category: cat2.id, description: 'Taze orman meyveleri ve pastacı kreması ile hazırlanan enfes tart.', showInMenu: true, stock: 30 }
    })

    return NextResponse.json({ success: true, message: 'Örnek Kafé menüsü ürünleri başarıyla eklendi!' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message })
  }
}
