import 'dotenv/config'
import payload from 'payload'
import config from '../src/payload.config'

// Same slugify logic as formatSlug.ts
const trMap: { [key: string]: string } = {
  'ç': 'c', 'Ç': 'c',
  'ğ': 'g', 'Ğ': 'g',
  'ı': 'i', 'I': 'i',
  'İ': 'i',
  'ö': 'o', 'Ö': 'o',
  'ş': 's', 'Ş': 's',
  'ü': 'u', 'Ü': 'u',
}

const slugify = (text: string): string => {
  let result = text
  for (const key in trMap) {
    result = result.split(key).join(trMap[key])
  }
  result = result.toLowerCase()
  result = result
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return result
}

const run = async () => {
  try {
    console.log('Payload başlatılıyor...')
    await payload.init({ config, local: true })

    // Fix product slugs
    console.log('\n=== ÜRÜN SLUG DÜZELTMESİ ===\n')
    const products = await payload.find({ collection: 'products', limit: 1000, depth: 0 })
    
    let fixedCount = 0
    for (const product of products.docs) {
      const correctSlug = slugify(product.title)
      const currentSlug = product.slug
      
      if (currentSlug !== correctSlug) {
        console.log(`[DÜZELT] "${product.title}"`)
        console.log(`  ESKİ:  ${currentSlug}`)
        console.log(`  YENİ:  ${correctSlug}`)
        
        await payload.update({
          collection: 'products',
          id: product.id,
          data: { slug: correctSlug }
        })
        console.log(`  ✓ Güncellendi!\n`)
        fixedCount++
      }
    }
    
    console.log(`\nÜrünler: ${fixedCount}/${products.totalDocs} slug düzeltildi.`)
    
    // Fix category slugs
    console.log('\n=== KATEGORİ SLUG DÜZELTMESİ ===\n')
    const categories = await payload.find({ collection: 'categories', limit: 100, depth: 0 })
    
    let catFixedCount = 0
    for (const cat of categories.docs) {
      const correctSlug = slugify(cat.title)
      const currentSlug = cat.slug
      
      if (currentSlug !== correctSlug) {
        console.log(`[DÜZELT] "${cat.title}"`)
        console.log(`  ESKİ:  ${currentSlug}`)
        console.log(`  YENİ:  ${correctSlug}`)
        
        await payload.update({
          collection: 'categories',
          id: cat.id,
          data: { slug: correctSlug }
        })
        console.log(`  ✓ Güncellendi!\n`)
        catFixedCount++
      }
    }
    
    console.log(`\nKategoriler: ${catFixedCount}/${categories.totalDocs} slug düzeltildi.`)
    console.log(`\nToplam ${fixedCount + catFixedCount} slug düzeltildi!`)
    
    process.exit(0)
  } catch (err) {
    console.error("Script Hatası:", err)
    process.exit(1)
  }
}

run()
