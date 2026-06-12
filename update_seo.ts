import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'

async function updateSEO() {
  const payload = await getPayload({ config: configPromise })
  console.log('SEO Güncellemesi Başlıyor...')

  // Kategorileri güncelle
  const categories = await payload.find({ collection: 'categories', limit: 1000 })
  for (const cat of categories.docs) {
    // Kategoriye ait ilk ürünün resmini meta image yapalım
    const firstProduct = await payload.find({
      collection: 'products',
      where: {
        category: { equals: cat.id }
      },
      limit: 1
    })

    let metaImage = undefined
    if (firstProduct.docs.length > 0 && firstProduct.docs[0].images && firstProduct.docs[0].images.length > 0) {
      metaImage = typeof firstProduct.docs[0].images[0] === 'object' ? firstProduct.docs[0].images[0].id : firstProduct.docs[0].images[0]
    }

    await payload.update({
      collection: 'categories',
      id: cat.id,
      data: {
        meta: {
          title: `Taptaze ${cat.title} Çeşitleri ve Fiyatları | Dilim Pastaneleri`,
          description: `En taze ve lezzetli ${cat.title.toLowerCase()} çeşitleri Dilim Pastaneleri'nde! Aynı gün kapınıza teslim fırsatıyla hemen online sipariş verin.`,
          image: metaImage
        }
      }
    })
    console.log(`[SEO] Kategori güncellendi: ${cat.title}`)
  }

  // Ürünleri güncelle
  const products = await payload.find({ collection: 'products', limit: 1000 })
  for (const p of products.docs) {
    let metaImage = undefined
    if (p.images && p.images.length > 0) {
      metaImage = typeof p.images[0] === 'object' ? p.images[0].id : p.images[0]
    }

    const priceText = p.hasSizes ? 'Size özel' : `${p.price}₺`

    await payload.update({
      collection: 'products',
      id: p.id,
      data: {
        meta: {
          title: `${p.title} Satın Al | Dilim Pastaneleri`,
          description: `Taptaze ${p.title} siparişi verin. ${priceText} fiyatıyla Dilim Pastaneleri'nde sizi bekliyor. Hemen sepete ekleyin.`,
          image: metaImage
        }
      }
    })
    console.log(`[SEO] Ürün güncellendi: ${p.title}`)
  }

  console.log('Tüm SEO alanları başarıyla otomatik dolduruldu!')
  process.exit(0)
}

updateSEO().catch(console.error)
