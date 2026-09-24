import 'dotenv/config'
import payload from 'payload'
import config from '../src/payload.config'

const run = async () => {
  await payload.init({ config, local: true })

  // 1. YAŞ PASTALAR'IN VARYANTLARI
  const yasCatRes = await payload.find({ collection: 'categories' as any, where: { title: { equals: "YAŞ PASTALAR" } } });
  const yasId = yasCatRes.docs[0].id;

  const yasProducts = await payload.find({
    collection: 'products' as any,
    where: { category: { equals: yasId } },
    limit: 1000
  });

  let yasCount = 0;
  for (const doc of yasProducts.docs) {
    if (doc._status === 'published') {
      await payload.update({
        collection: 'products' as any,
        id: doc.id,
        data: {
          hasSizes: true,
          sizes: [
            { size: '0 Numara', price: 1450 },
            { size: '1 Numara', price: 1850 },
            { size: '2 Numara', price: 2150 }
          ]
        }
      });
      yasCount++;
    }
  }

  // 2. PETİFÜRLER'İN VARYANTLARI
  const petiCatRes = await payload.find({ collection: 'categories' as any, where: { title: { equals: "PETİFÜRLER" } } });
  const petiId = petiCatRes.docs[0].id;

  const petiProducts = await payload.find({
    collection: 'products' as any,
    where: { category: { equals: petiId } },
    limit: 1000
  });

  let petiCount = 0;
  for (const doc of petiProducts.docs) {
    if (doc._status === 'published') {
      await payload.update({
        collection: 'products' as any,
        id: doc.id,
        data: {
          hasSizes: true,
          sizes: [
            { size: '1 Kilogram', price: 1400 },
            { size: '500 Gram', price: 700 },
            { size: '250 Gram', price: 350 }
          ]
        }
      });
      petiCount++;
    }
  }

  console.log(`\\nİşlem Tamamlandı:`);
  console.log(`- ${yasCount} adet Yaş Pastaya (0-1-2 Numara) varyantları eklendi.`);
  console.log(`- ${petiCount} adet Petifüre (1KG-500GR-250GR) varyantları eklendi.`);
  process.exit(0);
}

run();
