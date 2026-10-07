import 'dotenv/config'
import payload from 'payload'
import config from '../src/payload.config'

const run = async () => {
  await payload.init({ config, local: true })
  const slots = await payload.find({ collection: 'time-slots' })
  console.log(slots.docs.map(s => ({ id: s.id, time: s.time })))
  process.exit(0)
}
run()
