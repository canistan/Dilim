import { getPayload } from 'payload'
import configPromise from '@payload-config'

async function run() {
  const payload = await getPayload({ config: configPromise })

  // 1. Fix havuc-dilimi slug
  console.log('Fetching havuc-dilimi products...')
  const havucRes = await payload.find({
    collection: 'products',
    where: { slug: { contains: 'havuc' } },
    limit: 10,
  })
  
  for (const doc of havucRes.docs) {
    if (doc.slug.includes('\n') || doc.slug.includes('\r')) {
      const newSlug = doc.slug.replace(/[\n\r]+/g, '')
      console.log(`Fixing slug for ${doc.title} from '${doc.slug}' to '${newSlug}'`)
      await payload.update({
        collection: 'products',
        id: doc.id,
        data: { slug: newSlug }
      })
    }
  }

  // 2. Fix 30 yillik seruven title in blog
  console.log('Fetching blog posts with 30 yillik...')
  const blogRes = await payload.find({
    collection: 'blog',
    where: { title: { contains: '30' } },
    limit: 10,
  })

  for (const doc of blogRes.docs) {
    if (doc.title.includes('30 Yıllık')) {
      const newTitle = doc.title.replace('30 Yıllık', '49 Yıllık')
      console.log(`Fixing blog title for ${doc.slug} to ${newTitle}`)
      await payload.update({
        collection: 'blog',
        id: doc.id,
        data: { title: newTitle }
      })
    }
  }

  // 3. Merge or fix birthday cake posts
  console.log('Fetching birthday cake posts...')
  const bdRes = await payload.find({
    collection: 'blog',
    where: { slug: { contains: 'dogum-gunu' } },
    limit: 10,
  })

  let foundToDraft = false;
  for (const doc of bdRes.docs) {
    if (doc.slug.includes('dikkat-edilmesi-gerekenler') || doc.slug.includes('nelere-dikkat-edilmeli')) {
      if (!foundToDraft && doc.slug === 'dogum-gunu-pastasi-secerken-nelere-dikkat-edilmeli') {
        console.log(`Drafting duplicate post: ${doc.slug}`)
        await payload.update({
          collection: 'blog',
          id: doc.id,
          data: { _status: 'draft' }
        })
        foundToDraft = true;
      }
    }
  }

  console.log('Done!')
  process.exit(0)
}

run().catch(console.error)
