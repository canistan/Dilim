import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'
import fs from 'fs'
import path from 'path'
import os from 'os'
import https from 'https'

const downloadImage = (url: string, dest: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 308) {
        let redirectUrl = res.headers.location
        if (redirectUrl && !redirectUrl.startsWith('http')) {
          redirectUrl = new URL(redirectUrl, url).toString()
        }
        https.get(redirectUrl!, (res2) => {
          const file = fs.createWriteStream(dest)
          res2.pipe(file)
          file.on('finish', () => { file.close(); resolve() })
        }).on('error', reject)
      } else if (res.statusCode === 200) {
        const file = fs.createWriteStream(dest)
        res.pipe(file)
        file.on('finish', () => { file.close(); resolve() })
      } else {
        reject(new Error(`Failed to download, status: ${res.statusCode}`))
      }
    }).on('error', reject)
  })
}

async function run() {
  const payload = await getPayload({ config: configPromise })
  const mediaDocs = await payload.find({ collection: 'media', limit: 1000 })
  
  console.log(`Toplam ${mediaDocs.docs.length} medya belgesi bulundu. Yeniden yükleniyor...`)
  
  for (const doc of mediaDocs.docs) {
    const filename = doc.filename as string || ''
    const alt = (doc.alt || '').toLowerCase()
    const baseName = filename.replace(/\.webp$/, '')
    
    // Olası lokal dosyaları arayalım
    const possiblePaths = [
      path.join(process.cwd(), 'public', baseName + '.png'),
      path.join(process.cwd(), 'public', baseName + '.jpg'),
      path.join(process.cwd(), 'public', baseName + '.jpeg'),
      path.join(process.cwd(), baseName + '.jpg'),
      path.join(process.cwd(), baseName + '.png'),
      path.join(process.cwd(), baseName + '.jpeg'),
    ]
    
    // Blog resimleri bazen -1, -2 gibi son eklere sahip olabiliyor
    const cleanBaseName = baseName.replace(/-\d+$/, '')
    possiblePaths.push(path.join(process.cwd(), cleanBaseName + '.jpg'))
    possiblePaths.push(path.join(process.cwd(), cleanBaseName + '.png'))
    
    let localFile = ''
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        localFile = p
        break
      }
    }
    
    if (localFile) {
      console.log(`Lokal dosya bulundu: ${localFile} -> ${filename} için güncelleniyor...`)
      try {
        await payload.update({
          collection: 'media',
          id: doc.id,
          data: { alt: doc.alt }, // Sadece trigger update
          filePath: localFile,
          overwriteExistingFiles: true
        })
      } catch(e) {
        console.error(`Hata oluştu (${filename}):`, e)
      }
    } else {
      console.log(`Eksik dosya: ${filename}. Yapay/Yeni görsel indiriliyor...`)
      
      let keyword = 'pastry'
      if (alt.includes('çikolata') || filename.includes('cikolata')) keyword = 'chocolate'
      if (alt.includes('doğum') || filename.includes('dogum')) keyword = 'birthday,cake'
      if (alt.includes('kahvaltı') || filename.includes('kahvalti')) keyword = 'breakfast'
      if (alt.includes('kahve') || filename.includes('kahve')) keyword = 'coffee,dessert'
      if (alt.includes('makaron') || filename.includes('makaron')) keyword = 'macaron'
      if (alt.includes('börek') || filename.includes('borek')) keyword = 'pastry,food'
      if (alt.includes('pasta') || filename.includes('pasta')) keyword = 'cake,bakery'
      if (alt.includes('şef') || filename.includes('chef') || filename.includes('sahin')) keyword = 'chef,baker'
      if (filename.includes('cover_')) keyword = filename.replace('cover_', '').replace('.webp', '').replace(/-/g, ',')
      
      const imgUrl = `https://loremflickr.com/1080/1080/${keyword}?lock=${doc.id}`
      const tmpPath = path.join(os.tmpdir(), `temp_${doc.id}.jpg`)
      
      try {
        await downloadImage(imgUrl, tmpPath)
        await payload.update({
          collection: 'media',
          id: doc.id,
          data: { alt: doc.alt },
          filePath: tmpPath,
          overwriteExistingFiles: true
        })
        fs.unlinkSync(tmpPath)
        console.log(`Yeni görsel yüklendi: ${filename} (${keyword})`)
      } catch(e) {
        console.error(`Yeni görsel yüklenemedi: ${filename}`, e)
      }
    }
  }
  
  console.log('Tüm medya başarıyla yeniden yüklendi ve WebP olarak optimize edildi!')
  process.exit(0)
}

run().catch(console.error)
