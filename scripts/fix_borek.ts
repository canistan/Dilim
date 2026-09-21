import 'dotenv/config'
import payload from 'payload'
import config from '../src/payload.config'

const run = async () => {
  await payload.init({ config, local: true })

  const categoryTitle = "KURABİYE VE BÖREKLER"
  
  // KURABIYE VE BOREKLER kategorisinin ID'sini bul
  const cats = await payload.find({
    collection: 'categories' as any,
    where: {
      title: { equals: categoryTitle }
    }
  })

  if (cats.docs.length === 0) {
    console.log("Kategori bulunamadı!");
    process.exit(1);
  }

  const categoryId = cats.docs[0].id;
  console.log("Hedef Kategori ID:", categoryId);

  // Börekleri bul (title LIKE '%örek%' vb.)
  const allProducts = await payload.find({
    collection: 'products' as any,
    limit: 1000,
  })

  let count = 0;
  for (const doc of allProducts.docs) {
    const t = doc.title.toLowerCase('tr-TR');
    if (t.includes('börek') || t.includes('borek') || t.includes('kol') || t.includes('su böreği')) {
      if (doc.category !== categoryId && (typeof doc.category !== 'object' || doc.category.id !== categoryId)) {
        await payload.update({
          collection: 'products' as any,
          id: doc.id,
          data: {
            category: categoryId
          }
        });
        console.log(`Taşındı: ${doc.title}`);
        count++;
      }
    }
  }

  console.log(`İşlem bitti. ${count} adet börek KURABİYE VE BÖREKLER kategorisine taşındı.`);
  process.exit(0);
}

run();
