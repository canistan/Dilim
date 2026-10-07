import 'dotenv/config';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

async function run() {
  const payload = await getPayload({ config: configPromise });
  
  const categories = await payload.find({ collection: 'categories', limit: 100 });
  console.log("### KATEGORİLER ###");
  categories.docs.forEach(c => console.log(`- ${c.title}`));
  
  const products = await payload.find({ collection: 'products', limit: 500 });
  console.log("\n### ÜRÜNLER ###");
  products.docs.forEach(p => {
      let catName = 'Kategorisiz';
      if (p.category) {
          if (typeof p.category === 'object' && p.category.title) {
              catName = p.category.title;
          } else if (typeof p.category === 'string' || typeof p.category === 'number') {
              const matchedCat = categories.docs.find(c => c.id === p.category);
              if (matchedCat) catName = matchedCat.title;
          }
      }
      console.log(`- ${p.title} (${catName})`);
  });
  
  process.exit(0);
}

run().catch(console.error);
