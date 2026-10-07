import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'

const run = async () => {
  const payload = await getPayload({ config: configPromise })

  const extrasCategories = await payload.find({
    collection: 'categories' as any,
    where: { 
      or: [
        { slug: { equals: 'ekstralar' } },
        { slug: { equals: 'hediyelik' } },
        { slug: { contains: 'hediye' } }
      ]
    },
    limit: 5,
  })
  
  let crossSellDocs: any[] = []
  if (extrasCategories.docs.length > 0) {
    const categoryIds = extrasCategories.docs.map((cat: any) => cat.id)
    const extrasRes = await payload.find({
      collection: 'products' as any,
      where: { category: { in: categoryIds } },
      limit: 15,
      depth: 2,
    })
    crossSellDocs = extrasRes.docs
  }

  const crossSellProducts = crossSellDocs.map((doc: any) => ({
    id: doc.id.toString(),
    name: doc.title,
    price: doc.price,
  }))

  console.log("Categories found:", extrasCategories.docs.map(c => c.title))
  console.log("Cross sells found:", crossSellProducts)
  process.exit(0)
}

run().catch(console.error)
