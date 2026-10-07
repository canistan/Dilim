import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../src/payload.config'

async function run() {
  const payload = await getPayload({ config: configPromise })
  
  const updates = [
    { title: "FISTIKLI BAKLAVA", newPrice: 2150 },
    { title: "SÜTLÜ NURİYE", newPrice: 1600 },
    { title: "ŞEKERPARE", newPrice: 950 },
    { title: "ŞÖBİYET", newPrice: 2200 }
  ]
  
  for (const update of updates) {
    const found = await payload.find({
      collection: 'products',
      where: {
        title: { equals: update.title }
      }
    })
    
    if (found.totalDocs > 0) {
      const doc = found.docs[0]
      await payload.update({
        collection: 'products',
        id: doc.id,
        data: { price: update.newPrice }
      })
      console.log(`Güncellendi: ${update.title} -> ${update.newPrice} TL`)
    } else {
      console.log(`Bulunamadı: ${update.title}`)
    }
  }
  
  console.log('Fiyat düzeltmeleri tamamlandı!')
  process.exit(0)
}

run().catch(console.error)
