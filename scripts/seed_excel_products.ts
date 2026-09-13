import { getPayload } from 'payload'
import configPromise from '../src/payload.config'
import https from 'https'

const url = "https://docs.google.com/spreadsheets/d/1lHzWIPdtGnratgoof5BTeqI8TEo15Bs5701XpXtXAd0/export?format=csv";

function downloadCSV(): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (res2) => {
          res2.on('data', chunk => data += chunk);
          res2.on('end', () => resolve(data));
          res2.on('error', reject);
        });
      } else {
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
        res.on('error', reject);
      }
    }).on('error', reject);
  });
}

function processCSV(csv: string) {
  const lines = csv.split('\n');
  const excelProducts: { name: string, price: number }[] = [];

  for (const line of lines) {
    const cols: string[] = [];
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
  return excelProducts;
}

function getCategorySlug(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('börek') || n.includes('pizza') || n.includes('tepsi')) return 'borekler';
  if (n.includes('poğaça') || n.includes('açma') || n.includes('simit')) return 'paket-urunler'; // Or maybe corekler, but lets use paket-urunler or borekler
  if (n.includes('çikolata') || n.includes('draje') || n.includes('madlen')) return 'cikolata-ve-lokumlar';
  if (n.includes('mum') || n.includes('pleksi')) return 'hediyelikler';
  if (n.includes('galet') || n.includes('gevrek') || n.includes('grissini') || n.includes('kırıkkırak')) return 'paket-urunler';
  if (n.includes('pasta')) return 'pastalar';
  return 'kekler-ve-corekler'; // default
}

async function run() {
  console.log("Starting script...");
  const payload = await getPayload({ config: configPromise });

  // 1. Fetch categories
  const categoriesRes = await payload.find({
    collection: 'categories',
    limit: 100,
  });
  
  const categoryMap = new Map<string, string>();
  categoriesRes.docs.forEach(c => {
    categoryMap.set(c.slug as string, c.id as string);
  });

  // 2. Publish existing products correctly to fix versions issue
  console.log("Step 1: Fixing existing products...");
  const existingRes = await payload.find({
    collection: 'products',
    limit: 1000,
  });

  let count = 0;
  for (const doc of existingRes.docs) {
    if (doc._status !== 'published') {
      try {
        await payload.update({
          collection: 'products',
          id: doc.id,
          data: {
            _status: 'published'
          }
        });
        count++;
      } catch (e) {
        console.error(`Failed to update ${doc.title}:`, e);
      }
    }
  }
  console.log(`Successfully fixed and published ${count} existing products.`);

  // 3. Process new products from CSV
  console.log("Step 2: Processing missing products from Excel...");
  const csvData = await downloadCSV();
  const excelProducts = processCSV(csvData);
  console.log(`Parsed ${excelProducts.length} valid items from Excel.`);

  const missingProducts: {name: string, price: number}[] = [];
  for (const ex of excelProducts) {
    // Ignore the sizes inside has_sizes products
    if (ex.name.includes("NO'LU PASTALAR")) continue;
    
    const exists = existingRes.docs.find(d => d.title.toLowerCase().trim() === ex.name.toLowerCase().trim());
    if (!exists) {
      missingProducts.push(ex);
    }
  }

  console.log(`Found ${missingProducts.length} missing products to add.`);

  // Add missing products
  for (const p of missingProducts) {
    const slug = getCategorySlug(p.name);
    const catId = categoryMap.get(slug) || categoryMap.get('kekler-ve-corekler');
    
    // SEO fields
    const metaTitle = `${p.name} Siparişi | Kavacık & Ümraniye - Dilim Pastaneleri`;
    const metaDesc = `Taptaze ${p.name} siparişinizi Dilim Pastaneleri'nden hemen verin. Kavacık ve Ümraniye'ye aynı gün teslimat avantajıyla kapınıza gelsin.`;

    try {
      await payload.create({
        collection: 'products',
        data: {
          title: p.name,
          price: p.price,
          stock: 100,
          isActive: 'active',
          _status: 'published',
          category: catId as any, // ID string
          hasSizes: false,
          hasNumberSelection: false,
          isSameDayEligible: true,
          leadTime: 2,
          // SEO Plugin adds a meta object
          meta: {
            title: metaTitle,
            description: metaDesc
          }
        } as any
      });
      console.log(`+ Added: ${p.name}`);
    } catch (e) {
      console.error(`- Failed to add ${p.name}:`, e);
    }
  }

  console.log("Process completed!");
  process.exit(0);
}

run().catch(console.error);
