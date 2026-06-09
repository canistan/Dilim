import { getPayload } from 'payload'
import configPromise from '../src/payload.config'

async function run() {
  const payload = await getPayload({ config: configPromise })
  
  const customCakes = await payload.find({
    collection: 'custom-cakes',
    limit: 100,
  })
  
  const products = await payload.find({
    collection: 'products',
    limit: 1000,
  })

  let fixedCount = 0;

  for (const cake of customCakes.docs) {
    const matchedProduct = products.docs.find(p => p.title === cake.title);
    if (matchedProduct && matchedProduct.images && matchedProduct.images.length > 0) {
      await payload.update({
        collection: 'custom-cakes',
        id: cake.id,
        data: {
          image: typeof matchedProduct.images[0] === 'object' ? matchedProduct.images[0].id : matchedProduct.images[0]
        }
      })
      fixedCount++;
      console.log(`Fixed image for: ${cake.title}`)
    }
  }

  console.log(`Finished fixing ${fixedCount} custom cakes.`)
  process.exit(0)
}

run().catch(console.error)
