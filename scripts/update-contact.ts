import { getPayload } from 'payload'
import configPromise from '../src/payload.config'

async function updateContact() {
  try {
    const payload = await getPayload({ config: configPromise })
    await payload.updateGlobal({
      slug: 'contact-settings',
      data: {
        phone: '+90 505 963 80 21',
      },
    })
    console.log('Contact phone updated successfully')
  } catch (error) {
    console.error('Failed to update contact phone:', error)
  }
}

updateContact()
