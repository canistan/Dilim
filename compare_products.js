const fs = require('fs');
const https = require('https');
const { Client } = require('pg');

const url = "https://docs.google.com/spreadsheets/d/1lHzWIPdtGnratgoof5BTeqI8TEo15Bs5701XpXtXAd0/export?format=csv";

https.get(url, (res) => {
  let data = '';
  if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
    https.get(res.headers.location, (res2) => {
      res2.on('data', chunk => data += chunk);
      res2.on('end', () => processCSV(data));
    });
  } else {
    res.on('data', chunk => data += chunk);
    res.on('end', () => processCSV(data));
  }
});

function processCSV(csv) {
  const lines = csv.split('\n');
  const excelProducts = [];

  for (const line of lines) {
    const cols = [];
    let curr = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') {
        inQuotes = !inQuotes;
      } else if (line[i] === ',' && !inQuotes) {
        cols.push(curr);
        curr = '';
      } else {
        curr += line[i];
      }
    }
    cols.push(curr);

    const pairs = [
      { name: 0, price: 3 },
      { name: 5, price: 7 },
      { name: 9, price: 11 },
      { name: 13, price: 15 }
    ];

    for (const p of pairs) {
      if (cols.length > p.price) {
        let name = cols[p.name]?.trim();
        let priceStr = cols[p.price]?.trim();
        
        if (name && priceStr && !name.includes('POĞAÇALAR') && !name.includes('KILOLUK') && !name.includes('KEKLER VE ÇÖREKLER') && !name.includes('PASTALAR')) {
          priceStr = priceStr.replace('₺', '').replace(/,/g, '').trim();
          let price = parseFloat(priceStr);
          if (!isNaN(price) && name) {
            excelProducts.push({ name, price });
          }
        }
      }
    }
  }

  const client = new Client({
    connectionString: 'postgresql://neondb_owner:npg_1xCYDSPjTQ2h@ep-aged-shadow-a2o0300e-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
  });

  client.connect().then(() => {
    client.query('SELECT id, title, price, has_sizes FROM products').then(res => {
      const dbProducts = res.rows;
      compareData(excelProducts, dbProducts, client);
    }).catch(err => {
      console.error(err);
      client.end();
    });
  });
}

async function compareData(excelProducts, dbProducts, client) {
  console.log(`Found ${excelProducts.length} valid products in Excel.`);
  console.log(`Found ${dbProducts.length} products in DB.`);

  const missingInDb = [];
  const priceMismatch = [];

  // Also we need to get prices for sizes. Payload stores arrays in a separate table for postgres: products_sizes
  // Let's query products_sizes if it exists
  let sizes = [];
  try {
    const sizeRes = await client.query('SELECT _parent_id as parent_id, size, price FROM products_sizes');
    sizes = sizeRes.rows;
  } catch(e) {
    console.log("Could not query products_sizes, it may not exist or has different name:", e.message);
  }

  for (const ex of excelProducts) {
    const dbP = dbProducts.find(p => p.title.toLowerCase().trim() === ex.name.toLowerCase().trim());
    
    if (!dbP) {
      if (ex.name === "0 NO'LU PASTALAR" || ex.name === "1 NO'LU PASTALAR" || ex.name === "2 NO'LU PASTALAR") {
        // Find if we have these prices in the sizes table
        const sizeName = ex.name === "0 NO'LU PASTALAR" ? "0 Numara" : 
                         ex.name === "1 NO'LU PASTALAR" ? "1 Numara" : "2 Numara";
        
        // Find any product that has this size price
        const sizeRow = sizes.find(s => s.size && s.size.includes(sizeName));
        if (sizeRow && parseFloat(sizeRow.price) !== ex.price) {
           priceMismatch.push({
             name: ex.name,
             excelPrice: ex.price,
             dbPrice: parseFloat(sizeRow.price)
           });
        }
        continue;
      }
      missingInDb.push(ex.name);
    } else {
      if (!dbP.has_sizes && parseFloat(dbP.price) !== ex.price) {
        priceMismatch.push({
          name: ex.name,
          excelPrice: ex.price,
          dbPrice: parseFloat(dbP.price)
        });
      }
    }
  }

  console.log('\n--- Missing in DB ---');
  missingInDb.forEach(m => console.log(m));

  console.log('\n--- Price Mismatches ---');
  priceMismatch.forEach(p => console.log(`${p.name} -> Excel: ${p.excelPrice}, DB: ${p.dbPrice}`));
  
  client.end();
}
