import 'dotenv/config'

async function main() {
  const { getPayload } = await import('payload')
  const config = await import('../src/payload.config.ts')
  const payload = await getPayload({ config: config.default })

  const updates = [
    { title: 'AY ÇÖREĞİ', cat: 'kekler-ve-corekler' },
    { title: 'TAHİNLİ ÇÖREK', cat: 'kekler-ve-corekler' },
    { title: 'İRAN POĞAÇASI', cat: 'ozel-pogacalar' },
    { title: 'ÇATAL', cat: 'kekler-ve-corekler' },
    { title: 'UN KURABİYESİ', cat: 'paket-urunler' },
    { title: 'TUZLU KURABIYE', cat: 'kiloluk-urunler' },
    { title: 'CEVİZLİ BAKLAVA', cat: 'tatlilar' },
    { title: 'SOĞUK BAKLAVA', cat: 'tatlilar' },
    { title: 'SARAY SARMASI', cat: 'tatlilar' },
    { title: 'SARI BURMA', cat: 'tatlilar' },
    { title: 'VEZİR PARMAĞI', cat: 'tatlilar' },
    { title: 'TEL KADAYIF(CEVİZLİ)', cat: 'tatlilar' },
    { title: 'TEL KADAYIF(FISTIKLI)', cat: 'tatlilar' },
    { title: 'KAZANDİBİ', cat: 'tatlilar' },
    { title: 'KEŞKÜL', cat: 'tatlilar' },
    { title: 'SÜTLAÇ', cat: 'tatlilar' },
    { title: 'TAVUK GÖĞSÜ', cat: 'tatlilar' },
    { title: 'TRALİÇE', cat: 'tatlilar' },
    { title: 'MAGNOLYA', cat: 'tatlilar' },
    { title: 'SUPANGLE', cat: 'tatlilar' },
    { title: 'AŞURE', cat: 'tatlilar' },
    { title: 'SAKALLI', cat: 'kiloluk-urunler' },
    { title: 'MAKARON', cat: 'paket-urunler' },
    { title: 'KÜÇÜK PİZZA', cat: 'borekler' },
    { title: 'MİDYE', cat: 'tatlilar' },
    { title: 'DUBAİ ÇİKOLATASI', cat: 'cikolata-ve-lokumlar' },
    { title: 'MEYVELI CAM KASELER', cat: 'tatlilar' },
    { title: 'FINDIKLI GÜLLAÇ', cat: 'tatlilar' },
    { title: 'FISTIKLI GÜLLAÇ', cat: 'tatlilar' },
    { title: 'KİLOLUK PROFİTEROL', cat: 'kiloluk-urunler' },
    { title: 'PETİFÜR ÇEŞİTLERİ', cat: 'paket-urunler' },
    { title: 'HAVUÇLU KEK', cat: 'kekler-ve-corekler' },
    { title: 'ISLAK KEK', cat: 'kekler-ve-corekler' },
    { title: 'MEKİK KEK', cat: 'kekler-ve-corekler' },
    { title: 'DEKORLU ÇİKOLATA', cat: 'cikolata-ve-lokumlar' },
    { title: 'SPESİYAL ÇİKOLATA', cat: 'cikolata-ve-lokumlar' },
    { title: 'ÇİKOLATİN', cat: 'cikolata-ve-lokumlar' },
    { title: 'MELODİ DUBAİ ÇİKOLATASI', cat: 'cikolata-ve-lokumlar' },
    { title: 'MELODİ KALPLİ ÇİKOLATA', cat: 'cikolata-ve-lokumlar' },
    { title: 'MELODİ ÇAKIL ÇİKOLATA', cat: 'cikolata-ve-lokumlar' },
    { title: 'MELODİ ŞEMSİYE ÇİKOLATA', cat: 'cikolata-ve-lokumlar' },
  ]

  // Kategorileri cacheleyelim
  const categoriesRes = await payload.find({ collection: 'categories', limit: 100 })
  const catMap = {}
  categoriesRes.docs.forEach(c => { catMap[c.slug] = c.id })

  let updateCount = 0
  for (const up of updates) {
    if (!catMap[up.cat]) {
      console.warn(`Kategori bulunamadı: ${up.cat}`)
      continue
    }

    const products = await payload.find({
      collection: 'products',
      where: { title: { equals: up.title } },
      draft: true,
      limit: 1
    })

    if (products.docs.length > 0) {
      const prod = products.docs[0]
      await payload.update({
        collection: 'products',
        id: prod.id,
        data: { category: catMap[up.cat] },
        draft: true
      })
      console.log(`✅ [${up.title}] -> ${up.cat}`)
      updateCount++
    } else {
      console.warn(`⚠️ Bulunamadı: ${up.title}`)
    }
  }

  console.log(`\n📦 ${updateCount} ürün kategorisi başarıyla taşındı.\n`)

  // TEK PASTALAR (eski ürün) pasife alma
  const oldTekPastalar = await payload.find({
    collection: 'products',
    where: { title: { equals: 'TEK PASTALAR' } },
    draft: true,
    limit: 1
  })

  if (oldTekPastalar.docs.length > 0) {
    const p = oldTekPastalar.docs[0]
    await payload.update({
      collection: 'products',
      id: p.id,
      data: {
        isActive: 'passive',
        _status: 'draft'
      },
      draft: true
    })
    console.log(`🗑️ Eski "TEK PASTALAR" ürünü pasife alındı ve yayından kaldırıldı (ID: ${p.id}).`)
  }

  // YENİ TEK PASTA ÜRÜNLERİNİ EKLEME
  const newProducts = [
    { title: 'Muzlu Tek Pasta', desc: 'Günlük taze üretilmiş enfes muzlu tek pasta.', slug: 'muzlu-tek-pasta' },
    { title: 'Çikolatalı Tek Pasta', desc: 'Yoğun çikolata lezzetiyle ustalarımızın ellerinden çıkan tek pasta.', slug: 'cikolatali-tek-pasta' },
    { title: 'Çilekli Tek Pasta', desc: 'Mevsimin en taze çilekleriyle hazırlanan hafif ve leziz tek pasta.', slug: 'cilekli-tek-pasta' },
    { title: 'Krokanlı Tek Pasta', desc: 'Krokanın çıtırlığı ile eşsiz kremanın buluştuğu tek pasta.', slug: 'krokanli-tek-pasta' },
  ]

  const tekPastalarCatId = catMap['tek-pastalar']
  if (!tekPastalarCatId) {
    console.error('HATA: "tek-pastalar" kategorisi bulunamadı, yeni ürünler eklenemedi.')
  } else {
    for (const p of newProducts) {
      // Zaten var mı kontrolü
      const existing = await payload.find({
        collection: 'products',
        where: { slug: { equals: p.slug } },
        draft: true,
        limit: 1
      })
      if (existing.docs.length > 0) {
        console.log(`ℹ️ [${p.title}] zaten mevcut.`)
        continue
      }

      await payload.create({
        collection: 'products',
        data: {
          title: p.title,
          slug: p.slug,
          price: 360,
          stock: 100,
          isActive: 'active',
          _status: 'published',
          category: tekPastalarCatId,
          description: p.desc,
          isSameDayEligible: true,
          leadTime: 2
        }
      })
      console.log(`✨ Yeni ürün oluşturuldu: ${p.title}`)
    }
  }

  console.log('\n🏁 Tüm işlemler tamamlandı.')
  process.exit(0)
}

main().catch(err => {
  console.error('Migration hatası:', err)
  process.exit(1)
})
