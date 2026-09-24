import 'dotenv/config'
import payload from 'payload'
import config from '../src/payload.config'

const run = async () => {
  await payload.init({ config, local: true })

  // TEK PASTALAR, SÜTLÜ TATLILAR, PETİFÜRLER kategorilerinin ID'lerini al
  const catNames = ["TEK PASTALAR", "SÜTLÜ TATLILAR", "PETİFÜRLER"];
  
  const categories = await payload.find({
    collection: 'categories' as any,
    where: { title: { in: catNames } },
    limit: 10
  });

  const catIds = categories.docs.map(c => c.id);

  if (catIds.length === 0) {
    console.log("Kategoriler bulunamadı!");
    process.exit(1);
  }

  // Bu kategorilerdeki ve fiyatı 0 (veya boş) olan ürünleri çek
  const zeroPriceProducts = await payload.find({
    collection: 'products' as any,
    where: {
      and: [
        { category: { in: catIds } },
        { _status: { equals: 'published' } }
      ]
    },
    limit: 1000
  });

  const zeros = zeroPriceProducts.docs.filter(p => !p.price || p.price === 0);

  if (zeros.length > 0) {
    console.log("--- FİYATI 0₺ OLAN ÜRÜNLER LİSTESİ ---");
    zeros.forEach(z => {
      console.log(`- ${z.title}`);
    });
  } else {
    console.log("Bu 3 kategoride 0₺ ürün bulunmuyor.");
  }

  process.exit(0);
}

run();
