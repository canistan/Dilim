import 'dotenv/config'
import payload from 'payload'
import config from '../src/payload.config'

const run = async () => {
  await payload.init({ config, local: true })

  const priceMap: { [key: string]: number } = {
    "PEYNİRLİ SU BÖREĞİ": 1100,
    "KIYMALI KOL BÖREĞİ": 1100,
    "PATATESLİ KOL BÖREĞİ": 1100,
    "PEYNİRLİ KOL BÖREĞİ": 1100,
    "SAKALLI": 1300
  };

  const categoryTitle = "KURABİYE VE BÖREKLER"
  const catRes = await payload.find({
    collection: 'categories' as any,
    where: { title: { equals: categoryTitle } }
  })
  
  if (catRes.docs.length === 0) {
    console.log("Kategori bulunamadı!");
    process.exit(1);
  }

  const categoryId = catRes.docs[0].id;

  const allProducts = await payload.find({
    collection: 'products' as any,
    where: { category: { equals: categoryId } },
    limit: 1000,
  });

  let updatedCount = 0;

  for (const doc of allProducts.docs) {
    if (doc._status !== 'published') continue;
    
    let matchedPrice = 0;
    const dbNameLC = doc.title.toLowerCase('tr-TR');

    for (const [pName, price] of Object.entries(priceMap)) {
      const targetNameLC = pName.toLowerCase('tr-TR');
      if (dbNameLC === targetNameLC) {
        matchedPrice = price;
        break;
      }
    }

    if (matchedPrice > 0) {
      await payload.update({
        collection: 'products' as any,
        id: doc.id,
        data: {
          hasSizes: true,
          sizes: [
            { size: '1 Kilogram', price: matchedPrice },
            { size: '500 Gram', price: matchedPrice / 2 },
            { size: '250 Gram', price: matchedPrice / 4 }
          ]
        }
      });
      console.log(`[VARYANT FİYATLARI GÜNCELLENDİ] ${doc.title} -> 1KG: ${matchedPrice} | 500G: ${matchedPrice/2} | 250G: ${matchedPrice/4}`);
      updatedCount++;
    }
  }

  console.log(`\\nİşlem Tamamlandı: Toplam ${updatedCount} ürünün varyant fiyatları güncellendi.`);
  process.exit(0);
}

run();
