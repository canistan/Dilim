import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'

async function checkMedia() {
  const payload = await getPayload({ config: configPromise })
  const media = await payload.find({ collection: 'media', limit: 100 })
  console.log(`Bulunan Medya Sayısı: ${media.docs.length}`)
  media.docs.forEach(m => {
    console.log(`ID: ${m.id}, URL: ${m.url}, Alt: ${m.alt}, Filename: ${m.filename}`)
  })
  process.exit(0)
}

checkMedia().catch(console.error)
