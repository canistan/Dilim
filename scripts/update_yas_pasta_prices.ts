import 'dotenv/config'
import payload from 'payload'
import config from '../src/payload.config'

const run = async () => {
  await payload.init({ config, local: true })

  const categoryTitle = "YAŞ PASTALAR"
  const catRes = await payload.find({
    collection: 'categories' as any,
    where: { title: { equals: categoryTitle } }
  })

  const categoryId = catRes.docs[0].id;

  const allProducts = await payload.find({
    collection: 'products' as any,
    where: { category: { equals: categoryId } },
    limit: 1000,
  });

  let updatedCount = 0;

  for (const doc of allProducts.docs) {
    if (doc._status === 'published') {
      await payload.update({
        collection: 'products' as any,
        id: doc.id,
        data: {
          price: 1450
        }
      });
      console.log(`[FİYAT GÜNCELLENDİ] ${doc.title} -> 1450 TL`);
      updatedCount++;
    }
  }

  console.log(`\\nİşlem Tamamlandı: Toplam ${updatedCount} yaş pastanın başlangıç fiyatı (0 nolu ebat) 1450 TL olarak güncellendi.`);
  process.exit(0);
}

run();
