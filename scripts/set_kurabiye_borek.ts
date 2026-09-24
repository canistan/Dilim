import 'dotenv/config'
import payload from 'payload'
import config from '../src/payload.config'

const run = async () => {
  await payload.init({ config, local: true })

  const categoryTitle = "KURABİYE VE BÖREKLER"
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
    "KARIŞIK TATLI KURABİYE",
    "KARIŞIK TUZLU KURABİYE",
    "MİNİ PİZZALAR",
    "SAKALLI",
    "PEYNİRLİ SU BÖREĞİ",
    "KIYMALI KOL BÖREĞİ",
    "PEYNİRLİ KOL BÖREĞİ",
    "PATATESLİ KOL BÖREĞİ"
  ];

  const allProducts = await payload.find({
    collection: 'products' as any,
    limit: 1000,
  });

  let updated = 0;
  let created = 0;

  const baseSizes = [
    { size: '1 Kilogram', price: 0 },
    { size: '500 Gram', price: 0 },
    { size: '250 Gram', price: 0 }
  ];

  for (const pName of productsToSet) {
    const targetNameLC = pName.toLowerCase('tr-TR');
    
    // DB'deki ürünler içinde case-insensitive arama
    const existing = allProducts.docs.find(d => d.title && d.title.toLowerCase('tr-TR') === targetNameLC);

    if (existing) {
      let finalSizes = baseSizes;
      if (existing.hasSizes && existing.sizes && existing.sizes.length > 0) {
        finalSizes = existing.sizes; // Mevcut fiyatları (varsa) koru
      }

      await payload.update({
        collection: 'products' as any,
        id: existing.id,
        data: {
          category: categoryId,
          _status: 'published',
          stock: 100,
          hasSizes: true,
          sizes: finalSizes
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
          slug: safeSlug, 
          category: categoryId,
          price: 0,
          stock: 100,
          _status: 'published',
          hasSizes: true,
          sizes: baseSizes
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

  // 0 TL Olanları Bul (Yeni Eklenenler veya Fiyatı Boş Kalanlar)
  console.log(`\\n!!! DİKKAT: AŞAĞIDAKİ ÜRÜNLERİN 1 KG FİYATI 0 TL !!!`);
  const finalCatProds = await payload.find({ collection: 'products' as any, where: { category: { equals: categoryId }, _status: { equals: 'published' } }, limit: 1000 });
  
  for (const p of finalCatProds.docs) {
    if (p.hasSizes && p.sizes) {
      const kg = p.sizes.find(s => s.size === '1 Kilogram');
      if (kg && (!kg.price || kg.price === 0)) {
         console.log(`- ${p.title}`);
      }
    }
  }

  console.log(`\\nİşlem Tamamlandı: ${updated} güncellendi, ${created} eklendi, ${draftCount} ürün pasife alındı.`);
  process.exit(0);
}

run();
