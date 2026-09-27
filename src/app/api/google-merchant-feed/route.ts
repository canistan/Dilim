import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    
    // Aktif ürünleri çekiyoruz
    const products = await payload.find({
      collection: 'products',
      where: {
        isActive: { equals: 'active' },
      },
      limit: 1000,
    })

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dilim.com.tr'

    const itemsXml = products.docs.map((product) => {
      // Temel bilgiler
      const id = product.id
      const title = product.title || ''
      const description = product.description || title
      const link = `${baseUrl}/urunler/${product.slug}`
      
      // Fiyat hesaplama (Varyantlıysa en düşük veya ilk fiyatı alıyoruz)
      let price = 0
      if (product.hasSizes && product.sizes && product.sizes.length > 0) {
        price = product.sizes[0].price
      } else {
        price = product.price || 0
      }

      // Stok durumu hesaplama
      const availability = (product.stock ?? 0) > 0 ? 'in_stock' : 'out_of_stock'

      // Görsel linkini alma
      let imageLink = ''
      if (product.images && product.images.length > 0) {
        const media = product.images[0] as any 
        if (media && media.url) {
          imageLink = `${baseUrl}${media.url}`
        }
      }

      // Kategori hesaplama (Opsiyonel ama önerilir)
      const googleProductCategory = 'Food & Beverages > Bakery'

      return `
        <item>
          <g:id>${id}</g:id>
          <g:title><![CDATA[${title}]]></g:title>
          <g:description><![CDATA[${description}]]></g:description>
          <g:link>${link}</g:link>
          <g:image_link>${imageLink}</g:image_link>
          <g:condition>new</g:condition>
          <g:availability>${availability}</g:availability>
          <g:price>${price.toFixed(2)} TRY</g:price>
          <g:google_product_category><![CDATA[${googleProductCategory}]]></g:google_product_category>
        </item>
      `
    }).join('')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Dilim Pastaneleri</title>
    <link>${baseUrl}</link>
    <description>Dilim Pastaneleri Resmi Online Sipariş Mağazası</description>
    ${itemsXml}
  </channel>
</rss>`

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        // Cache ekleyebiliriz ki her saniye veritabanını yormasın (1 saat cache)
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    })
  } catch (error) {
    console.error('Google Merchant Feed error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
