const cheerio = require('cheerio');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_URL = 'https://www.dilim.com.tr';
const PRODUCTS_URL = `${BASE_URL}/urunler.php`;

const OUT_DIR = path.join(__dirname, '../public/products');
const DATA_DIR = path.join(__dirname, '../src/data');

// Create directories if they don't exist
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        res.resume();
        reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
      }
    });
  });
};

const run = async () => {
  console.log(`Fetching ${PRODUCTS_URL}...`);
  const response = await fetch(PRODUCTS_URL);
  const html = await response.text();
  
  const $ = cheerio.load(html);
  const products = [];
  
  const items = $('.urun-list.filter').toArray();
  console.log(`Found ${items.length} products.`);

  for (let i = 0; i < items.length; i++) {
    const el = items[i];
    
    // e.g. "cms/upload/1606763886__mg_9873.jpg"
    let imgSrc = $(el).find('img').attr('src');
    if (!imgSrc) continue;
    
    const categoryRaw = $(el).find('.kategori').text().trim().replace(/&nbsp;/g, '').replace(/Â/g, '').trim();
    let category = categoryRaw;
    if (categoryRaw.includes('YAŞ PASTA')) category = 'yas-pastalar';
    else if (categoryRaw.includes('ÖZEL GÜN')) category = 'ozel-gun';
    else if (categoryRaw.includes('TATLILAR')) category = 'tatlilar';
    else category = 'tek-pastalar';

    const name = $(el).find('.aciklama').text().trim();
    
    // Clean up filename
    const filename = path.basename(imgSrc);
    const localImgPath = path.join(OUT_DIR, filename);
    const absoluteImgUrl = imgSrc.startsWith('http') ? imgSrc : `${BASE_URL}/${imgSrc}`;

    products.push({
      id: i + 1,
      name,
      category,
      originalCategory: categoryRaw,
      image: `/products/${filename}`
    });

    console.log(`Downloading [${i+1}/${items.length}] ${filename}...`);
    try {
      await downloadImage(absoluteImgUrl, localImgPath);
    } catch (e) {
      console.error(`Failed to download ${absoluteImgUrl}: ${e.message}`);
    }
  }

  // Assign dummy prices based on category
  const productsWithPrices = products.map(p => {
    let price = 'Özel Fiyat';
    if (p.category === 'tek-pastalar') price = '₺180';
    if (p.category === 'tatlilar') price = '₺450/kg';
    if (p.category === 'yas-pastalar') price = '₺750';
    return { ...p, price };
  });

  const jsonPath = path.join(DATA_DIR, 'products.json');
  fs.writeFileSync(jsonPath, JSON.stringify(productsWithPrices, null, 2));
  console.log(`Saved ${products.length} products to src/data/products.json`);
};

run().catch(console.error);
