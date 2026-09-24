import 'dotenv/config'
import payload from 'payload'
import config from '../src/payload.config'

const run = async () => {
  await payload.init({ config, local: true })

  const priceMap: { [key: string]: number } = {
    "FINDIKLI GÜLLAÇ": 1000,
    "FISTIKLI GÜLLAÇ": 1200,
    "FISTIKLI ŞEKERPARE": 950,
    "HAVUÇ DİLİMİ": 2300,
    "KLASİK FISTIKLI BAKLAVA": 2150,
    "CEVİZLİ TEL KADAYIF": 1600,
    "KLASİK CEVİZLİ BAKLAVA": 1600,
    "SOĞUK BAKLAVA": 1800,
    "SARI BURMA": 2150,
    "SARAY SARMASI": 1600,
    "MİDYE": 2500,
    "VEZİR PARMAĞI": 1600,
    "ŞÖBİYET": 2200,
    "SÜTLÜ NURİYE": 1600
  };

  const categoryTitle = "ŞERBETLİ TATLILAR"
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
      // İsim eşleşmesi (Ramazan'a özel vb. notları ve Havuç dilimi 'Baklava' kelimesini göz ardı edebilmek için includes kullanıyoruz)
      if (dbNameLC.includes(targetNameLC) || targetNameLC.includes(dbNameLC.replace("(ramazan'a özel)", '').trim())) {
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

  console.log(`\\nİşlem Tamamlandı: Toplam ${updatedCount} şerbetli tatlının varyant fiyatları güncellendi.`);
  process.exit(0);
}

run();
