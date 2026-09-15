import { getPayload } from 'payload'
import configPromise from '../src/payload.config'
import * as dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const imagesToUpload = [
  { name: 'ACIBADEM BUYUK ADET', file: '/Users/canalbayrak/.gemini/antigravity-ide/brain/76fa3896-6a20-43d7-8c7d-f460f3e508a3/acibadem_buyuk_1789436029022.jpg' },
  { name: 'ACIBADEM KÜÇÜK', file: '/Users/canalbayrak/.gemini/antigravity-ide/brain/76fa3896-6a20-43d7-8c7d-f460f3e508a3/acibadem_kucuk_1789436038949.jpg' },
  { name: 'ALTIN VE GÜMÜŞ DRAJE', file: '/Users/canalbayrak/.gemini/antigravity-ide/brain/76fa3896-6a20-43d7-8c7d-f460f3e508a3/draje_altin_gumus_1789436049463.jpg' },
  { name: 'ANASONLU GALET', file: '/Users/canalbayrak/.gemini/antigravity-ide/brain/76fa3896-6a20-43d7-8c7d-f460f3e508a3/anasonlu_galet_1789436059329.jpg' },
  { name: 'ANASONLU GEVREK', file: '/Users/canalbayrak/.gemini/antigravity-ide/brain/76fa3896-6a20-43d7-8c7d-f460f3e508a3/anasonlu_gevrek_1789436068724.jpg' },
  { name: 'AY ÇÖREĞİ', file: '/Users/canalbayrak/.gemini/antigravity-ide/brain/76fa3896-6a20-43d7-8c7d-f460f3e508a3/ay_coregi_1789436077842.jpg' },
  { name: 'BATONSALE', file: '/Users/canalbayrak/.gemini/antigravity-ide/brain/76fa3896-6a20-43d7-8c7d-f460f3e508a3/batonsale_1789436144897.jpg' },
  { name: 'BEZE', file: '/Users/canalbayrak/.gemini/antigravity-ide/brain/76fa3896-6a20-43d7-8c7d-f460f3e508a3/beze_1789436154465.jpg' },
  { name: 'BİSKOTTİ', file: '/Users/canalbayrak/.gemini/antigravity-ide/brain/76fa3896-6a20-43d7-8c7d-f460f3e508a3/biskotti_1789436163112.jpg' },
  { name: 'BÜYÜK PİZZA', file: '/Users/canalbayrak/.gemini/antigravity-ide/brain/76fa3896-6a20-43d7-8c7d-f460f3e508a3/buyuk_pizza_1789436172218.jpg' }
]

async function run() {
  const payload = await getPayload({ config: configPromise })

  for (const img of imagesToUpload) {
    if (!fs.existsSync(img.file)) {
      console.log(`File not found: ${img.file}`);
      continue;
    }

    // Since I renamed "ACIBADEM BUYUK ADET" to "ACIBADEM BÜYÜK", I need to search correctly
    const searchName = img.name === 'ACIBADEM BUYUK ADET' ? 'ACIBADEM BÜYÜK' : img.name;

    const fileBuffer = fs.readFileSync(img.file);
    const fileName = path.basename(img.file);
    const fileSize = fs.statSync(img.file).size;

    const mediaDoc = await payload.create({
      collection: 'media',
      data: {
        alt: searchName,
      },
      file: {
        data: fileBuffer,
        name: fileName,
        mimetype: 'image/jpeg',
        size: fileSize
      }
    });

    console.log(`Uploaded media for ${searchName}: ID ${mediaDoc.id}`);

    const products = await payload.find({
      collection: 'products',
      where: {
        title: { equals: searchName }
      },
      limit: 1
    });

    if (products.docs.length > 0) {
      const product = products.docs[0];
      
      await payload.update({
        collection: 'products',
        id: product.id,
        data: {
          images: [mediaDoc.id]
        }
      });
      
      console.log(`Attached image to product: ${searchName}`);
    } else {
      console.log(`Product not found in DB: ${searchName}`);
    }
  }

  process.exit(0);
}

run().catch(console.error);
