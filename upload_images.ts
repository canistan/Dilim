import 'dotenv/config'
import payload from 'payload'
import configPromise from './payload.config'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const artifactsDir = '/Users/canalbayrak/.gemini/antigravity-ide/brain/e2b150c7-2a2c-484f-96fb-314dff780813'

const imageMap = {
  'keskul_1788427223664.jpg': 200,
  'asure_1788427236203.jpg': 198,
  'kazandibi_1788427247100.jpg': 199,
  'magnolya_1788427271086.jpg': 206,
  'tavuk_gogsu_1788427313721.jpg': 205,
  'sutlac_1788427326397.jpg': 204,
  'supangle_1788427357103.jpg': 203,
  'meyveli_cam_kase_1788427367163.jpg': 201,
  'profiterol_1788427377441.jpg': 202
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
