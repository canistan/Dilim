import { getPayload } from 'payload'
import configPromise from '../src/payload.config'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

async function run() {
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'categories',
    limit: 100,
  })

  console.log('--- DB CATEGORIES ---')
  for (const cat of categories.docs) {
    console.log(cat.title)
  }

  process.exit(0);
}

run().catch(console.error);
