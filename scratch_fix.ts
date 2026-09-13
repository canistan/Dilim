import { getPayload } from 'payload'
import configPromise from './src/payload.config'

async function fix() {
  const payload = await getPayload({ config: configPromise })
  
  const products = await payload.find({
    collection: 'products',
    limit: 1,
  })
  
  if (products.docs.length > 0) {
    const doc = products.docs[0];
    console.log("Updating product:", doc.title);
    try {
      await payload.update({
        collection: 'products',
        id: doc.id,
        data: {
          _status: 'published',
        },
      });
      console.log("Update successful");
    } catch(e) {
      console.error("Update failed:", e);
    }
  }
  process.exit(0);
}
fix();
