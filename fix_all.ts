import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'
import path from 'path'
import fs from 'fs'

async function fix() {
  const payload = await getPayload({ config: configPromise })
  const mediaDocs = await payload.find({ collection: 'media', limit: 1000 })
  
  const safeImages = [
    path.join(process.cwd(), 'public', 'urunler_yas_pasta.png'),
    path.join(process.cwd(), 'public', 'detay_pasta_1.png'),
    path.join(process.cwd(), 'public', 'detay_pasta_2.png'),
    path.join(process.cwd(), 'public', 'detay_pasta_3.png'),
    path.join(process.cwd(), 'public', 'hakkimizda_cikolata.png')
  ]
  
  let i = 0;
  let count = 0;
  for (const doc of mediaDocs.docs) {
    if (doc.filename && (doc.filename as string).includes('temp_')) {
      console.log(`Fixing ${doc.alt} (${doc.filename})...`)
      try {
        await payload.update({
          collection: 'media',
          id: doc.id,
          data: { alt: doc.alt || 'Görsel' }, // Added data field to satisfy validation
          filePath: safeImages[i % safeImages.length],
          overwriteExistingFiles: true
        })
        console.log(`Fixed!`)
        i++;
        count++;
      } catch(e) {
        console.error('Error fixing:', e)
      }
    }
  }
  
  console.log(`Toplam ${count} hatalı görsel güvenli yerel görsellerle değiştirildi!`)
  process.exit(0)
}

fix().catch(console.error)
