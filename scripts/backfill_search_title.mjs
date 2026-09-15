// Mevcut tüm ürünlerin searchTitle alanını doldurmak için migration scripti
// Bu script, her ürünün title alanını Türkçe-dostu küçük harfe çevirip searchTitle'a yazar.

import 'dotenv/config'

const turkishLower = (str) => {
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

async function main() {
  const { getPayload } = await import('payload')
  const config = await import('../src/payload.config.ts')
  
  const payload = await getPayload({ config: config.default })
  
  // Tüm ürünleri getir (draft dahil)
  const allProducts = await payload.find({
    collection: 'products',
    limit: 0, // tüm ürünler
    draft: true,
  })
  
  console.log(`\n📦 Toplam ${allProducts.docs.length} ürün bulundu.\n`)
  
  let updated = 0
  let errors = 0
  
  for (const product of allProducts.docs) {
    try {
      const searchTitle = turkishLower(product.title)
      await payload.update({
        collection: 'products',
        id: product.id,
        data: {
          searchTitle,
        },
        draft: true, // draft ürünleri de güncelle
      })
      console.log(`  ✅ ${product.title} → ${searchTitle}`)
      updated++
    } catch (err) {
      console.error(`  ❌ Hata (${product.title}):`, err.message)
      errors++
    }
  }
  
  console.log(`\n🏁 Tamamlandı! ${updated} ürün güncellendi, ${errors} hata.`)
  process.exit(0)
}

main().catch(err => {
  console.error('Script hatası:', err)
  process.exit(1)
})
