import { getPayload } from 'payload'
import configPromise from './src/payload.config'

async function seed() {
  const payload = await getPayload({ config: configPromise })

  const slots = [
    { timeRange: '10:00 - 14:00', capacity: 10 },
    { timeRange: '14:00 - 18:00', capacity: 10 },
  ]

  for (const slot of slots) {
    const existing = await payload.find({
      collection: 'time-slots',
      where: { timeRange: { equals: slot.timeRange } },
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'time-slots',
        data: {
          timeRange: slot.timeRange,
          capacity: slot.capacity,
          isActive: true,
        },
      })
      console.log(`Created time slot: ${slot.timeRange}`)
    } else {
      console.log(`Time slot already exists: ${slot.timeRange}`)
    }
  }

  process.exit(0)
}

seed().catch(console.error)
