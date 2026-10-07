import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'

const run = async () => {
  const payload = await getPayload({ config: configPromise })

  // 1. Get all media that starts with temp_
  const mediaResult = await payload.find({
    collection: 'media',
    where: {
      filename: {
        like: 'temp_%'
      }
    },
    limit: 1000
  })

  console.log(`Found ${mediaResult.totalDocs} temp media files.`)

  // 2. Remove references from Products
  const products = await payload.find({
    collection: 'products',
    limit: 1000
  })

  let productsUpdated = 0
  for (const product of products.docs) {
    if (product.image && typeof product.image === 'object' && product.image.filename?.startsWith('temp_')) {
      await payload.update({
        collection: 'products',
        id: product.id,
        data: {
          image: null as any
        }
      })
      productsUpdated++
    } else if (typeof product.image === 'string') {
      // It might be an ID. Check if it's in our media to delete.
      const isTemp = mediaResult.docs.find(m => m.id === product.image)
      if (isTemp) {
        await payload.update({
          collection: 'products',
          id: product.id,
          data: {
            image: null as any
          }
        })
        productsUpdated++
      }
    }
  }
  console.log(`Cleared image references from ${productsUpdated} products.`)

  // 3. Remove references from Categories
  const categories = await payload.find({
    collection: 'categories',
    limit: 1000
  })

  let categoriesUpdated = 0
  for (const category of categories.docs) {
    if (category.image && typeof category.image === 'object' && category.image.filename?.startsWith('temp_')) {
      await payload.update({
        collection: 'categories',
        id: category.id,
        data: {
          image: null as any
        }
      })
      categoriesUpdated++
    } else if (typeof category.image === 'string') {
      const isTemp = mediaResult.docs.find(m => m.id === category.image)
      if (isTemp) {
        await payload.update({
          collection: 'categories',
          id: category.id,
          data: {
            image: null as any
          }
        })
        categoriesUpdated++
      }
    }
  }
  console.log(`Cleared image references from ${categoriesUpdated} categories.`)

  // 3.5 Remove references from Instagram Feed (Global)
  try {
    const instagramConfig = await payload.findGlobal({ slug: 'instagram-feed' })
    if (instagramConfig && instagramConfig.posts && Array.isArray(instagramConfig.posts)) {
      const originalLength = instagramConfig.posts.length
      const filteredPosts = instagramConfig.posts.filter((post: any) => {
        if (typeof post.image === 'object' && post.image?.filename?.startsWith('temp_')) return false
        if (typeof post.image === 'string' && mediaResult.docs.find(m => m.id === post.image)) return false
        return true
      })
      if (filteredPosts.length !== originalLength) {
        await payload.updateGlobal({
          slug: 'instagram-feed',
          data: {
            posts: filteredPosts
          }
        })
        console.log(`Removed ${originalLength - filteredPosts.length} temp images from Instagram Feed.`)
      }
    }
  } catch (err) {
    console.log("Error clearing instagram feed:", err)
  }

  // 4. Delete the media files
  let mediaDeleted = 0
  for (const media of mediaResult.docs) {
    try {
      await payload.delete({
        collection: 'media',
        id: media.id
      })
      mediaDeleted++
    } catch (err) {
      console.log(`Could not delete media ${media.filename}:`, err)
    }
  }
  console.log(`Deleted ${mediaDeleted} temp media files completely.`)

  // 5. Output categories
  console.log("\n--- CATEGORIES LIST ---")
  for (const category of categories.docs) {
    console.log(`- ${category.title}`)
  }
  console.log("-----------------------")

  process.exit(0)
}

run().catch(console.error)
