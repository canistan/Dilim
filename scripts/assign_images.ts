import { getPayload } from 'payload'
import configPromise from '@payload-config'

async function assignImages() {
  try {
    const payload = await getPayload({ config: configPromise })
    
    // Veritabanındaki ilk görseli bulalım
    const media = await payload.find({ collection: 'media', limit: 1 })
    
    if (media.docs.length === 0) {
      console.log("Medyada hiç görsel bulunamadı.")
      process.exit(0)
    }
    
    const mediaId = media.docs[0].id

    // Ürünleri bulup görselleri boş olanlara bu görseli atayalım
    const products = await payload.find({ collection: 'products', limit: 100 })
    
    for (const product of products.docs) {
      if (!product.images || product.images.length === 0) {
        await payload.update({
          collection: 'products',
          id: product.id,
          data: {
            images: [mediaId] // Örnek görseli ekle
          }
        })
      }
    }
    
    console.log("Tüm boş ürünlere örnek görsel atandı!")
    process.exit(0)
  } catch (err) {
    console.error('Hata:', err)
    process.exit(1)
  }
}

assignImages()
