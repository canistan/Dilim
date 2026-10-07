import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'
import fs from 'fs'

async function run() {
  const payload = await getPayload({ config: configPromise })
  console.log('Çikolata ve Lokumlar görseli yükleniyor...')

  const imagePath = '/Users/canalbayrak/.gemini/antigravity-ide/brain/19c77226-89db-4612-a33d-fd6890ebfb0a/cikolata_lokum_kapak_1781278018219.png'
  
  // 1. Yeni görseli payload'a yükle
  const media = await payload.create({
    collection: 'media',
    data: { alt: `Çikolata ve Lokumlar Kategori Görseli` },
    filePath: imagePath
  })
  const mediaId = media.id as number
  console.log(`Görsel başarıyla yüklendi. Media ID: ${mediaId}`)

  // 2. Çikolata ve Lokumlar kategorisini bul
  const categories = await payload.find({ 
    collection: 'categories', 
    where: { slug: { equals: 'cikolata-ve-lokumlar' } },
    limit: 1
  })

  if (categories.docs.length === 0) {
    console.log('Kategori bulunamadı!')
    process.exit(1)
  }

  const categoryId = categories.docs[0].id

  // 3. Bu kategoriye ait tüm ürünleri bul ve resmi ata
  console.log('Ürünlere yeni görsel atanıyor...')
  const products = await payload.find({ 
    collection: 'products',
    where: { category: { equals: categoryId } },
    limit: 1000 
  })

  let count = 0
  for (const p of products.docs) {
    await payload.update({
      collection: 'products',
      id: p.id,
      data: { images: [mediaId] }
    })
    count++
  }

  console.log(`Bitti! Toplam ${count} adet Çikolata ve Lokum ürününe yepyeni ve premium görsel atandı.`)
  process.exit(0)
}

run().catch(console.error)
