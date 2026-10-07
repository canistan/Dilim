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

  console.log(`Toplam ${draftProducts.docs.length} adet pasif ürün siliniyor...`);

  let deletedCount = 0;
  for (const doc of draftProducts.docs) {
    try {
      await payload.delete({
        collection: 'products' as any,
        id: doc.id,
      });
      console.log(`[SİLİNDİ] ${doc.title}`);
      deletedCount++;
    } catch (err) {
      console.error(`Silinirken hata oluştu: ${doc.title}`, err);
    }
  }

  console.log(`\\nİşlem Tamamlandı! Toplam ${deletedCount} adet hayalet (draft) ürün veritabanından kalıcı olarak silindi.`);
  process.exit(0);
}

run();
