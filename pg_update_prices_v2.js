require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');

function normalize(str) {
  return str.toLocaleLowerCase('tr-TR')
    .replace(/\s+/g, '')
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ğ/g, 'g')
    .replace(/[^a-z0-9]/gi, ''); // remove everything else like parenthesis, dashes
}

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URI,
  });
  await client.connect();

  const rawData = JSON.parse(fs.readFileSync('prices_dump.json', 'utf8'));
  const pricesMap = [];
  
  for (const row of rawData) {
    if (row['0'] && row['3'] && typeof row['3'] === 'number') {
      pricesMap.push({ name: String(row['0']).trim(), price: row['3'] });
    }
    if (row['5'] && row['7'] && typeof row['7'] === 'number') {
      pricesMap.push({ name: String(row['5']).trim(), price: row['7'] });
    }
    if (row['9'] && row['11'] && typeof row['11'] === 'number') {
      pricesMap.push({ name: String(row['9']).trim(), price: row['11'] });
    }
  }

  const res = await client.query('SELECT id, title, price, has_sizes FROM products');
  const products = res.rows;
  
  let updatedCount = 0;

  for (const product of products) {
    const prodNameClean = normalize(product.title);
    
    let match = pricesMap.find(p => {
      const pNameClean = normalize(p.name);
      return pNameClean === prodNameClean || pNameClean.includes(prodNameClean) || prodNameClean.includes(pNameClean);
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
  
  console.log(`Toplam ${updatedCount} yeni ürün fiyatı güncellendi.`);
  await client.end();
}

run().catch(console.error);
