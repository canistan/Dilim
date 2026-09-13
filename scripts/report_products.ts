import { getPayload } from 'payload'
import configPromise from '../src/payload.config'

async function run() {
  const payload = await getPayload({ config: configPromise });

  const productsRes = await payload.find({
    collection: 'products',
    limit: 1000,
    depth: 1, // To get the images info
  });

  const allProducts = [];
  const noImageProducts = [];
  let withImageCount = 0;

  for (const p of productsRes.docs) {
    // Determine price
    let priceDisplay = '';
    if (p.hasSizes && p.sizes && p.sizes.length > 0) {
      priceDisplay = p.sizes.map(s => `${s.size}: ₺${s.price}`).join(', ');
    } else {
      priceDisplay = `₺${p.price || 0}`;
    }

    allProducts.push({ title: p.title, price: priceDisplay });

    // Determine images
    if (!p.images || p.images.length === 0) {
      noImageProducts.push(p.title);
    } else {
      withImageCount++;
    }
  }

  // Sort alphabetically
  allProducts.sort((a, b) => a.title.localeCompare(b.title));
  noImageProducts.sort((a, b) => a.localeCompare(b));

  console.log("=== TOTAL PRODUCTS ===");
  console.log(allProducts.length);
  
  console.log("=== WITH IMAGES ===");
  console.log(withImageCount);

  console.log("=== NO IMAGES ===");
  console.log(noImageProducts.length);

  const report = {
    allProducts,
    noImageProducts
  };
  
  const fs = require('fs');
  fs.writeFileSync('products_report.json', JSON.stringify(report, null, 2));
  process.exit(0);
}

run().catch(console.error);
