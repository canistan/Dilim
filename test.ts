import { getPayload } from 'payload'
import configPromise from './src/payload.config.ts'

async function run() {
  try {
    const payload = await getPayload({ config: configPromise })
    
    console.log('Payload initialized. Creating user...')
    
    const newUser = await payload.create({
      collection: 'customers',
      data: {
        name: 'Test',
        surname: 'Test',
        email: 'test-12345@test.com',
        phone: '12345678',
        password: 'password',
        provider: 'credentials',
      },
    })
    
    console.log('User created:', newUser)
    
  } catch (error) {
    console.error('Payload error:', error)
    if (error.data) {
      console.error('Validation errors:', JSON.stringify(error.data.errors, null, 2))
    }
  }
  process.exit(0)
}

run()
