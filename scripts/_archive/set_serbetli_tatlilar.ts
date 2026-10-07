import 'dotenv/config'
import payload from 'payload'
import config from '../src/payload.config'

const run = async () => {
  await payload.init({ config, local: true })

  const categoryTitle = "ŞERBETLİ TATLILAR"
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

  // 1. Liste: Saf isimler
  const productsToSet = [
    "KLASİK CEVİZLİ BAKLAVA",
    "CEVİZLİ EV BAKLAVASI",
    "SARAY SARMASI",
    "VEZİR PARMAĞI",
    "CEVİZLİ TEL KADAYIF",
    "KLASİK FISTIKLI BAKLAVA",
    "HAVUÇ DİLİMİ",
    "SARI BURMA",
    "ŞÖBİYET",
    "MİDYE",
    "FISTIKLI TEL KADAYIF",
    "SOĞUK BAKLAVA",
    "FISTIKLI ŞEKERPARE",
    "FISTIKLI GÜLLAÇ (RAMAZAN'A ÖZEL)",
    "SÜTLÜ NURİYE",
    "FINDIKLI ŞEKERPARE",
    "YALOVA SÜTLÜSÜ",
    "FINDIKLI GÜLLAÇ (RAMAZAN'A ÖZEL)"
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
    // Özel not: Güllaç için Ramazan kelimelerini göz ardı ederek de bulabiliriz ama tam eşleşmeye bakalım.
    let existing = allProducts.docs.find(d => {
      if (!d.title) return false;
      let dbTitle = d.title.toLowerCase('tr-TR');
      // İsminde "Güllaç" geçiyorsa ve targetName de güllaç ise eşleştir (önceden "Fıstıklı Güllaç" diye kaydedilmiş olabilir)
      if (targetNameLC.includes('güllaç') && dbTitle.includes('güllaç') && 
         ((targetNameLC.includes('fıstıklı') && dbTitle.includes('fıstıklı')) || 
          (targetNameLC.includes('fındıklı') && dbTitle.includes('fındıklı')))) {
        return true;
      }
      return dbTitle === targetNameLC;
    });

    // Varsayılan boş varyantlar
    const baseSizes = [
      { size: '1 Kilogram', price: 0 },
      { size: '500 Gram', price: 0 },
      { size: '250 Gram', price: 0 }
    ];

    if (existing) {
      // Mevcut ürün var. Eğer daha önceden varyantları (sizes) varsa, fiyatları korumak adına eskisini kullan.
      // Yoksa baseSizes ekle.
      let finalSizes = baseSizes;
      if (existing.hasSizes && existing.sizes && existing.sizes.length > 0) {
        finalSizes = existing.sizes; // Eski fiyatları koru
      }

      await payload.update({
        collection: 'products' as any,
        id: existing.id,
        data: {
          title: pName, // İsmini tam güncel yapalım (Örn Ramazan'a özel eklensin)
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
      const safeSlug = pName.toLowerCase('tr-TR').replace(/\\s+/g, '-').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[()']/g, '') + '-' + Math.floor(Math.random() * 1000);

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
    // Eğer validProducts içinde tam olarak bu isim geçmiyorsa (yukarıda title'ları güncelledik)
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
