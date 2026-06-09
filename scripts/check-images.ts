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
    where: {
      title: {
        equals: customCakes.docs[0]?.title
      }
    }
  })

  console.log('Custom Cake 0:', JSON.stringify(customCakes.docs[0], null, 2))
  console.log('Product matched:', JSON.stringify(products.docs[0], null, 2))
  
  process.exit(0)
}

run().catch(console.error)
