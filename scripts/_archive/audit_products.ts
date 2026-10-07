import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import configPromise from '../src/payload.config'

function normalizeStr(s: string) {
  if (!s) return ''
  return s.trim().toLocaleLowerCase('tr-TR').replace(/\s+/g, ' ')
}

async function run() {
  const payload = await getPayload({ config: configPromise })
  
  // 1. Fetch all products from DB
  const productsResult = await payload.find({
    collection: 'products',
    limit: 2000,
    depth: 0
  })
  const dbProducts = productsResult.docs

  // 2. Load Excel Dump
  const excelDumpPath = path.join(process.cwd(), 'perfect_excel_dump.json')
  const excelItems = JSON.parse(fs.readFileSync(excelDumpPath, 'utf8'))

  const missingInDb: any[] = []
  const priceMismatches: any[] = []
  
  const ignoredNames = ["0 no'lu pastalar", "1 no'lu pastalar", "2 no'lu pastalar", "undefined"]
  
  for (const item of excelItems) {
    const itemName = normalizeStr(item.name)
    // skip numeric names which are trash
    if (!isNaN(Number(item.name))) continue;
    if (ignoredNames.includes(itemName)) continue;
    
    // Find in DB
    const dbMatch = dbProducts.find(p => normalizeStr(p.title) === itemName || normalizeStr(p.title).includes(itemName) || itemName.includes(normalizeStr(p.title)))
    
    if (!dbMatch) {
      missingInDb.push(item)
    } else {
      if (dbMatch.price !== item.price) {
        priceMismatches.push({
          name: item.name,
          excelPrice: item.price,
          dbPrice: dbMatch.price,
          dbId: dbMatch.id,
          dbTitle: dbMatch.title
        })
      }
    }
  }

  // 3. Check Images
  const missingImages = dbProducts.filter(p => !p.image).map(p => p.title)

  const results = {
    totalExcelItemsChecked: excelItems.length,
    totalDbProducts: dbProducts.length,
    missingInDbCount: missingInDb.length,
    missingInDbList: missingInDb.map(i => i.name),
    priceMismatchCount: priceMismatches.length,
    priceMismatchesList: priceMismatches,
    missingImageCount: missingImages.length,
    missingImageList: missingImages
  }

  fs.writeFileSync('audit_results.json', JSON.stringify(results, null, 2))
  console.log('Done auditing. Results in audit_results.json')
  process.exit(0)
}

run().catch(console.error)
