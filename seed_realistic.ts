import { getPayload } from 'payload'
import configPromise from '@payload-config'
import fs from 'fs'
import path from 'path'
import { pipeline } from 'stream/promises'
import fetch from 'node-fetch'

const CAKE_IMAGES = [
  '1578985545045-818fce961421',
  '1550617931-e17a762022d1',
  '1551024601-bec78aea704b',
  '1606313564200-e75d5e30476c',
  '1587668178277-295251f900ce',
  '1535141192574-5d4897c19ecf',
]

async function downloadImage(id: string, index: number): Promise<string> {
  const url = `https://images.unsplash.com/photo-${id}?w=800&q=80`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch ${url}`)
  
  const tempPath = path.join('/tmp', `cake_${index}.jpg`)
  await pipeline(response.body as any, fs.createWriteStream(tempPath))
  return tempPath
}

async function seed() {
  console.log("Seeding process started...")
  try {
    const payload = await getPayload({ config: configPromise })
    
    // 1. Download and create Media items
    console.log("Downloading high-quality cake images...")
    const mediaIds = []
    for (let i = 0; i < CAKE_IMAGES.length; i++) {
      try {
        const filePath = await downloadImage(CAKE_IMAGES[i], i)
        
        // Check if a media with this name already exists to avoid duplicates
        const existing = await payload.find({
          collection: 'media',
          where: { filename: { equals: `cake_${i}.jpg` } },
        })
        
        if (existing.docs.length > 0) {
          mediaIds.push(existing.docs[0].id)
        } else {
          const mediaDoc = await payload.create({
            collection: 'media',
            data: { alt: `Premium Pasta ${i}` },
            filePath: filePath,
          })
          mediaIds.push(mediaDoc.id)
        }
      } catch (e) {
        console.error(`Error downloading image ${i}:`, e)
      }
    }

    if (mediaIds.length === 0) {
      throw new Error("No media could be downloaded. Aborting.")
    }
    console.log(`${mediaIds.length} media items ready.`)

    // 2. Update Products
    const products = await payload.find({ collection: 'products', limit: 100 })
    for (let i = 0; i < products.docs.length; i++) {
      const product = products.docs[i]
      const randomMediaId = mediaIds[i % mediaIds.length]
      
      const metaTitle = `${product.title} Siparişi - Dilim Pastaneleri`
      const metaDesc = `${product.title} en taze malzemelerle günlük olarak hazırlanır. Hemen online sipariş verin, kapınıza gelsin!`
      
      await payload.update({
        collection: 'products',
        id: product.id,
        data: {
          images: [randomMediaId],
          description: `${product.title} ürünümüz, usta şeflerimizin özenle seçtiği malzemelerle günlük olarak hazırlanır. Özel günlerinizi veya günlük kahve keyfinizi taçlandırmak için mükemmel bir seçimdir.`,
          meta: {
            title: metaTitle,
            description: metaDesc,
            image: randomMediaId,
          }
        }
      })
    }
    console.log(`Updated ${products.docs.length} products with realistic data and SEO.`)

    // 3. Create Custom Cakes (Özel Pastalar)
    const existingCakes = await payload.find({ collection: 'custom-cakes', limit: 10 })
    if (existingCakes.docs.length === 0) {
      await payload.create({
        collection: 'custom-cakes',
        data: {
          title: 'Düğün Pastası (Özel Tasarım)',
          image: mediaIds[0],
          meta: {
            title: 'Özel Tasarım Düğün Pastaları - Dilim Pastaneleri',
            description: 'En özel gününüz için hayalinizdeki düğün pastasını tasarlayalım.',
          }
        }
      })
      await payload.create({
        collection: 'custom-cakes',
        data: {
          title: 'Çocuk Doğum Günü Pastası',
          image: mediaIds[1],
          meta: {
            title: 'Çocuk Doğum Günü Pastaları - Dilim',
            description: 'Çocuklarınızın en sevdiği kahramanları pastalarına taşıyoruz.',
          }
        }
      })
      console.log("Created custom cakes.")
    }

    console.log("Seeding complete! System is fully realistic and SEO-ready.")
    process.exit(0)
  } catch (err) {
    console.error('Fatal Error:', err)
    process.exit(1)
  }
}

seed()
