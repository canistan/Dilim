import 'dotenv/config'
import payload from 'payload'
import config from '../src/payload.config'

const run = async () => {
  await payload.init({ config, local: true })

  const categoryTitle = "TEK PASTALAR"
  const catRes = await payload.find({
    collection: 'categories' as any,
    where: { title: { equals: categoryTitle } }
  })

  let categoryId;
  if (catRes.docs.length === 0) {
    console.log(`"${categoryTitle}" kategorisi bulunamadı, oluşturuluyor...`);
    const newCat = await payload.create({
      collection: 'categories' as any,
      data: { title: categoryTitle }
    })
    categoryId = newCat.id;
  } else {
    categoryId = catRes.docs[0].id;
  }

  const productsToSet = [
    "ÇİLEKLİ TEK PASTA",
    "ÇİLEK ÇİKOLATALI TEK PASTA",
    "KARIŞIK MEYVELİ TEK PASTA",
    "ORMAN MEYVELİ TEK PASTA",
    "FISTIK ÇİKOLATALI TEK PASTA",
    "FRAMBUAZLI TEK PASTA",
    "FRAMBUAZ ÇİKOLATALI TEK PASTA",
    "LOTUSLU TEK PASTA",
    "MUZLU TEK PASTA",
    "MUZ ÇİKOLATALI TEK PASTA",
    "IBIZA MUZLU (BURÇAK BİSKÜVİLİ)",
    "IBIZA ÇİLEKLİ (BURÇAK BİSKÜVİLİ)",
    "MUZLU RULO PASTA",
    "ÇİLEKLİ RULO PASTA",
    "KROKANLI TEK PASTA",
    "MİLFÖY (SİPARİŞ ÜZERİNE)",
    "ŞEKER HAMURLU TEK PASTA"
  ];

  let updated = 0;
  let created = 0;

  const allProducts = await payload.find({
    collection: 'products' as any,
    limit: 1000,
  });

  for (const pName of productsToSet) {
    const targetNameLC = pName.toLowerCase('tr-TR');
    
    // DB'deki ürünler içinde case-insensitive arama
    const existing = allProducts.docs.find(d => d.title && d.title.toLowerCase('tr-TR') === targetNameLC);

    if (existing) {
      // Güncelle
      await payload.update({
        collection: 'products' as any,
        id: existing.id,
        data: {
          category: categoryId,
          _status: 'published',
          stock: 100
        }
      });
      console.log(`[GÜNCELLENDİ] ${existing.title} -> ${pName}`);
      updated++;
    } else {
      // Yeni Ekle
      let desc = "";
      if (pName === "ŞEKER HAMURLU TEK PASTA") {
        desc = "Şeker hamuru figürleri isteğe göre özel tasarlanmaktadır. Detaylar ve fiyat bilgisi için lütfen WhatsApp üzerinden iletişime geçiniz.";
      }
      
      const safeSlug = pName.toLowerCase('tr-TR').replace(/\\s+/g, '-').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c') + '-' + Math.floor(Math.random() * 1000);

      await payload.create({
        collection: 'products' as any,
        data: {
          title: pName,
          slug: safeSlug, // Unique hatası almamak için random ek
          category: categoryId,
          price: 0,
          stock: 100,
          _status: 'published',
          description: desc
        }
      });
      console.log(`[YENİ EKLENDİ] ${pName}`);
      created++;
    }
  }

  console.log(`\\nİşlem Tamamlandı: ${updated} güncellendi, ${created} yeni eklendi.`);
  process.exit(0);
}

run();
