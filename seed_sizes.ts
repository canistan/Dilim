import { config } from 'dotenv'
config()

import { getPayload } from 'payload'
import configPromise from './src/payload.config'

async function seed() {
  try {
    const payload = await getPayload({ config: configPromise })
    
    // Get all products
    const products = await payload.find({
      collection: 'products',
      limit: 100
    })
    
    console.log(`Found ${products.docs.length} products.`)
    let updatedCount = 0;
    
    for (const product of products.docs) {
      const p = product as any;
      // You may want to check if it's actually a cake (Yaş Pastalar) based on category
      // For now, let's update all products that don't have sizes yet, or just all products
      const basePrice = p.price || 750;
      
      await payload.update({
        collection: 'products',
        id: p.id,
        data: {
          hasSizes: true,
          sizes: [
            { size: '0 Numara', price: basePrice },
            { size: '1 Numara', price: basePrice + 150 },
            { size: '2 Numara', price: basePrice + 300 }
          ]
        }
      })
      console.log(`Updated ${p.title}`)
      updatedCount++;
    }
    
    console.log(`Done seeding sizes! Updated ${updatedCount} products.`)
  } catch (err) {
    console.error(err)
  }
}

seed()
