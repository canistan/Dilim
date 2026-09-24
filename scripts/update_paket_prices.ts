import 'dotenv/config'
import payload from 'payload'
import config from '../src/payload.config'

const run = async () => {
  await payload.init({ config, local: true })

  const priceMap: { [key: string]: number } = {
    "ZEYTİNLİ GEVREK": 235,
    "SELANİK GEVREĞİ": 350,
    "KIRIKKIRAK": 235,
    "KAŞARLI GALET": 325,
    "JAPONEX": 325,
    "GRİSSİNİ": 200,
    "ÇEKİRDEKLİ YAPRAK GEVREK": 235,
    "ÇEKİRDEKLİ GALET": 235,
    "BİSKOTTİ": 325,
    "BEZE": 235,
    "BATONSALE": 235,
    "ANASONLU GEVREK": 235,
    "ANASONLU GALET": 235,
    "ACIBADEM KÜÇÜK": 350
  };

  const categoryTitle = "PAKET ÜRÜNLER"
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
          price: matchedPrice
        }
      });
      console.log(`[FİYAT GÜNCELLENDİ] ${doc.title} -> ${matchedPrice} TL`);
      updatedCount++;
    }
  }

  console.log(`\\nİşlem Tamamlandı: Toplam ${updatedCount} paket ürünün fiyatı güncellendi.`);
  process.exit(0);
}

run();
