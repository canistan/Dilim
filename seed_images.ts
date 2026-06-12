import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'
import https from 'https'
import fs from 'fs'
import path from 'path'
import os from 'os'

const downloadImage = (url: string, dest: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        let redirectUrl = res.headers.location
        if (redirectUrl && !redirectUrl.startsWith('http')) {
          redirectUrl = new URL(redirectUrl, url).toString()
        }
        https.get(redirectUrl!, (res2) => {
          const file = fs.createWriteStream(dest)
          res2.pipe(file)
          file.on('finish', () => { file.close(); resolve() })
        }).on('error', reject)
      } else {
        const file = fs.createWriteStream(dest)
        res.pipe(file)
        file.on('finish', () => { file.close(); resolve() })
      }
    }).on('error', reject)
  })
}

async function fixImages() {
  const payload = await getPayload({ config: configPromise })
  console.log('Eksik ürün görselleri düzeltiliyor...')

  const products = await payload.find({ collection: 'products', limit: 1000 })
  let count = 0
  
  for (let i = 0; i < products.docs.length; i++) {
    const p = products.docs[i]
    if (!p.images || p.images.length === 0) {
      const lockId = 1000 + i // benzersiz kilit
      // Kelimeler: pastry, dessert, cake (rastgele atayalım biraz)
      const tags = ['pastry', 'dessert', 'cake', 'baklava', 'chocolate']
      const tag = tags[i % tags.length]
      
      const imgUrl = `https://loremflickr.com/600/600/${tag}?lock=${lockId}`
      const filename = `product_${p.id}_${Date.now()}.jpg`
      const tmpPath = path.join(os.tmpdir(), filename)

      try {
        await downloadImage(imgUrl, tmpPath)
        const media = await payload.create({
          collection: 'media',
          data: { alt: p.title },
          filePath: tmpPath
        })
        fs.unlinkSync(tmpPath)

        await payload.update({
          collection: 'products',
          id: p.id,
          data: { images: [media.id] }
        })
        
        console.log(`[${i+1}/${products.docs.length}] Resim eklendi: ${p.title} (${tag})`)
        count++
      } catch (err) {
        console.error(`Hata: ${p.title}`, err)
      }
    }
  }

  console.log(`Toplam ${count} ürüne görsel eklendi!`)
  process.exit(0)
}

fixImages().catch(console.error)
