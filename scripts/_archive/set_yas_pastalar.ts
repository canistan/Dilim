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
    "ÇİLEKLİ",
    "ÇİLEK ÇİKOLATALI",
    "ÇİLEKLİ PROFİTEROL SOSLU",
    "GANAJ(PARÇA ÇİKOLATALI)",
    "FISTIK ÇİKOLATALI",
    "FISTIKLI MUZLU ( FİSTORİA)",
    "KARIŞIK MEYVELİ",
    "ORMAN MEYVELİ",
    "FRAMBUAZLI",
    "FRAMBUAZ ÇİKOLATALI",
    "FRAMBUAZ MUZLU",
    "PROFİTEROLLÜ",
    "LOTUS ÇİLEKLİ",
    "MUZLU",
    "MUZ ÇİKOLATALI",
    "KROKANLI"
  ];

  const allProducts = await payload.find({
    collection: 'products' as any,
    limit: 1000,
  });

  let updated = 0;
  let created = 0;
  let zeroPrices = [];

  for (const pName of productsToSet) {
    const targetNameLC = pName.toLowerCase('tr-TR');
    
    const existing = allProducts.docs.find(d => d.title && d.title.toLowerCase('tr-TR') === targetNameLC);

    if (existing) {
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
      if (!existing.price || existing.price === 0) {
        zeroPrices.push(pName);
      }
    } else {
      const safeSlug = pName.toLowerCase('tr-TR').replace(/\\s+/g, '-').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[()]/g, '') + '-' + Math.floor(Math.random() * 1000);

      await payload.create({
        collection: 'products' as any,
        data: {
          title: pName,
          slug: safeSlug,
          category: categoryId,
          price: 0,
          stock: 100,
          _status: 'published'
        }
      });
      console.log(`[YENİ EKLENDİ] ${pName}`);
      created++;
      zeroPrices.push(pName);
    }
  }

  // FAZLALIKLARI (DRAFT) PASİFE AL
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
  if (zeroPrices.length > 0) {
    console.log(`\\n!!! DİKKAT: AŞAĞIDAKİ ÜRÜNLERİN FİYATI 0 TL !!!`);
    zeroPrices.forEach(z => console.log(`- ${z}`));
  }

  process.exit(0);
}

run();
