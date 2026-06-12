import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'
import path from 'path'

async function seed() {
  const payload = await getPayload({ config: configPromise })

  console.log('1. Temizlik Yapılıyor (Eski Ürünler ve Kategoriler Siliniyor)...')
  
  // Clean products
  const products = await payload.find({ collection: 'products', limit: 1000 })
  for (const doc of products.docs) {
    await payload.delete({ collection: 'products', id: doc.id })
  }

  // Clean categories
  const categories = await payload.find({ collection: 'categories', limit: 1000 })
  for (const doc of categories.docs) {
    await payload.delete({ collection: 'categories', id: doc.id })
  }

  console.log('2. Kategoriler Oluşturuluyor...')
  const cats = [
    'Börekler',
    'Kiloluk Ürünler',
    'Paket Ürünler',
    'Kekler ve Çörekler',
    'Tatlılar',
    'Pastalar',
    'Çikolata ve Lokumlar',
    'Hediyelikler'
  ]

  const catMap: Record<string, string> = {}
  for (const c of cats) {
    const created = await payload.create({
      collection: 'categories',
      data: {
        title: c,
      }
    })
    catMap[c] = created.id
  }

  console.log('3. Yapay Zeka (AI) Görselleri Vercel Blob\'a Yükleniyor...')
  const imgDir = '/Users/canalbayrak/.gemini/antigravity-ide/brain/19c77226-89db-4612-a33d-fd6890ebfb0a'
  
  const uploadImage = async (filename: string, alt: string) => {
    try {
      const media = await payload.create({
        collection: 'media',
        data: { alt },
        filePath: path.join(imgDir, filename)
      })
      return media.id
    } catch (e) {
      console.error(`Görsel yüklenemedi: ${filename}`, e)
      return null
    }
  }

  const images = {
    chocolate_cake: await uploadImage('chocolate_cake_1781266631609.png', 'Çikolatalı Pasta'),
    strawberry_cake: await uploadImage('strawberry_cake_1781266642148.png', 'Çilekli Pasta'),
    fruit_cake: await uploadImage('fruit_cake_1781266653193.png', 'Meyveli Pasta'),
    baklava: await uploadImage('baklava_pistachio_1781266664537.png', 'Fıstıklı Baklava'),
    su_boregi: await uploadImage('su_boregi_1781266674018.png', 'Su Böreği'),
    eclair: await uploadImage('eclair_1781266685151.png', 'Ekler'),
    macarons: await uploadImage('macarons_1781266697766.png', 'Makaron'),
    profiterole: await uploadImage('profiterole_1781266709358.png', 'Profiterol'),
    dubai_choc: await uploadImage('dubai_chocolate_1781266720549.png', 'Dubai Çikolatası'),
    assorted_choc: await uploadImage('assorted_chocolates_1781266730218.png', 'Spesiyal Çikolata'),
    sutlac: await uploadImage('sutlac_1781266770907.png', 'Sütlaç'),
    kurabiye: await uploadImage('kurabiye_1781266779925.png', 'Kurabiye'),
    gift_tray: await uploadImage('gift_tray_1781266790590.png', 'Hediyelik Tepsi'),
    cheesecake: await uploadImage('cheesecake_1781266801269.png', 'Cheesecake'),
    soguk_baklava: await uploadImage('soguk_baklava_1781266813453.png', 'Soğuk Baklava'),
  }

  console.log('4. Ürünler Ekleniyor...')

  const productsToCreate = [
    // BÖREKLER
    { title: 'Peynirli Kol Böreği (Kg)', price: 900, category: 'Börekler', image: images.su_boregi },
    { title: 'Patatesli Kol Böreği (Kg)', price: 900, category: 'Börekler', image: images.su_boregi },
    { title: 'Kıymalı Kol Böreği (Kg)', price: 900, category: 'Börekler', image: images.su_boregi },
    { title: 'Boşnak Böreği (Kg)', price: 900, category: 'Börekler', image: images.su_boregi },
    { title: 'Su Böreği (Kg)', price: 900, category: 'Börekler', image: images.su_boregi },
    { title: 'Kıymalı Adana Böreği (Kg)', price: 1100, category: 'Börekler', image: images.su_boregi },
    { title: 'Mini Sigara Böreği (Kg)', price: 1000, category: 'Börekler', image: images.su_boregi },
    { title: 'Yufka Böreği (Adet)', price: 70, category: 'Börekler', image: images.su_boregi },

    // KİLOLUK ÜRÜNLER
    { title: 'Cevizli Baklava (Kg)', price: 1350, category: 'Kiloluk Ürünler', image: images.baklava },
    { title: 'Vezir Parmağı (Kg)', price: 1350, category: 'Kiloluk Ürünler', image: images.baklava },
    { title: 'Ekler (Kg)', price: 1200, category: 'Kiloluk Ürünler', image: images.eclair },
    { title: 'Fındıklı Güllaç (Kg)', price: 800, category: 'Kiloluk Ürünler', image: images.soguk_baklava },
    { title: 'Fıstıklı Baklava (Kg)', price: 1750, category: 'Kiloluk Ürünler', image: images.baklava },
    { title: 'Fıstıklı Güllaç (Kg)', price: 950, category: 'Kiloluk Ürünler', image: images.soguk_baklava },
    { title: 'Havuç Dilim (Kg)', price: 1850, category: 'Kiloluk Ürünler', image: images.baklava },
    { title: 'Kiloluk Profiterol (Kg)', price: 1200, category: 'Kiloluk Ürünler', image: images.profiterole },
    { title: 'Küçük Pizza (Kg)', price: 1000, category: 'Kiloluk Ürünler', image: images.su_boregi },
    { title: 'Midye (Kg)', price: 2000, category: 'Kiloluk Ürünler', image: images.baklava },
    { title: 'Petifür Çeşitleri (Kg)', price: 1200, category: 'Kiloluk Ürünler', image: images.macarons },
    { title: 'Saray Sarması (Kg)', price: 1350, category: 'Kiloluk Ürünler', image: images.baklava },
    { title: 'Sarı Burma (Kg)', price: 1750, category: 'Kiloluk Ürünler', image: images.baklava },
    { title: 'Sütlü Nuriye (Kg)', price: 1350, category: 'Kiloluk Ürünler', image: images.soguk_baklava },
    { title: 'Şekerpare (Kg)', price: 800, category: 'Kiloluk Ürünler', image: images.sutlac },
    { title: 'Şöbiyet (Kg)', price: 1850, category: 'Kiloluk Ürünler', image: images.baklava },
    { title: 'Tatlı Kurabiye (Kg)', price: 1200, category: 'Kiloluk Ürünler', image: images.kurabiye },
    { title: 'Sakallı (Kg)', price: 1100, category: 'Kiloluk Ürünler', image: images.kurabiye },
    { title: 'Tel Kadayıf (Cevizli) (Kg)', price: 1350, category: 'Kiloluk Ürünler', image: images.baklava },
    { title: 'Tel Kadayıf (Fıstıklı) (Kg)', price: 1750, category: 'Kiloluk Ürünler', image: images.baklava },
    { title: 'Tuzlu Kurabiye (Kg)', price: 1000, category: 'Kiloluk Ürünler', image: images.kurabiye },
    { title: 'Soğuk Baklava (Kg)', price: 1500, category: 'Kiloluk Ürünler', image: images.soguk_baklava },

    // PAKET ÜRÜNLER
    { title: 'Acıbadem Büyük (Adet)', price: 200, category: 'Paket Ürünler', image: images.kurabiye },
    { title: 'Acıbadem Küçük (Paket)', price: 300, category: 'Paket Ürünler', image: images.kurabiye },
    { title: 'Anasonlu Galet (Paket)', price: 200, category: 'Paket Ürünler', image: images.kurabiye },
    { title: 'Anasonlu Gevrek (Paket)', price: 200, category: 'Paket Ürünler', image: images.kurabiye },
    { title: 'Batonsale (Paket)', price: 200, category: 'Paket Ürünler', image: images.kurabiye },
    { title: 'Beze (Paket)', price: 200, category: 'Paket Ürünler', image: images.kurabiye },
    { title: 'Biskotti (Paket)', price: 275, category: 'Paket Ürünler', image: images.kurabiye },
    { title: 'Çekirdekli Galet (Paket)', price: 200, category: 'Paket Ürünler', image: images.kurabiye },
    { title: 'Çekirdekli Yaprak Gevrek (Paket)', price: 275, category: 'Paket Ürünler', image: images.kurabiye },
    { title: 'Grissini (Paket)', price: 200, category: 'Paket Ürünler', image: images.kurabiye },
    { title: 'Japonex (Paket)', price: 275, category: 'Paket Ürünler', image: images.kurabiye },
    { title: 'Kaşarlı Galet (Paket)', price: 275, category: 'Paket Ürünler', image: images.kurabiye },
    { title: 'Kırıkkırak (Paket)', price: 200, category: 'Paket Ürünler', image: images.kurabiye },
    { title: 'Selanik Gevreği (Paket)', price: 275, category: 'Paket Ürünler', image: images.kurabiye },
    { title: 'Zeytinli Gevrek (Paket)', price: 200, category: 'Paket Ürünler', image: images.kurabiye },

    // KEKLER VE ÇÖREKLER
    { title: 'Çatal (Adet)', price: 40, category: 'Kekler ve Çörekler', image: images.kurabiye },
    { title: 'Ay Çöreği (Adet)', price: 60, category: 'Kekler ve Çörekler', image: images.kurabiye },
    { title: 'Un Kurabiyesi (Kg)', price: 800, category: 'Kekler ve Çörekler', image: images.kurabiye },
    { title: 'İran Poğaçası (Adet)', price: 165, category: 'Kekler ve Çörekler', image: images.kurabiye },
    { title: 'Emili (Adet)', price: 165, category: 'Kekler ve Çörekler', image: images.kurabiye },
    { title: 'Ponçik (Adet)', price: 140, category: 'Kekler ve Çörekler', image: images.kurabiye },
    { title: 'Prüzyen (Adet)', price: 165, category: 'Kekler ve Çörekler', image: images.kurabiye },
    { title: 'Cupcake (Adet)', price: 200, category: 'Kekler ve Çörekler', image: images.eclair },
    { title: 'Tahinli Çörek (Adet)', price: 200, category: 'Kekler ve Çörekler', image: images.kurabiye },
    { title: 'Islak Kek (Adet)', price: 750, category: 'Kekler ve Çörekler', image: images.chocolate_cake },
    { title: 'Havuçlu Kek (Adet)', price: 750, category: 'Kekler ve Çörekler', image: images.fruit_cake },
    { title: 'Mekik Kek (Kg)', price: 1350, category: 'Kekler ve Çörekler', image: images.kurabiye },
    { title: 'Makaron (Kg)', price: 2000, category: 'Kekler ve Çörekler', image: images.macarons },

    // TATLILAR
    { title: 'Aşure', price: 375, category: 'Tatlılar', image: images.sutlac },
    { title: 'Kazandibi', price: 275, category: 'Tatlılar', image: images.sutlac },
    { title: 'Keşkül', price: 275, category: 'Tatlılar', image: images.sutlac },
    { title: 'Meyveli Cam Kaseler', price: 325, category: 'Tatlılar', image: images.sutlac },
    { title: 'Profiterol', price: 300, category: 'Tatlılar', image: images.profiterole },
    { title: 'Supangle', price: 275, category: 'Tatlılar', image: images.profiterole },
    { title: 'Sütlaç', price: 275, category: 'Tatlılar', image: images.sutlac },
    { title: 'Tavuk Göğsü', price: 275, category: 'Tatlılar', image: images.sutlac },
    { title: 'Magnolya', price: 325, category: 'Tatlılar', image: images.sutlac },

    // ÇİKOLATALAR VE LOKUMLAR
    { title: 'Dekorlu Çikolata (Kg)', price: 4750, category: 'Çikolata ve Lokumlar', image: images.assorted_choc },
    { title: 'Drajeler (Kg)', price: 2750, category: 'Çikolata ve Lokumlar', image: images.assorted_choc },
    { title: 'Madlen Çikolata (Kg)', price: 2750, category: 'Çikolata ve Lokumlar', image: images.assorted_choc },
    { title: 'Spesiyal Çikolata (Kg)', price: 3250, category: 'Çikolata ve Lokumlar', image: images.assorted_choc },
    { title: 'Yaldızlı Çikolata (Kg)', price: 3500, category: 'Çikolata ve Lokumlar', image: images.assorted_choc },
    { title: 'Altın ve Gümüş Draje (Kg)', price: 5000, category: 'Çikolata ve Lokumlar', image: images.assorted_choc },
    { title: 'Melodi Dubai Çikolatası (Adet)', price: 350, category: 'Çikolata ve Lokumlar', image: images.dubai_choc },
    { title: 'Melodi Kalpli Çikolata (Adet)', price: 150, category: 'Çikolata ve Lokumlar', image: images.assorted_choc },
    { title: 'Melodi Şemsiye Çikolata (Adet)', price: 110, category: 'Çikolata ve Lokumlar', image: images.assorted_choc },
    { title: 'Melodi Çakıl Çikolata (Adet)', price: 100, category: 'Çikolata ve Lokumlar', image: images.assorted_choc },
    { title: 'Çikolatin (Kg)', price: 2200, category: 'Çikolata ve Lokumlar', image: images.assorted_choc },
    { title: 'Yaldızlı Madlen (Kg)', price: 2850, category: 'Çikolata ve Lokumlar', image: images.assorted_choc },
    { title: 'Baston Şeker (Adet)', price: 60, category: 'Çikolata ve Lokumlar', image: images.assorted_choc },

    // HEDİYELİKLER
    { title: 'Tepsi Büyük', price: 2000, category: 'Hediyelikler', image: images.gift_tray },
    { title: 'Tepsi Küçük', price: 2000, category: 'Hediyelikler', image: images.gift_tray },
    { title: 'Pleksi', price: 80, category: 'Hediyelikler', image: images.gift_tray },
    { title: 'Uzun Mumlar (Adet)', price: 60, category: 'Hediyelikler', image: images.gift_tray },
    { title: 'Yazılı Mumlar', price: 80, category: 'Hediyelikler', image: images.gift_tray },
    { title: 'Rakamlı Mumlar', price: 80, category: 'Hediyelikler', image: images.gift_tray },
  ]

  for (const p of productsToCreate) {
    await payload.create({
      collection: 'products',
      data: {
        title: p.title,
        price: p.price,
        category: catMap[p.category],
        hasSizes: false,
        stock: 100,
        images: p.image ? [p.image] : [],
      }
    })
    console.log(`Eklendi: ${p.title}`)
  }

  console.log('5. PASTALAR Ekleniyor (Varyasyonlu: 0, 1, 2 Numara)...')

  const cakeVariations = [
    { title: 'Çikolatalı Yaş Pasta', image: images.chocolate_cake },
    { title: 'Meyveli Yaş Pasta', image: images.fruit_cake },
    { title: 'Muzlu & Fıstıklı Yaş Pasta', image: images.chocolate_cake },
    { title: 'Krokanlı Yaş Pasta', image: images.chocolate_cake },
    { title: 'Çilekli Yaş Pasta', image: images.strawberry_cake },
    { title: 'Profiterollü Yaş Pasta', image: images.chocolate_cake },
  ]

  for (const c of cakeVariations) {
    await payload.create({
      collection: 'products',
      data: {
        title: c.title,
        category: catMap['Pastalar'],
        hasSizes: true,
        sizes: [
          { size: '0 Numara', price: 1250 },
          { size: '1 Numara', price: 1600 },
          { size: '2 Numara', price: 1850 },
        ],
        stock: 100,
        images: c.image ? [c.image] : [],
      }
    })
    console.log(`Eklendi: ${c.title} (Varyasyonlu)`)
  }

  const otherCakes = [
    { title: 'Tek Pastalar', price: 300, image: images.strawberry_cake },
    { title: 'Hamur Kaplama Tek Pasta', price: 480, image: images.fruit_cake },
    { title: 'Milföy', price: 300, image: images.cheesecake },
    { title: 'Muzlu Rulo', price: 275, image: images.fruit_cake },
    { title: 'Traliçe', price: 275, image: images.cheesecake },
    { title: 'Cheesecake (Dilim)', price: 325, image: images.cheesecake },
    { title: 'Dubai Çikolatası (Pasta)', price: 500, image: images.dubai_choc },
  ]
  for (const c of otherCakes) {
    await payload.create({
      collection: 'products',
      data: {
        title: c.title,
        price: c.price,
        category: catMap['Pastalar'],
        hasSizes: false,
        stock: 100,
        images: c.image ? [c.image] : [],
      }
    })
    console.log(`Eklendi: ${c.title}`)
  }

  console.log('TÜM İŞLEMLER BAŞARIYLA TAMAMLANDI!')
  process.exit(0)
}

seed().catch(console.error)
