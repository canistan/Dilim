import 'dotenv/config'
import payload from 'payload'
import config from '../src/payload.config'

const turkishLower = (str: string) => {
  return str
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .replace(/Ş/g, 'ş')
    .replace(/Ç/g, 'ç')
    .replace(/Ö/g, 'ö')
    .replace(/Ü/g, 'ü')
    .replace(/Ğ/g, 'ğ')
    .toLowerCase()
}

const run = async () => {
  await payload.init({ config, local: true })

  // 1. Yeni Kategoriyi Bul veya Oluştur
  const categoryTitle = "KURABİYE VE BÖREKLER"
  const slug = turkishLower(categoryTitle).replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')

  let categoryId: string;

  const existingCategory = await payload.find({
    collection: 'categories' as any,
    where: { slug: { equals: slug } }
  })

  if (existingCategory.docs.length > 0) {
    categoryId = existingCategory.docs[0].id;
    console.log("Kategori zaten var:", categoryTitle);
  } else {
    const newCategory = await payload.create({
      collection: 'categories' as any,
      data: {
        title: categoryTitle,
        slug: slug,
        isActive: true,
      }
    });
    categoryId = newCategory.id;
    console.log("Yeni kategori oluşturuldu:", categoryTitle);
  }

  // 2. Taşınacak ürünleri bul ve taşı
  const keywords = ['BÖREK', 'KURABİYE', 'PİZZA', 'GEVREK', 'GALET', 'BİSKOTTİ', 'BATONSALE', 'SAKALLI', 'MİLFÖY'];
  
  const allProducts = await payload.find({
    collection: 'products' as any,
    limit: 1000,
  })

  let count = 0;
  for (const doc of allProducts.docs) {
    const title = doc.title.toUpperCase();
    const shouldMove = keywords.some(kw => title.includes(kw));

    if (shouldMove) {
      // Ürünü yeni kategoriye güncelle
      await payload.update({
        collection: 'products' as any,
        id: doc.id,
        data: {
          category: categoryId
        }
      });
      console.log(`Taşındı: ${doc.title} -> ${categoryTitle}`);
      count++;
    }
  }

  console.log(`İşlem başarıyla tamamlandı. Toplam ${count} ürün yeni kategoriye taşındı.`);
  process.exit(0);
}

run();
