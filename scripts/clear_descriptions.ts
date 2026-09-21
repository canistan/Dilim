import 'dotenv/config'
import payload from 'payload'
import config from '../src/payload.config'

const run = async () => {
  await payload.init({ config, local: true })

  const productsRes = await payload.find({
    collection: 'products' as any,
    limit: 1000,
  })

  let updateCount = 0;

  for (const doc of productsRes.docs) {
    // Sadece açıklama veya içindekiler doluysa update yap
    if (doc.description || doc.ingredients) {
      await payload.update({
        collection: 'products' as any,
        id: doc.id,
        data: {
          description: '', // Açıklamayı siliyoruz
          ingredients: '', // İçindekileri (yapılışı) siliyoruz
          // allergens duruyor!
        }
      });
      updateCount++;
    }
  }

  console.log(`Bitti! Toplam ${updateCount} ürünün Açıklama ve İçindekiler kısmı temizlendi. (Alerjenler korundu)`);
  process.exit(0);
}

run();
