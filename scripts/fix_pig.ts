import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'
import path from 'path'
import fs from 'fs'

async function fix() {
  const payload = await getPayload({ config: configPromise })
  const mediaDocs = await payload.find({ collection: 'media', limit: 1000 })
  
  const safeImages = [
    path.join(process.cwd(), 'public', 'detay_pasta_1.png'),
    path.join(process.cwd(), 'public', 'detay_pasta_2.png'),
    path.join(process.cwd(), 'public', 'detay_pasta_3.png'),
    path.join(process.cwd(), 'public', 'urunler_yas_pasta.png'),
    path.join(process.cwd(), 'public', 'hakkimizda_chef.png'),
    path.join(process.cwd(), 'public', 'hakkimizda_cikolata.png')
  ]
  
  let i = 0;
  for (const doc of mediaDocs.docs) {
    if (doc.filename && (doc.filename as string).startsWith('temp_') && doc.alt?.includes('Instagram Post')) {
      console.log(`Fixing ${doc.alt} (${doc.filename})...`)
      try {
        await payload.update({
          collection: 'media',
          id: doc.id,
          filePath: safeImages[i % safeImages.length],
          overwriteExistingFiles: true
        })
        console.log(`Fixed!`)
        i++;
      } catch(e) {
        console.error('Error fixing:', e)
      }
    }
  }
  
  console.log('Bitti!')
  process.exit(0)
}

fix().catch(console.error)
