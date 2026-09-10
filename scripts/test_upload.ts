import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'
import https from 'https'
import fs from 'fs'
import path from 'path'
import os from 'os'

async function test() {
  const payload = await getPayload({ config: configPromise })
  const tmpPath = path.join(os.tmpdir(), 'test_image.jpg')
  
  await new Promise((resolve) => {
    https.get('https://loremflickr.com/400/400/cake?lock=999', (res) => {
      // follow redirect
      if (res.statusCode === 302 && res.headers.location) {
        https.get('https://loremflickr.com' + res.headers.location, (res2) => {
          const file = fs.createWriteStream(tmpPath)
          res2.pipe(file)
          file.on('finish', () => { file.close(); resolve(true) })
        })
      } else {
        const file = fs.createWriteStream(tmpPath)
        res.pipe(file)
        file.on('finish', () => { file.close(); resolve(true) })
      }
    })
  })

  console.log('File downloaded. Uploading to Payload...')
  const media = await payload.create({
    collection: 'media',
    data: { alt: 'test upload' },
    filePath: tmpPath
  })
  console.log('Uploaded Media:', media)
  process.exit(0)
}
test().catch(console.error)
