import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'
import fs from 'fs'
import path from 'path'
import https from 'https'
import os from 'os'

const downloadImage = (url: string, dest: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    https.get(url, (response) => {
      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve()
      })
    }).on('error', (err) => {
      fs.unlink(dest, () => {})
      reject(err)
    })
  })
}

const usedImageIds = new Set<string>()

async function fetchUnsplashImage(query: string): Promise<string | null> {
  const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=10`
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          if (json.results && json.results.length > 0) {
            for (const img of json.results) {
              if (!usedImageIds.has(img.id)) {
                usedImageIds.add(img.id)
                resolve(img.urls.regular)
                return
              }
            }
          }
          resolve(null)
        } catch (e) {
          resolve(null)
        }
      })
    }).on('error', () => resolve(null))
  })
}

async function seed() {
  const payload = await getPayload({ config: configPromise })

  console.log('1. Temizlik Yapılıyor (Eski Ürünler, Kategoriler ve Medyalar Siliniyor)...')
  
  const products = await payload.find({ collection: 'products', limit: 1000 })
  for (const doc of products.docs) {
    await payload.delete({ collection: 'products', id: doc.id })
  }

  const categories = await payload.find({ collection: 'categories', limit: 1000 })
  for (const doc of categories.docs) {
    await payload.delete({ collection: 'categories', id: doc.id })
  }
  
  // Media is kept intact to preserve UI assets.

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
      data: { title: c }
    })
    catMap[c] = created.id
  }

  console.log('3. Ürünler ve Unsplash Görselleri Yükleniyor...')

  const uploadAndGetMediaId = async (query: string, filename: string): Promise<string | null> => {
    try {
      const imgUrl = await fetchUnsplashImage(query)
      if (!imgUrl) return null
      
      const tmpPath = path.join(os.tmpdir(), filename)
      await downloadImage(imgUrl, tmpPath)
      
      const media = await payload.create({
        collection: 'media',
        data: { alt: query },
        filePath: tmpPath
      })
      
      fs.unlinkSync(tmpPath)
      return media.id
    } catch (e) {
      console.error(`Görsel hatası (${query}):`, e)
      return null
    }
  }

  const productsToCreate = [
    // BÖREKLER
    { title: 'Peynirli Kol Böreği (Kg)', price: 900, category: 'Börekler', query: 'cheese pastry' },
    { title: 'Patatesli Kol Böreği (Kg)', price: 900, category: 'Börekler', query: 'potato pastry' },
    { title: 'Kıymalı Kol Böreği (Kg)', price: 900, category: 'Börekler', query: 'meat pie pastry' },
    { title: 'Boşnak Böreği (Kg)', price: 900, category: 'Börekler', query: 'balkan pastry burek' },
    { title: 'Su Böreği (Kg)', price: 900, category: 'Börekler', query: 'turkish su boregi' },
    { title: 'Kıymalı Adana Böreği (Kg)', price: 1100, category: 'Börekler', query: 'turkish meat pastry' },
    { title: 'Mini Sigara Böreği (Kg)', price: 1000, category: 'Börekler', query: 'fried spring roll' },
    { title: 'Yufka Böreği (Adet)', price: 70, category: 'Börekler', query: 'phyllo pastry baked' },

    // KİLOLUK ÜRÜNLER
    { title: 'Cevizli Baklava (Kg)', price: 1350, category: 'Kiloluk Ürünler', query: 'walnut baklava' },
    { title: 'Vezir Parmağı (Kg)', price: 1350, category: 'Kiloluk Ürünler', query: 'turkish dessert syrup' },
    { title: 'Ekler (Kg)', price: 1200, category: 'Kiloluk Ürünler', query: 'chocolate eclair' },
    { title: 'Fındıklı Güllaç (Kg)', price: 800, category: 'Kiloluk Ürünler', query: 'gullac milk dessert' },
    { title: 'Fıstıklı Baklava (Kg)', price: 1750, category: 'Kiloluk Ürünler', query: 'pistachio baklava' },
    { title: 'Fıstıklı Güllaç (Kg)', price: 950, category: 'Kiloluk Ürünler', query: 'pistachio milk dessert' },
    { title: 'Havuç Dilim (Kg)', price: 1850, category: 'Kiloluk Ürünler', query: 'large slice baklava' },
    { title: 'Kiloluk Profiterol (Kg)', price: 1200, category: 'Kiloluk Ürünler', query: 'profiteroles dessert bowl' },
    { title: 'Küçük Pizza (Kg)', price: 1000, category: 'Kiloluk Ürünler', query: 'mini pizza bakery' },
    { title: 'Midye (Kg)', price: 2000, category: 'Kiloluk Ürünler', query: 'midye baklava' },
    { title: 'Petifür Çeşitleri (Kg)', price: 1200, category: 'Kiloluk Ürünler', query: 'petit fours dessert' },
    { title: 'Saray Sarması (Kg)', price: 1350, category: 'Kiloluk Ürünler', query: 'turkish delight roll' },
    { title: 'Sarı Burma (Kg)', price: 1750, category: 'Kiloluk Ürünler', query: 'burma baklava' },
    { title: 'Sütlü Nuriye (Kg)', price: 1350, category: 'Kiloluk Ürünler', query: 'milky baklava' },
    { title: 'Şekerpare (Kg)', price: 800, category: 'Kiloluk Ürünler', query: 'sekerpare dessert' },
    { title: 'Şöbiyet (Kg)', price: 1850, category: 'Kiloluk Ürünler', query: 'sobiyet baklava' },
    { title: 'Tatlı Kurabiye (Kg)', price: 1200, category: 'Kiloluk Ürünler', query: 'sweet cookies plate' },
    { title: 'Sakallı (Kg)', price: 1100, category: 'Kiloluk Ürünler', query: 'mini sandwich pastry' },
    { title: 'Tel Kadayıf (Cevizli) (Kg)', price: 1350, category: 'Kiloluk Ürünler', query: 'kadayif dessert' },
    { title: 'Tel Kadayıf (Fıstıklı) (Kg)', price: 1750, category: 'Kiloluk Ürünler', query: 'pistachio kadayif' },
    { title: 'Tuzlu Kurabiye (Kg)', price: 1000, category: 'Kiloluk Ürünler', query: 'salty biscuits' },
    { title: 'Soğuk Baklava (Kg)', price: 1500, category: 'Kiloluk Ürünler', query: 'cold baklava chocolate' },

    // PAKET ÜRÜNLER
    { title: 'Acıbadem Büyük (Adet)', price: 200, category: 'Paket Ürünler', query: 'almond macaroon' },
    { title: 'Acıbadem Küçük (Paket)', price: 300, category: 'Paket Ürünler', query: 'small almond cookies' },
    { title: 'Anasonlu Galet (Paket)', price: 200, category: 'Paket Ürünler', query: 'anise stick bread' },
    { title: 'Anasonlu Gevrek (Paket)', price: 200, category: 'Paket Ürünler', query: 'anise crisp biscuit' },
    { title: 'Batonsale (Paket)', price: 200, category: 'Paket Ürünler', query: 'salty sticks pastry' },
    { title: 'Beze (Paket)', price: 200, category: 'Paket Ürünler', query: 'meringue cookies' },
    { title: 'Biskotti (Paket)', price: 275, category: 'Paket Ürünler', query: 'biscotti' },
    { title: 'Çekirdekli Galet (Paket)', price: 200, category: 'Paket Ürünler', query: 'sunflower seed breadsticks' },
    { title: 'Çekirdekli Yaprak Gevrek (Paket)', price: 275, category: 'Paket Ürünler', query: 'seed crispbread' },
    { title: 'Grissini (Paket)', price: 200, category: 'Paket Ürünler', query: 'grissini sticks' },
    { title: 'Japonex (Paket)', price: 275, category: 'Paket Ürünler', query: 'sesame sticks biscuit' },
    { title: 'Kaşarlı Galet (Paket)', price: 275, category: 'Paket Ürünler', query: 'cheese breadsticks' },
    { title: 'Kırıkkırak (Paket)', price: 200, category: 'Paket Ürünler', query: 'pretzel sticks' },
    { title: 'Selanik Gevreği (Paket)', price: 275, category: 'Paket Ürünler', query: 'biscotti almonds' },
    { title: 'Zeytinli Gevrek (Paket)', price: 200, category: 'Paket Ürünler', query: 'olive crackers' },

    // KEKLER VE ÇÖREKLER
    { title: 'Çatal (Adet)', price: 40, category: 'Kekler ve Çörekler', query: 'turkish catal pastry' },
    { title: 'Ay Çöreği (Adet)', price: 60, category: 'Kekler ve Çörekler', query: 'crescent roll pastry' },
    { title: 'Un Kurabiyesi (Kg)', price: 800, category: 'Kekler ve Çörekler', query: 'flour cookies powder sugar' },
    { title: 'İran Poğaçası (Adet)', price: 165, category: 'Kekler ve Çörekler', query: 'stuffed sweet bun' },
    { title: 'Emili (Adet)', price: 165, category: 'Kekler ve Çörekler', query: 'soft pastry bun' },
    { title: 'Ponçik (Adet)', price: 140, category: 'Kekler ve Çörekler', query: 'donuts cream filled' },
    { title: 'Prüzyen (Adet)', price: 165, category: 'Kekler ve Çörekler', query: 'braided sweet pastry' },
    { title: 'Cupcake (Adet)', price: 200, category: 'Kekler ve Çörekler', query: 'fancy cupcake' },
    { title: 'Tahinli Çörek (Adet)', price: 200, category: 'Kekler ve Çörekler', query: 'tahini roll pastry' },
    { title: 'Islak Kek (Adet)', price: 750, category: 'Kekler ve Çörekler', query: 'moist chocolate cake' },
    { title: 'Havuçlu Kek (Adet)', price: 750, category: 'Kekler ve Çörekler', query: 'carrot cake slice' },
    { title: 'Mekik Kek (Kg)', price: 1350, category: 'Kekler ve Çörekler', query: 'almond financier cake' },
    { title: 'Makaron (Kg)', price: 2000, category: 'Kekler ve Çörekler', query: 'colorful macarons' },

    // TATLILAR
    { title: 'Aşure', price: 375, category: 'Tatlılar', query: 'asure noahs pudding' },
    { title: 'Kazandibi', price: 275, category: 'Tatlılar', query: 'kazandibi dessert' },
    { title: 'Keşkül', price: 275, category: 'Tatlılar', query: 'almond milk pudding' },
    { title: 'Meyveli Cam Kaseler', price: 325, category: 'Tatlılar', query: 'fruit trifle glass' },
    { title: 'Profiterol', price: 300, category: 'Tatlılar', query: 'profiteroles chocolate' },
    { title: 'Supangle', price: 275, category: 'Tatlılar', query: 'chocolate pudding bowl' },
    { title: 'Sütlaç', price: 275, category: 'Tatlılar', query: 'rice pudding baked' },
    { title: 'Tavuk Göğsü', price: 275, category: 'Tatlılar', query: 'turkish milk dessert' },
    { title: 'Magnolya', price: 325, category: 'Tatlılar', query: 'magnolia dessert jar' },

    // ÇİKOLATALAR VE LOKUMLAR
    { title: 'Dekorlu Çikolata (Kg)', price: 4750, category: 'Çikolata ve Lokumlar', query: 'decorated chocolates luxury' },
    { title: 'Drajeler (Kg)', price: 2750, category: 'Çikolata ve Lokumlar', query: 'chocolate dragees' },
    { title: 'Madlen Çikolata (Kg)', price: 2750, category: 'Çikolata ve Lokumlar', query: 'madeline chocolates' },
    { title: 'Spesiyal Çikolata (Kg)', price: 3250, category: 'Çikolata ve Lokumlar', query: 'special artisan chocolates' },
    { title: 'Yaldızlı Çikolata (Kg)', price: 3500, category: 'Çikolata ve Lokumlar', query: 'gold foil chocolates' },
    { title: 'Altın ve Gümüş Draje (Kg)', price: 5000, category: 'Çikolata ve Lokumlar', query: 'gold silver chocolate dragees' },
    { title: 'Melodi Dubai Çikolatası (Adet)', price: 350, category: 'Çikolata ve Lokumlar', query: 'pistachio knafeh chocolate bar' },
    { title: 'Melodi Kalpli Çikolata (Adet)', price: 150, category: 'Çikolata ve Lokumlar', query: 'heart shaped chocolate' },
    { title: 'Melodi Şemsiye Çikolata (Adet)', price: 110, category: 'Çikolata ve Lokumlar', query: 'umbrella chocolate' },
    { title: 'Melodi Çakıl Çikolata (Adet)', price: 100, category: 'Çikolata ve Lokumlar', query: 'chocolate pebbles' },
    { title: 'Çikolatin (Kg)', price: 2200, category: 'Çikolata ve Lokumlar', query: 'chocolatine candy' },
    { title: 'Yaldızlı Madlen (Kg)', price: 2850, category: 'Çikolata ve Lokumlar', query: 'wrapped madeline chocolate' },
    { title: 'Baston Şeker (Adet)', price: 60, category: 'Çikolata ve Lokumlar', query: 'candy cane' },

    // HEDİYELİKLER
    { title: 'Tepsi Büyük', price: 2000, category: 'Hediyelikler', query: 'large silver gift tray' },
    { title: 'Tepsi Küçük', price: 2000, category: 'Hediyelikler', query: 'small gift tray chocolates' },
    { title: 'Pleksi', price: 80, category: 'Hediyelikler', query: 'clear acrylic box' },
    { title: 'Uzun Mumlar (Adet)', price: 60, category: 'Hediyelikler', query: 'long birthday candles' },
    { title: 'Yazılı Mumlar', price: 80, category: 'Hediyelikler', query: 'happy birthday text candle' },
    { title: 'Rakamlı Mumlar', price: 80, category: 'Hediyelikler', query: 'number birthday candle' },
    
    // DİĞER PASTALAR
    { title: 'Tek Pastalar', price: 300, category: 'Pastalar', query: 'mini individual cake' },
    { title: 'Hamur Kaplama Tek Pasta', price: 480, category: 'Pastalar', query: 'fondant mini cake' },
    { title: 'Milföy', price: 300, category: 'Pastalar', query: 'mille feuille pastry' },
    { title: 'Muzlu Rulo', price: 275, category: 'Pastalar', query: 'banana swiss roll cake' },
    { title: 'Traliçe', price: 275, category: 'Pastalar', query: 'tres leches cake' },
    { title: 'Cheesecake (Dilim)', price: 325, category: 'Pastalar', query: 'cheesecake slice' },
    { title: 'Dubai Çikolatası (Pasta)', price: 500, category: 'Pastalar', query: 'pistachio chocolate cake slice' },
  ]

  let idx = 1;
  for (const p of productsToCreate) {
    const mediaId = await uploadAndGetMediaId(p.query, `img_${Date.now()}.jpg`)
    await payload.create({
      collection: 'products',
      data: {
        title: p.title,
        price: p.price,
        category: catMap[p.category],
        hasSizes: false,
        stock: 100,
        images: mediaId ? [mediaId] : [],
      }
    })
    console.log(`[${idx}/${productsToCreate.length}] Eklendi: ${p.title} (Unsplash: ${p.query})`)
    idx++
  }

  console.log('4. DEV PASTA VARYASYONLARI EKLENİYOR (0, 1, 2 Numara)...')

  const cakeVariations = [
    { title: 'Çikolatalı Yaş Pasta', query: 'chocolate layer cake' },
    { title: 'Meyveli Yaş Pasta', query: 'mixed fruit tart cake' },
    { title: 'Muzlu & Fıstıklı Yaş Pasta', query: 'banana pistachio cake' },
    { title: 'Krokanlı Yaş Pasta', query: 'caramel crunch cake' },
    { title: 'Çilekli Yaş Pasta', query: 'strawberry shortcake' },
    { title: 'Profiterollü Yaş Pasta', query: 'profiterole cake' },
    { title: 'Orman Meyveli Yaş Pasta', query: 'forest berry cake' },
    { title: 'Karamelli Yaş Pasta', query: 'caramel drip cake' },
    { title: 'Fıstık Şöleni Yaş Pasta', query: 'green pistachio cake' },
    { title: 'Beyaz Çikolatalı Yaş Pasta', query: 'white chocolate cake' },
    { title: 'Karışık Çikolatalı Yaş Pasta', query: 'triple chocolate cake' },
    { title: 'Kestaneli Yaş Pasta', query: 'chestnut cream cake' },
    { title: 'Bademli Yaş Pasta', query: 'almond slice cake' },
    { title: 'Frambuazlı Yaş Pasta', query: 'raspberry mousse cake' },
    { title: 'Tiramisu Yaş Pasta', query: 'tiramisu cake' },
    { title: 'Kara Orman Pastası', query: 'black forest cake' },
    { title: 'Red Velvet Yaş Pasta', query: 'red velvet cake' },
    { title: 'Limonlu Yaş Pasta', query: 'lemon meringue cake' },
    { title: 'Bisküvili Yaş Pasta', query: 'biscuit cake' },
    { title: 'Lotus Biscoff Yaş Pasta', query: 'lotus biscoff cake' },
  ]

  for (const c of cakeVariations) {
    const mediaId = await uploadAndGetMediaId(c.query, `cake_${Date.now()}.jpg`)
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
        images: mediaId ? [mediaId] : [],
      }
    })
    console.log(`Varyasyonlu Eklendi: ${c.title} (Unsplash: ${c.query})`)
  }

  console.log('TÜM İŞLEMLER BAŞARIYLA TAMAMLANDI!')
  process.exit(0)
}

seed().catch(console.error)
