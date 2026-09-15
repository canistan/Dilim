import 'dotenv/config'
import pg from 'pg'

const client = new pg.Client({ 
  connectionString: process.env.DATABASE_URI,
  ssl: { rejectUnauthorized: false } 
})

async function main() {
  await client.connect()
  
  const cats = await client.query('SELECT id, title, slug FROM categories ORDER BY title')
  console.log('\n=== KATEGORİLER ===')
  cats.rows.forEach(c => console.log(c.id + ' | ' + c.title + ' | ' + c.slug))
  
  const prods = await client.query(`
    SELECT p.id, p.title, p.slug, p.price, p.has_sizes, c.title as cat_title, c.id as cat_id
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p._status = 'published'
    ORDER BY c.title, p.title
  `)
  
  let currentCat = ''
  let catCount = 0
  prods.rows.forEach(p => {
    const cat = p.cat_title || 'KATEGORİSİZ'
    if (cat !== currentCat) {
      if (currentCat) console.log('   Toplam: ' + catCount)
      currentCat = cat
      catCount = 0
      console.log('\n📁 ' + cat + ':')
    }
    catCount++
    console.log('   - ' + p.title + ' | ₺' + p.price + ' | hasSizes:' + p.has_sizes + ' | id:' + p.id)
  })
  if (catCount) console.log('   Toplam: ' + catCount)
  
  await client.end()
}
main().catch(e => { console.error(e); process.exit(1) })
