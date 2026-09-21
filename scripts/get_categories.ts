import 'dotenv/config'
import payload from 'payload'
import config from '../src/payload.config'

const run = async () => {
  await payload.init({ config, local: true })

  const categories = await payload.find({
    collection: 'categories' as any,
    limit: 100,
  })

  categories.docs.forEach(c => {
    console.log(`Title: ${c.title} -> Slug: ${c.slug}`)
  })

  process.exit(0);
}

run();
