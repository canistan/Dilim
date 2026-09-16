import { getPayload } from 'payload';
import configPromise from '@payload-config';

async function run() {
  const payload = await getPayload({ config: configPromise });
  
  // 1. "Yazılı Mumlar" (veya benzerleri) bul ve pasife al
  const oldCandles = await payload.find({
    collection: 'products',
    where: {
      or: [
        { title: { like: 'Yazılı' } },
        { title: { like: 'Pleksi' } },
        { title: { like: 'Uzun' } }
      ]
    }
  });

  for (const doc of oldCandles.docs) {
    if (doc.title === 'Yazılı Mumlar' || doc.title === 'Pleksi') {
      await payload.update({
        collection: 'products',
        id: doc.id,
        data: { isActive: 'passive' }
      });
      console.log(`Pasif yapıldı: ${doc.title}`);
    }
  }

  // 2. Yeni "Yazılı Pleksi" ve "Pleksi Rakam" ürünlerini oluştur (örnek)
  const category = await payload.find({ collection: 'categories', where: { title: { equals: 'Hediyelikler' } } });
  const catId = category.docs[0]?.id || 1; // Default to 1 if not found

  const existingPlexi = await payload.find({ collection: 'products', where: { title: { equals: 'Yazılı Pleksi (Seçmeli)' } } });
  if (existingPlexi.totalDocs === 0) {
    await payload.create({
      collection: 'products',
      data: {
        title: 'Yazılı Pleksi (Seçmeli)',
        price: 150,
        category: catId,
        stock: 999,
        hasTextSelection: true,
        isActive: 'active',
        _status: 'published',
      }
    });
    console.log('Yazılı Pleksi ürünü oluşturuldu.');
  }

  process.exit(0);
}
run();
