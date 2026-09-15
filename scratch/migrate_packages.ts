import { getPayload } from 'payload'
import configPromise from '../src/payload.config'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const packageProducts = [
  { name: 'ACIBADEM KÜÇÜK', adet: 350.00, kilo: 1750.00 },
  { name: 'ANASONLU GALET', adet: 235.00, kilo: 1175.00 },
  { name: 'ANASONLU GEVREK', adet: 235.00, kilo: 1175.00 },
  { name: 'BATONSALE', adet: 235.00, kilo: 1175.00 },
  { name: 'BEZE', adet: 235.00, kilo: 1175.00 },
  { name: 'BİSKOTTİ', adet: 325.00, kilo: 1625.00 },
  { name: 'ÇEKİRDEKLİ GALET', adet: 235.00, kilo: 1175.00 },
  { name: 'ÇEKİRDEKLİ YAPRAK GEVREK', adet: 235.00, kilo: 1175.00 },
  { name: 'GRİSSİNİ', adet: 200.00, kilo: 1000.00 },
  { name: 'JAPONEX', adet: 325.00, kilo: 1625.00 },
  { name: 'KAŞARLI GALET', adet: 325.00, kilo: 1625.00 },
  { name: 'KIRIKKIRAK', adet: 235.00, kilo: 1175.00 },
  { name: 'SELANİK GEVREĞİ', adet: 350.00, kilo: 1750.00 },
  { name: 'ZEYTİNLİ GEVREK', adet: 235.00, kilo: 1175.00 },
]

async function run() {
  const payload = await getPayload({ config: configPromise })

  const dbProductsReq = await payload.find({
    collection: 'products',
    limit: 1000,
  })
  
  const dbProducts = dbProductsReq.docs;

  // 1. Rename ACIBADEM BUYUK ADET
  const acibadem = dbProducts.find(p => p.title.toLowerCase() === 'acibadem buyuk adet')
  if (acibadem) {
    await payload.update({
      collection: 'products',
      id: acibadem.id,
      data: {
        title: 'ACIBADEM BÜYÜK',
        slug: 'acibadem-buyuk'
      }
    })
    console.log('Renamed ACIBADEM BUYUK ADET to ACIBADEM BÜYÜK')
  }

  // 2. Update Adet / Kilo products
  for (const pkg of packageProducts) {
    const product = dbProducts.find(p => p.title.toLowerCase() === pkg.name.toLowerCase())
    if (product) {
      await payload.update({
        collection: 'products',
        id: product.id,
        data: {
          hasSizes: true,
          price: 0, // Since it has sizes, base price is effectively ignored/0
          sizes: [
            { size: 'Paket' as any, price: pkg.adet },
            { size: '1 Kilogram' as any, price: pkg.kilo }
          ]
        }
      })
      console.log(`Updated ${pkg.name} to have Paket and 1 Kilogram options`)
    } else {
      console.log(`Could not find ${pkg.name} in DB`)
    }
  }

  console.log('Migration complete.')
  process.exit(0);
}

run().catch(console.error);
