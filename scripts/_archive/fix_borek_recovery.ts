import 'dotenv/config'
import payload from 'payload'
import config from '../src/payload.config'

const run = async () => {
  await payload.init({ config, local: true })

  const kurborekCat = await payload.find({ collection: 'categories' as any, where: { title: { equals: "KURABİYE VE BÖREKLER" } } })
  const yaspastaCat = await payload.find({ collection: 'categories' as any, where: { title: { equals: "YAŞ PASTALAR" } } })
  const tekpastaCat = await payload.find({ collection: 'categories' as any, where: { title: { equals: "TEK PASTALAR" } } })
  const sutluCat = await payload.find({ collection: 'categories' as any, where: { title: { equals: "SÜTLÜ TATLILAR" } } })
  const paketCat = await payload.find({ collection: 'categories' as any, where: { title: { equals: "PAKET ÜRÜNLER" } } })
  const petifurCat = await payload.find({ collection: 'categories' as any, where: { title: { equals: "PETİFÜRLER" } } })

  const kurborekId = kurborekCat.docs[0].id;

  // Tüm kurabiye ve böreklerdeki ürünleri çek
  const products = await payload.find({
    collection: 'products' as any,
    where: { category: { equals: kurborekId } },
    limit: 1000
  })

  for (const doc of products.docs) {
    const t = doc.title.toLowerCase('tr-TR');
    
    // YANLIŞLIKLA GELEN ÇİKOLATALILARI GERİ AL
    if (t.includes('çikolatalı tek pasta') || t.includes('tek pasta')) {
      await payload.update({ collection: 'products' as any, id: doc.id, data: { category: tekpastaCat.docs[0].id } });
      console.log('Geri Alındı (Tek Pasta):', doc.title)
    } 
    else if (t.includes('petifürler')) {
      await payload.update({ collection: 'products' as any, id: doc.id, data: { category: petifurCat.docs[0].id } });
      console.log('Geri Alındı (Petifür):', doc.title)
    }
    else if (t.includes('magnolya') || t.includes('ekler')) {
      await payload.update({ collection: 'products' as any, id: doc.id, data: { category: sutluCat.docs[0].id } });
      console.log('Geri Alındı (Sütlü):', doc.title)
    }
    else if (t.includes('melodi') || t.includes('çikolatin') || t.includes('dekorlu') || t.includes('madlen') || t.includes('yaldızlı') || t.includes('spesiyal')) {
      await payload.update({ collection: 'products' as any, id: doc.id, data: { category: paketCat.docs[0].id } });
      console.log('Geri Alındı (Paket):', doc.title)
    }
    else if (doc.title === 'MUZ ÇİKOLATALI' || doc.title === 'FRAMBUAZ ÇİKOLATALI' || doc.title === 'FISTIK ÇİKOLATALI' || doc.title === 'ÇİLEK ÇİKOLATALI') {
      await payload.update({ collection: 'products' as any, id: doc.id, data: { category: yaspastaCat.docs[0].id } });
      console.log('Geri Alındı (Yaş Pasta):', doc.title)
    }
  }

  // ŞİMDİ GERÇEK BÖREKLERİ GETİR!
  // Şerbetli Tatlılar kategorisindeki "böreği" vb ürünleri bul
  const serbetliCat = await payload.find({ collection: 'categories' as any, where: { title: { equals: "ŞERBETLİ TATLILAR" } } })
  const serbetliId = serbetliCat.docs[0].id;

  const serbetliProducts = await payload.find({
    collection: 'products' as any,
    where: { category: { equals: serbetliId } },
    limit: 1000
  })

  for (const doc of serbetliProducts.docs) {
    const t = doc.title.toLowerCase('tr-TR');
    if (t.includes('böre') || t.includes('borek') || t.includes('börek')) {
      await payload.update({ collection: 'products' as any, id: doc.id, data: { category: kurborekId } });
      console.log('DOĞRU TAŞINDI (Börek):', doc.title)
    }
  }

  console.log("Kurtarma işlemi bitti.");
  process.exit(0);
}

run();
