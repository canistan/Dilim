import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'
import os from 'os'

const batch = [
  { title: "KROKANLI PASTA", source: "/Users/canalbayrak/.gemini/antigravity-ide/brain/cc770cfb-3a6c-4e65-8608-dfae56a1a155/krokanli_pasta_1789135350919.jpg" },
  { title: "MUZLU PASTA", source: "/Users/canalbayrak/.gemini/antigravity-ide/brain/cc770cfb-3a6c-4e65-8608-dfae56a1a155/muzlu_pasta_1789135362499.jpg" },
  { title: "ÇİLEKLİ PASTA", source: "/Users/canalbayrak/.gemini/antigravity-ide/brain/cc770cfb-3a6c-4e65-8608-dfae56a1a155/cilekli_pasta_new_1789135372407.jpg" },
  { title: "ÇİKOLATALI PASTA", source: "/Users/canalbayrak/.gemini/antigravity-ide/brain/cc770cfb-3a6c-4e65-8608-dfae56a1a155/cikolatali_pasta_1789135383333.jpg" },
  { title: "DUBAİ ÇİKOLATASI", source: "/Users/canalbayrak/.gemini/antigravity-ide/brain/cc770cfb-3a6c-4e65-8608-dfae56a1a155/dubai_cikolatasi_1789135395126.jpg" },
  { title: "CHEESECAKE(DİLİM)", source: "/Users/canalbayrak/.gemini/antigravity-ide/brain/cc770cfb-3a6c-4e65-8608-dfae56a1a155/cheesecake_dilim_1789135405900.jpg" },
  { title: "TRALİÇE", source: "/Users/canalbayrak/.gemini/antigravity-ide/brain/cc770cfb-3a6c-4e65-8608-dfae56a1a155/tralice_1789135423016.jpg" },
  { title: "MUZLU RULO", source: "/Users/canalbayrak/.gemini/antigravity-ide/brain/cc770cfb-3a6c-4e65-8608-dfae56a1a155/muzlu_rulo_1789135438366.jpg" }
]

async function run() {
  const payload = await getPayload({ config: configPromise })
  
  for (const item of batch) {
    console.log(`Processing ${item.title}...`)
    
    // Find product
    const products = await payload.find({
      collection: 'products',
      where: { title: { equals: item.title } },
      limit: 1
    })
    
    if (products.docs.length === 0) {
      console.log(`Product not found: ${item.title}`)
      continue
    }
    
    const product = products.docs[0]
    
    // Format image to 1000x1000 WEBP
    const webpFilename = `${item.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.webp`
    const webpPath = path.join(os.tmpdir(), webpFilename)
    
    await sharp(item.source)
      .resize(1000, 1000, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(webpPath)
      
    console.log(`Optimized ${item.title}, uploading...`)
    
    // Upload media
    const media = await payload.create({
      collection: 'media',
      data: { alt: item.title },
      filePath: webpPath
    })
    
    // Update product
    await payload.update({
      collection: 'products',
      id: product.id,
      data: { images: [media.id] }
    })
    
    console.log(`Successfully uploaded and linked ${item.title}`)
  }
  
  console.log('Batch completed!')
  process.exit(0)
}

run().catch(console.error)
