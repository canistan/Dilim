import 'dotenv/config'
import payload from 'payload'
import config from '../src/payload.config'

const run = async () => {
  await payload.init({ config, local: true })

  const categoryTitle = "SÜTLÜ TATLILAR"
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
    "KAZANDİBİ",
    "TAVUKGÖĞSÜ",
    "SÜTLAÇ",
    "KEŞKÜL",
    "MUHALLEBİ",
    "ALAÇATI MUHALLEBİSİ",
    "ORMAN MEYVELİ MAGNOLYA",
    "ÇİLEKLİ MAGNOLYA",
    "MUZLU ÇİKOLATALI MAGNOLYA",
    "SPOONFUL",
    "SUPANGLE",
    "PROFİTEROL",
    "TRALİÇE",
    "AŞURE",
    // CHEESECAKES
    "LOTUSLU CHEESECAKE",
    "LİMONLU CHEESECAKE",
    "FRAMBUAZLI CHEESECAKE",
    "DUBAI CHEESECAKE"
  ];

  const allProducts = await payload.find({
    collection: 'products' as any,
    limit: 1000,
  });

  let updated = 0;
  let created = 0;

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
      const safeSlug = pName.toLowerCase('tr-TR').replace(/\\s+/g, '-').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c') + '-' + Math.floor(Math.random() * 1000);

      await payload.create({
        collection: 'products' as any,
        data: {
          title: pName,
          slug: safeSlug, // Unique hatası almamak için random ek
          category: categoryId,
          price: 0,
          stock: 100,
          _status: 'published'
        }
      });
      console.log(`[YENİ EKLENDİ] ${pName}`);
      created++;
    }
  }

  // --- FAZLALIKLARI (DRAFT) PASİFE AL ---
  const validProductsLC = productsToSet.map(p => p.toLowerCase('tr-TR'));
  
  const allInCat = await payload.find({
    collection: 'products' as any,
    where: { category: { equals: categoryId } },
    limit: 1000
  });

  let draftCount = 0;
  for (const doc of allInCat.docs) {
    const t = doc.title.toLowerCase('tr-TR');
    if (!validProductsLC.includes(t)) {
      await payload.update({
        collection: 'products' as any,
        id: doc.id,
        data: {
          _status: 'draft'
        }
      });
      console.log(`PASİFE ALINDI (Draft): ${doc.title}`);
      draftCount++;
    }
  }

  console.log(`\\nİşlem Tamamlandı: ${updated} güncellendi, ${created} eklendi, ${draftCount} ürün pasife alındı.`);
  process.exit(0);
}

run();
