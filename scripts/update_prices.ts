import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './payload.config'
import fs from 'fs'

async function run() {
  const payload = await getPayload({ config: configPromise })
  const rawData = JSON.parse(fs.readFileSync('prices_dump.json', 'utf8'))
  
  // Extract all valid product - price pairs
  const pricesMap: { name: string, price: number, unit: string }[] = []
  
  for (const row of rawData) {
    // Check Col 0 & 3
    if (row['0'] && row['3'] && typeof row['3'] === 'number') {
      pricesMap.push({ name: String(row['0']).trim().toLowerCase(), price: row['3'], unit: String(row['2']).trim() })
    }
    // Check Col 5 & 7
    if (row['5'] && row['7'] && typeof row['7'] === 'number') {
      pricesMap.push({ name: String(row['5']).trim().toLowerCase(), price: row['7'], unit: String(row['6']).trim() })
    }
    // Check Col 9 & 11
    if (row['9'] && row['11'] && typeof row['11'] === 'number') {
      pricesMap.push({ name: String(row['9']).trim().toLowerCase(), price: row['11'], unit: String(row['10']).trim() })
    }
  }

  const products = await payload.find({ collection: 'products', limit: 1000 })
  let updatedCount = 0

  for (const product of products.docs) {
    const prodName = product.title.toLowerCase()
    
    // Find matching price
    // Some logic to match e.g. "Kıymalı Kol Böreği (Kg)" with "KIYMALI KOL BÖREĞİ"
    let match = pricesMap.find(p => {
      const pName = p.name.replace(/\s+/g, '').replace('ı','i').replace('ş','s').replace('ç','c').replace('ö','o').replace('ü','u').replace('ğ','g')
      const prodNameClean = prodName.replace(/\(.*\)/, '').replace(/\s+/g, '').replace('ı','i').replace('ş','s').replace('ç','c').replace('ö','o').replace('ü','u').replace('ğ','g')
      return pName === prodNameClean || pName.includes(prodNameClean) || prodNameClean.includes(pName)
    })
    
    if (match) {
      if (product.price !== match.price && !product.hasSizes) {
        console.log(`Güncelleniyor: ${product.title} (${product.price} -> ${match.price})`)
        await payload.update({
          collection: 'products',
          id: product.id,
          data: { price: match.price }
        })
        updatedCount++
      }
    } else {
      console.log(`Eşleşme bulunamadı: ${product.title}`)
    }
  }
  
  console.log(`Toplam ${updatedCount} ürün fiyatı güncellendi.`)
  process.exit(0)
}

run().catch(console.error)
