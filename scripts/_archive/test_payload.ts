import payload from 'payload'
import configPromise from './payload.config'

async function run() {
  await payload.init({ config: configPromise, local: true })
  console.log('Payload connected successfully.')
  process.exit(0)
}

run().catch(console.error)
