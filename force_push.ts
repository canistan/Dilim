import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'

async function run() {
  const payload = await getPayload({ config: configPromise })
  console.log('Pushing schema to DB without prompts...')
  
  // Drizzle adapter has a schema push function we can potentially trigger, or we just let getPayload do it.
  // Wait, if PAYLOAD_DROP_DATABASE is true, it drops. If we just connect, payload automatically pushes if we set it.
  // Actually, Drizzle adapter prompts on data loss. 
  process.exit(0)
}

run().catch(console.error)
