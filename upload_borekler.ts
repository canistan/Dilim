import 'dotenv/config'
import payload from 'payload'
import configPromise from './payload.config'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const artifactsDir = '/Users/canalbayrak/.gemini/antigravity-ide/brain/e2b150c7-2a2c-484f-96fb-314dff780813'

// IDs mapped from DB query for "Börekler"
const imageMap = {
  'bosnak_boregi_1788428803296.jpg': 143,
  'kiymali_adana_boregi_1788428815715.jpg': 145,
  'peynirli_kol_boregi_1788428826227.jpg': 140,
  'mini_sigara_boregi_1788428838241.jpg': 146
}

async function run() {
  await payload.init({ config: configPromise, local: true })

  for (const [filename, productId] of Object.entries(imageMap)) {
    const inputPath = path.join(artifactsDir, filename)
    if (!fs.existsSync(inputPath)) {
      console.log('Skipping', filename, 'Not found')
      continue
    }

    const outputName = filename.replace('.jpg', '.webp')
    const outputPath = path.join('/tmp', outputName)

    // Convert to webp 800x800
    await sharp(inputPath)
      .resize(800, 800, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(outputPath)
      
    const buffer = fs.readFileSync(outputPath)
    
    // Create Media in Payload
    const media = await payload.create({
      collection: 'media',
      data: {
        alt: filename.split('_')[0],
      },
      file: {
        data: buffer,
        mimetype: 'image/webp',
        name: outputName,
        size: buffer.length
      }
    })

    console.log(`Uploaded media ${media.id} for ${filename}, size: ${buffer.length} bytes`)

    // Update product
    await payload.update({
      collection: 'products',
      id: productId,
      data: {
        images: [media.id]
      }
    })
    
    console.log(`Updated product ${productId}`)
  }

  console.log('All done!')
  process.exit(0)
}

run().catch(console.error)
