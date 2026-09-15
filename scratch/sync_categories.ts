import { getPayload } from 'payload'
import configPromise from '../src/payload.config'
import * as dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

// Read OCR and group products by PDF category
const ocrText = fs.readFileSync(path.resolve(__dirname, 'ocr_products.txt'), 'utf-8')
const lines = ocrText.split('\n').map(l => l.trim()).filter(l => l);

const pdfCategoryMap = new Map<string, string>(); // Product Name -> PDF Category

let currentCategory = '';
for (const line of lines) {
  if (!/\d/.test(line)) {
    currentCategory = line;
  } else {
    const match = line.match(/^(.*?)\s+(ADET \/ KİLO|ADET|KİLOGRAM)\s+[\d\.]+/);
    if (match) {
      const title = match[1].trim();
      pdfCategoryMap.set(title.toLowerCase(), currentCategory);
    } else {
      const parts = line.split(/\s+/);
      const firstNumIndex = parts.findIndex(p => /^\d+\.?\d*$/.test(p));
      if (firstNumIndex > 0) {
        const title = parts.slice(0, firstNumIndex).join(' ').replace(/ADET|KİLOGRAM|ADET \/ KİLO/, '').trim();
        pdfCategoryMap.set(title.toLowerCase(), currentCategory);
      }
    }
  }
}

// Categories we want to CREATE and assign based on the PDF
const categoriesToCreate = [
  'Mayalı Poğaçalar',
  'Kuru Poğaçalar',
  'Özel Poğaçalar',
  'Kol Böreği',
  'Açmalar'
];

async function run() {
  const payload = await getPayload({ config: configPromise })

  const allCategories = await payload.find({ collection: 'categories', limit: 100 })
  const allProducts = await payload.find({ collection: 'products', limit: 1000 })

  // 1. Create missing categories
  const categoryIds = new Map<string, string>();
  for (const cat of allCategories.docs) {
    categoryIds.set(cat.title.toLowerCase(), cat.id);
  }

  for (const newCat of categoriesToCreate) {
    if (!categoryIds.has(newCat.toLowerCase())) {
      const created = await payload.create({
        collection: 'categories',
        data: { title: newCat }
      });
      categoryIds.set(newCat.toLowerCase(), created.id);
      console.log(`Created category: ${newCat}`);
    }
  }

  // 2. Map PDF names to our new Title-cased Category names
  const pdfToNewCat: Record<string, string> = {
    'MAYALI POĞAÇALAR': 'Mayalı Poğaçalar',
    'KURU POĞAÇALAR': 'Kuru Poğaçalar',
    'ÖZEL POĞAÇALAR': 'Özel Poğaçalar',
    'KOL BÖREĞİ': 'Kol Böreği',
    'AÇMALAR': 'Açmalar'
  }

  // 3. Update products
  let updateCount = 0;
  for (const product of allProducts.docs) {
    const pdfCat = pdfCategoryMap.get(product.title.toLowerCase());
    
    // Only touch products if they belong to one of the 5 new PDF categories
    if (pdfCat && pdfToNewCat[pdfCat]) {
      const targetCatTitle = pdfToNewCat[pdfCat];
      const targetCatId = categoryIds.get(targetCatTitle.toLowerCase());
      
      const currentCatId = typeof product.category === 'object' ? product.category?.id : product.category;

      if (currentCatId !== targetCatId) {
        await payload.update({
          collection: 'products',
          id: product.id,
          data: { category: targetCatId }
        });
        console.log(`Moved ${product.title} to ${targetCatTitle}`);
        updateCount++;
      }
    }
  }

  console.log(`Updated ${updateCount} products to new categories.`);

  // 4. Optionally delete empty 'Börekler' category if it's no longer used
  if (categoryIds.has('börekler')) {
    const borekId = categoryIds.get('börekler')!;
    const checkBorekler = await payload.find({
      collection: 'products',
      where: { category: { equals: borekId } },
      limit: 1
    });
    if (checkBorekler.docs.length === 0) {
      await payload.delete({
        collection: 'categories',
        id: borekId
      });
      console.log('Deleted empty category: Börekler');
    } else {
      console.log(`Börekler category is not empty (${checkBorekler.totalDocs} products remaining). Did not delete.`);
    }
  }

  process.exit(0);
}

run().catch(console.error);
