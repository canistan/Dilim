import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'
import fs from 'fs'
import path from 'path'

const run = async () => {
  const payload = await getPayload({ config: configPromise })
  
  const imgDir = path.join(process.cwd(), 'kategori-gorsel')
  const files = fs.readdirSync(imgDir).filter(f => !f.startsWith('.'))
  
  const categoriesRes = await payload.find({
    collection: 'categories',
    limit: 100
  })

  const map: Record<string, string> = {
    'börekler.png': 'Börekler',
    'kekler ve çörekler.png': 'Kekler ve Çörekler',
    'kiloluk ürünler.png': 'Kiloluk Ürünler',
    'paket ürünler.png': 'Paket Ürünler',
    'tatlilar.png': 'Tatlılar'
  }

  for (const file of files) {
    const filePath = path.join(imgDir, file)
    const targetTitle = map[file]
    if (!targetTitle) {
      console.log(`Skipping ${file} (already uploaded or not in map)`)
      continue
    }

    const category = categoriesRes.docs.find(c => c.title === targetTitle)

    console.log(`Uploading ${file} for category ${category.title}...`)
    
    // Read file buffer
    const fileBuffer = fs.readFileSync(filePath)
    const size = fs.statSync(filePath).size
    
    // Determine mime
    let mimetype = 'image/png'
    if (file.endsWith('.jpg') || file.endsWith('.jpeg')) mimetype = 'image/jpeg'
    if (file.endsWith('.webp')) mimetype = 'image/webp'

    // Format safe name (Vercel Blob prefers clean names)
    const safeName = `cat_${category.id}_${Date.now()}.png`

    try {
      // Create media
      const media = await payload.create({
        collection: 'media',
        data: {
          alt: `${category.title} Görseli`
        },
        file: {
          data: fileBuffer,
          mimetype,
          name: safeName,
          size
        }
      })

      // Update category
      await payload.update({
        collection: 'categories',
        id: category.id,
        data: {
          image: media.id
        }
      })
      console.log(`Successfully uploaded and linked ${file} to ${category.title}`)
    } catch (err) {
      console.error(`Error uploading ${file}:`, err)
    }
  }

  process.exit(0)
}

run().catch(console.error)
