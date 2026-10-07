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

  if (catRes.docs.length === 0) {
    console.log("Kategori bulunamadı!");
    process.exit(1);
  }

  const categoryId = catRes.docs[0].id;

  const validProducts = [
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
  ].map(p => p.toLowerCase('tr-TR'));

  const allInCat = await payload.find({
    collection: 'products' as any,
    where: { category: { equals: categoryId } },
    limit: 1000
  });

  const extras = [];

  for (const doc of allInCat.docs) {
    const t = doc.title.toLowerCase('tr-TR');
    if (!validProducts.includes(t)) {
      extras.push(doc.title);
    }
  }

  if (extras.length > 0) {
    console.log("FAZLALIK ÜRÜNLER (Sizin listede olmayan ama bu kategoride bulunanlar):");
    extras.forEach(e => console.log("- " + e));
  } else {
    console.log("HİÇ FAZLALIK YOK! Sadece sizin gönderdiğiniz ürünler var.");
  }

  process.exit(0);
}

run();
