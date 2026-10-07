import { getPayload } from 'payload'
import configPromise from '../src/payload.config'

async function run() {
  const payload = await getPayload({ config: configPromise })
  
  const customCakes = await payload.find({
    collection: 'custom-cakes',
    limit: 5,
  })
  
  const products = await payload.find({
    collection: 'products',
    limit: 5,
  })

  console.log('Custom Cakes Titles: ', customCakes.docs.map(c => c.title))
  console.log('Products Sample: ', products.docs.map(p => ({ title: p.title, images: p.images })))
  
  process.exit(0)
}

run().catch(console.error)
