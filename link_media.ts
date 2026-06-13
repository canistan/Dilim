import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'

const run = async () => {
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({ collection: 'categories', limit: 100 })
  const medias = await payload.find({ collection: 'media', limit: 1000 })

  for (const cat of categories.docs) {
    // Find the media that has alt matching this category's title
    const altText = `${cat.title} Görseli`
    const media = medias.docs.find(m => m.alt === altText)

    if (media) {
      await payload.update({
        collection: 'categories',
        id: cat.id,
        data: {
          image: media.id
        }
      })
      console.log(`Linked ${cat.title} to media ${media.id}`)
    } else {
      console.log(`No media found for ${cat.title}`)
    }
  }

  process.exit(0)
}

run().catch(console.error)
