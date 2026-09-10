import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'
import https from 'https'
import fs from 'fs'
import path from 'path'
import os from 'os'

const CATEGORY_COVERS: Record<string, string> = {
  'borekler': 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=800&q=80',
  'kiloluk-urunler': 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=800&q=80',
  'paket-urunler': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80',
  'kekler-ve-corekler': 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=800&q=80',
  'tatlilar': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80',
  'pastalar': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
  'cikolata-ve-lokumlar': 'https://images.unsplash.com/photo-1548883354-94bcfe321cbb?w=800&q=80',
  'hediyelikler': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80'
}

const downloadImage = (url: string, dest: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: 10000 }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location!, { timeout: 10000 }, (res2) => {
          const file = fs.createWriteStream(dest)
          res2.pipe(file)
          file.on('finish', () => { file.close(); resolve() })
        }).on('error', reject)
      } else {
        const file = fs.createWriteStream(dest)
        res.pipe(file)
        file.on('finish', () => { file.close(); resolve() })
      }
    })
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')) })
    req.on('error', reject)
  })
}

async function run() {
  const payload = await getPayload({ config: configPromise })
  console.log('Kategori kapakları indiriliyor...')

  const categories = await payload.find({ collection: 'categories', limit: 100 })
  const categoryMediaMap: Record<string, number> = {}

  for (const cat of categories.docs) {
    const slug = cat.slug as string
    const imgUrl = CATEGORY_COVERS[slug] || CATEGORY_COVERS['pastalar']
    const tmpPath = path.join(os.tmpdir(), `cover_${slug}.jpg`)

    try {
      await downloadImage(imgUrl, tmpPath)
      const media = await payload.create({
        collection: 'media',
        data: { alt: `${cat.title} Kategori Görseli` },
        filePath: tmpPath
      })
      categoryMediaMap[String(cat.id)] = media.id as number
      fs.unlinkSync(tmpPath)
      console.log(`${cat.title} için kapak görseli yüklendi.`)
    } catch(err) {
      console.log(`${cat.title} için görsel yüklenemedi.`, err)
      // Fallback to existing media if it fails to download
      const existingMedia = await payload.find({ collection: 'media', limit: 1 })
      if (existingMedia.docs.length > 0) {
        categoryMediaMap[String(cat.id)] = existingMedia.docs[0].id as number
      }
    }
  }

  console.log('Kategori görselleri ürünlere atanıyor...')

  const products = await payload.find({ collection: 'products', limit: 1000 })
  let count = 0
  for (const p of products.docs) {
    const catId = typeof p.category === 'object' ? p.category?.id : p.category
    const mediaId = categoryMediaMap[String(catId)]
    
    if (mediaId) {
      await payload.update({
        collection: 'products',
        id: p.id,
        data: { images: [mediaId] }
      })
      count++
    }
  }

  console.log(`Bitti! Toplam ${count} ürüne kategori kapak görseli atandı.`)
  process.exit(0)
}

run().catch(console.error)
