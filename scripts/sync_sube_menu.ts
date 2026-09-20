import { getPayload } from 'payload'
import configPromise from '../src/payload.config'

const TARGET_CATEGORIES = [
  'Yaş Pastalar',
  'Şerbetli Tatlılar',
  'Sütlü Tatlılar',
  'Petifür & Makaron',
  'Tatlı Kuru Pasta',
  'Tuzlu Kuru Pasta',
  'Çikolata',
  'Dondurma'
];

async function syncCategories() {
  const payload = await getPayload({ config: configPromise })

  console.log('--- Kategori Senkronizasyonu Başlıyor ---');
  
  // 1. Mevcut tüm kategorileri getir
  const currentCategories = await payload.find({
    collection: 'categories',
    limit: 100,
  });

  const currentTitles = currentCategories.docs.map(doc => doc.title);
  
  // 2. Hedefte olmayanları pasife al (isActive = false)
  for (const doc of currentCategories.docs) {
    if (!TARGET_CATEGORIES.includes(doc.title)) {
      if (doc.isActive !== false) {
        await payload.update({
          collection: 'categories',
          id: doc.id,
          data: {
            isActive: false,
          }
        });
        console.log(`[PASİF] Kategori pasife alındı: ${doc.title}`);
      }
    } else {
      if (doc.isActive !== true) {
        await payload.update({
          collection: 'categories',
          id: doc.id,
          data: {
            isActive: true,
          }
        });
        console.log(`[AKTİF] Kategori aktifleştirildi: ${doc.title}`);
      }
    }
  }

  // 3. Eksik olan kategorileri oluştur (isActive = true)
  for (const targetTitle of TARGET_CATEGORIES) {
    if (!currentTitles.includes(targetTitle)) {
      await payload.create({
        collection: 'categories',
        data: {
          title: targetTitle,
          isActive: true,
        }
      });
      console.log(`[YENİ] Eksik kategori oluşturuldu: ${targetTitle}`);
    }
  }

  console.log('--- Senkronizasyon Tamamlandı ---');
  process.exit(0);
}

syncCategories().catch(console.error);
