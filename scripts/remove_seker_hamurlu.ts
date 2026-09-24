import 'dotenv/config'
import payload from 'payload'
import config from '../src/payload.config'

const run = async () => {
  await payload.init({
    config,
    local: true,
  })

  const products = await payload.find({
    collection: 'products',
    limit: 1000,
  })

  let count = 0
  for (const p of products.docs) {
    if (p.title.toLowerCase().includes('şeker hamur')) {
      await payload.update({
        collection: 'products',
        id: p.id,
        data: { isActive: 'passive' }
      })
      console.log(`[GİZLENDİ] ${p.title}`)
      count++
    }
  }
  console.log(`Toplam ${count} adet şeker hamurlu ürün pasife alındı.`)
  process.exit(0)
}

run()
