import 'dotenv/config'
import payload from 'payload'
import config from '../src/payload.config'

const run = async () => {
  await payload.init({ config, local: true })

  const draftProducts = await payload.find({
    collection: 'products' as any,
    where: { _status: { equals: 'draft' } },
    limit: 1000,
  });

  console.log(`\\n--- PASİF (DRAFT) DURUMDAKİ ÜRÜNLERİN LİSTESİ ---`);
  console.log(`Toplam ${draftProducts.docs.length} ürün bulundu.\\n`);

  for (const doc of draftProducts.docs) {
    let catName = 'Kategorisi Yok';
    if (doc.category) {
       // Kategori populate edildiyse veya id geldiyse. Populate edilmişse title alınır.
       catName = typeof doc.category === 'object' && doc.category.title ? doc.category.title : doc.category;
    }
    console.log(`- ${doc.title} (Kategori: ${catName})`);
  }

  process.exit(0);
}

run();
