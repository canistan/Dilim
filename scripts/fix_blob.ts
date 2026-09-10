import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'
import { put } from '@vercel/blob'
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
      const filename = doc.filename as string
      console.log(`Fixing Vercel Blob directly: ${filename}...`)
      try {
        const safeImagePath = safeImages[i % safeImages.length];
        const fileBuffer = fs.readFileSync(safeImagePath);
        
        // Vercel Blob'a doğrudan yükleyip üzerine yazıyoruz
        await put(filename, fileBuffer, {
          access: 'public',
          addRandomSuffix: false,
          allowOverwrite: true,
          token: process.env.BLOB_READ_WRITE_TOKEN
        })
        
        console.log(`Overwritten ${filename} on Vercel Blob!`)
        i++;
        count++;
      } catch(e) {
        console.error('Error fixing:', e)
      }
    }
  }
  
  console.log(`Toplam ${count} hatalı görsel Vercel Blob üzerinde doğrudan güvenli yerel görsellerle ezildi!`)
  process.exit(0)
}

fix().catch(console.error)
