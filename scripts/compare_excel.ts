import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import * as xlsx from 'xlsx'
import { getPayload } from 'payload'
import configPromise from '../src/payload.config'

async function run() {
  const excelPath = path.join(process.cwd(), 'public', 'FiyatListesi.xlsx')
  if (!fs.existsSync(excelPath)) {
    console.error('Excel file not found:', excelPath)
    process.exit(1)
  }

  // Parse Excel
  const workbook = xlsx.readFile(excelPath)
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const rows = xlsx.utils.sheet_to_json<any>(sheet)

  // Expected format usually has a Name and Price column. 
  // Let's print out the keys of the first row to understand the structure
  if (rows.length > 0) {
    console.log('Excel columns:', Object.keys(rows[0]))
  }

  const payload = await getPayload({ config: configPromise })
  
  // Fetch all products
  const productsResult = await payload.find({
    collection: 'products',
    limit: 1000,
    depth: 0 // Only IDs for relations, keep it light
  })
  const dbProducts = productsResult.docs

  console.log(`Found ${rows.length} rows in Excel and ${dbProducts.length} products in DB.`)
  
  // Try to normalize names and find matches
  // A typical Excel might have columns like: 'Ürün Adı', 'Fiyat', 'Kategori'
  // I will write out a raw JSON dump to analyze it instead of complex parsing here
  
  const dump = {
    excelFirstRows: rows.slice(0, 5),
    excelTotalCount: rows.length,
    dbProductsCount: dbProducts.length,
    dbProductsSample: dbProducts.slice(0, 5).map(p => ({
      title: p.title,
      price: p.price,
      slug: p.slug,
      hasImage: !!p.image
    }))
  }

  fs.writeFileSync('scratch_dump.json', JSON.stringify(dump, null, 2))
  console.log('Dump written to scratch_dump.json')
  process.exit(0)
}

run().catch(console.error)
