require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URI,
  });
  await client.connect();

  const rawData = JSON.parse(fs.readFileSync('prices_dump.json', 'utf8'));
  const pricesMap = [];
  
  for (const row of rawData) {
    if (row['0'] && row['3'] && typeof row['3'] === 'number') {
      pricesMap.push({ name: String(row['0']).trim().toLowerCase(), price: row['3'] });
    }
    if (row['5'] && row['7'] && typeof row['7'] === 'number') {
      pricesMap.push({ name: String(row['5']).trim().toLowerCase(), price: row['7'] });
    }
    if (row['9'] && row['11'] && typeof row['11'] === 'number') {
      pricesMap.push({ name: String(row['9']).trim().toLowerCase(), price: row['11'] });
    }
  }

  const res = await client.query('SELECT id, title, price, has_sizes FROM products');
  const products = res.rows;
  
  let updatedCount = 0;

  for (const product of products) {
    const prodName = product.title.toLowerCase();
    
    let match = pricesMap.find(p => {
      const pName = p.name.replace(/\s+/g, '').replace(/ı/g,'i').replace(/ş/g,'s').replace(/ç/g,'c').replace(/ö/g,'o').replace(/ü/g,'u').replace(/ğ/g,'g');
      const prodNameClean = prodName.replace(/\(.*\)/, '').replace(/\s+/g, '').replace(/ı/g,'i').replace(/ş/g,'s').replace(/ç/g,'c').replace(/ö/g,'o').replace(/ü/g,'u').replace(/ğ/g,'g');
      return pName === prodNameClean || pName.includes(prodNameClean) || prodNameClean.includes(pName);
    });
    
    if (match) {
      if (Number(product.price) !== Number(match.price) && !product.has_sizes) {
        console.log(`Güncelleniyor: ${product.title} (${product.price} -> ${match.price})`);
        await client.query('UPDATE products SET price = $1 WHERE id = $2', [match.price, product.id]);
        updatedCount++;
      }
    } else {
      // console.log(`Eşleşme bulunamadı: ${product.title}`);
    }
  }
  
  console.log(`Toplam ${updatedCount} ürün fiyatı güncellendi.`);
  await client.end();
}

run().catch(console.error);
