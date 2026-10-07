import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'

const run = async () => {
  const payload = await getPayload({ config: configPromise })

  // Find the extras categories
  const categoriesRes = await payload.find({
    collection: 'categories',
    where: { 
      or: [
        { slug: { equals: 'ekstralar' } },
        { slug: { equals: 'hediyelik' } },
        { slug: { contains: 'hediye' } }
      ]
    },
    limit: 5,
  })

  let updateCount = 0;

  for (const cat of categoriesRes.docs) {
    if (!cat.image) continue;

    const mediaId = typeof cat.image === 'object' ? cat.image.id : cat.image;

    const productsRes = await payload.find({
      collection: 'products',
      where: { category: { equals: cat.id } },
      limit: 100,
    })

    for (const prod of productsRes.docs) {
      if (!prod.images || prod.images.length === 0) {
        await payload.update({
          collection: 'products',
          id: prod.id,
          data: {
            images: [mediaId]
          }
        })
        console.log(`Updated ${prod.title} with image ${mediaId} from category ${cat.title}`)
        updateCount++;
      }
    }
  }

  console.log(`Finished updating ${updateCount} products.`);
  process.exit(0)
}

run().catch(console.error)
