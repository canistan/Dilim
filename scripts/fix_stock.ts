import 'dotenv/config'
import payload from 'payload'
import config from '../src/payload.config'

const run = async () => {
  await payload.init({ config, local: true })

  // Aktif olan tüm ürünleri bulalım
  const products = await payload.find({
    collection: 'products' as any,
    where: {
      isActive: { equals: 'active' }
    },
    limit: 1000,
  })

  let updateCount = 0;

  for (const doc of products.docs) {
    let needsUpdate = false;
    let updateData: any = {};

    // Stok 0 ise 100 yap
    if (!doc.stock || doc.stock === 0) {
      updateData.stock = 100;
      needsUpdate = true;
    }

    // Eğer versions/draft açık ise _status alanını published yapalım ki sitede çıksın
    if (doc._status !== 'published') {
      updateData._status = 'published';
      needsUpdate = true;
    }

    if (needsUpdate) {
      await payload.update({
        collection: 'products' as any,
        id: doc.id,
        data: updateData,
      })
      updateCount++;
      console.log(`Güncellendi: ${doc.title} (Stock: 100, Status: published)`)
    }
  }

  console.log(`İşlem tamamlandı. Toplam ${updateCount} aktif ürünün stok ve yayınlanma durumu düzeltildi.`)
  process.exit(0)
}

run()
