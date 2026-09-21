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

// Data Definition
const productsToSeed = [
  // --- TEK PASTALAR (360 TL) ---
  ...["KARIŞIK MEYVELİ TEK PASTA", "ORMAN MEYVELİ TEK PASTA", "FISTIK ÇİKOLATALI TEK PASTA", 
      "FRAMBUAZLI TEK PASTA", "FRAMBUAZ ÇİKOLATALI TEK PASTA", "LOTUSLU TEK PASTA", 
      "MUZ ÇİKOLATALI TEK PASTA", "IBIZA MUZLU", "IBIZA ÇİLEKLİ", "ÇİLEKLİ RULO PASTA", 
      "ŞEKER HAMURLU TEK PASTA"
  ].map(name => ({
    title: name, categoryTitle: 'TEK PASTALAR', price: 360, hasSizes: false, sizes: []
  })),

  // --- SÜTLÜ TATLILAR & CHEESECAKE ---
  { title: 'TAVUKGÖĞSÜ', categoryTitle: 'SÜTLÜ TATLILAR', price: 325, hasSizes: false, sizes: [] },
  { title: 'MUHALLEBİ', categoryTitle: 'SÜTLÜ TATLILAR', price: 325, hasSizes: false, sizes: [] },
  { title: 'ALAÇATI MUHALLEBİSİ', categoryTitle: 'SÜTLÜ TATLILAR', price: 375, hasSizes: false, sizes: [] },
  { title: 'ÇİLEKLİ MAGNOLYA', categoryTitle: 'SÜTLÜ TATLILAR', price: 375, hasSizes: false, sizes: [] },
  { title: 'MUZLU ÇİKOLATALI MAGNOLYA', categoryTitle: 'SÜTLÜ TATLILAR', price: 375, hasSizes: false, sizes: [] },
  { title: 'SPOONFUL', categoryTitle: 'SÜTLÜ TATLILAR', price: 375, hasSizes: false, sizes: [] },
  ...["LOTUSLU CHEESECAKE", "LİMONLU CHEESECAKE", "FRAMBUAZLI CHEESECAKE", "DUBAI CHEESECAKE"].map(name => ({
    title: name, categoryTitle: 'SÜTLÜ TATLILAR', price: 400, hasSizes: false, sizes: []
  })),

  // --- PETİFÜRLER --- (Porsiyon 350, 500g 700, 1Kg 1400)
  ...[
    "KROKANLI PETİFÜRLER", "MUZLU ÇİKOLATALI PETİFÜRLER", "MİNİ MUZLU RULO", "MİNİ KROKANLI RULO", 
    "MİNİ ÇİLEKLİ RULO", "ÇİLEKLİ TARTOLET", "MİNİ İBİZA ÇİLEKLİ", "MİNİ İBİZA MUZLU", 
    "MİNİ CHEESECAKE", "EKLER ÇİKOLATA KREMA", "MİNİ SÜT BURGERLER"
  ].map(name => ({
    title: name, categoryTitle: 'PETİFÜRLER', price: 0, hasSizes: true, sizes: [
      { size: 'Porsiyon', price: 350 },
      { size: '500 Gram', price: 700 },
      { size: '1 Kilogram', price: 1400 },
    ]
  })),

  // --- YAŞ PASTALAR --- (0 No 1450, 1 No 1850, 2 No 2150)
  ...[
    "ÇİLEK ÇİKOLATALI", "ÇİLEKLİ PROFİTEROL SOSLU", "GANAJ", "FISTIK ÇİKOLATALI", "FISTIKLI MUZLU", 
    "KARIŞIK MEYVELİ", "ORMAN MEYVELİ", "FRAMBUAZLI", "FRAMBUAZ ÇİKOLATALI", "FRAMBUAZ MUZLU", 
    "PROFİTEROLLÜ", "LOTUS ÇİLEKLİ", "MUZ ÇİKOLATALI"
  ].map(name => ({
    title: name, categoryTitle: 'YAŞ PASTALAR', price: 0, hasSizes: true, hasNumberSelection: true, sizes: [
      { size: '0 Numara', price: 1450 },
      { size: '1 Numara', price: 1850 },
      { size: '2 Numara', price: 2150 },
    ]
  })),

  // --- ŞERBETLİ & BÖREKLER ---
  {
    title: 'CEVİZLİ EV BAKLAVASI', categoryTitle: 'ŞERBETLİ TATLILAR', price: 0, hasSizes: true, sizes: [
      { size: '1 Kilogram', price: 1600 }, { size: '500 Gram', price: 800 }, { size: '250 Gram', price: 400 }
    ]
  },
  {
    title: 'FISTIKLI TEL KADAYIF', categoryTitle: 'ŞERBETLİ TATLILAR', price: 0, hasSizes: true, sizes: [
      { size: '1 Kilogram', price: 2150 }, { size: '500 Gram', price: 1075 }, { size: '250 Gram', price: 537.5 }
    ]
  },
  {
    title: 'FINDIKLI ŞEKERPARE', categoryTitle: 'ŞERBETLİ TATLILAR', price: 0, hasSizes: true, sizes: [
      { size: '1 Kilogram', price: 950 }, { size: '500 Gram', price: 475 }, { size: '250 Gram', price: 237.5 }
    ]
  },
  {
    title: 'YALOVA SÜTLÜSÜ', categoryTitle: 'ŞERBETLİ TATLILAR', price: 0, hasSizes: true, sizes: [
      { size: '1 Kilogram', price: 1600 }, { size: '500 Gram', price: 800 }, { size: '250 Gram', price: 400 }
    ]
  },
  {
    title: 'KARIŞIK TATLI KURABİYE', categoryTitle: 'ŞERBETLİ TATLILAR', price: 0, hasSizes: true, sizes: [
      { size: '1 Kilogram', price: 1450 }, { size: '500 Gram', price: 725 }, { size: '250 Gram', price: 362.5 }
    ]
  },
  {
    title: 'KARIŞIK TUZLU KURABİYE', categoryTitle: 'ŞERBETLİ TATLILAR', price: 0, hasSizes: true, sizes: [
      { size: '1 Kilogram', price: 1200 }, { size: '500 Gram', price: 600 }, { size: '250 Gram', price: 300 }
    ]
  },
  {
    title: 'MİNİ PİZZALAR', categoryTitle: 'ŞERBETLİ TATLILAR', price: 0, hasSizes: true, sizes: [
      { size: '1 Kilogram', price: 1200 }, { size: '500 Gram', price: 600 }, { size: '250 Gram', price: 300 }
    ]
  }
];

const run = async () => {
  await payload.init({ config, local: true })

  // Tüm kategorileri çek
  const categoriesRes = await payload.find({ collection: 'categories' as any, limit: 100 })
  const getCatId = (title: string) => categoriesRes.docs.find((c: any) => c.title === title)?.id

  for (const item of productsToSeed) {
    const categoryId = getCatId(item.categoryTitle)
    if (!categoryId) {
      console.log(`Kategori bulunamadı: ${item.categoryTitle} - Ürün atlanıyor: ${item.title}`)
      continue
    }

    const itemSlug = turkishLower(item.title).replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')

    // Veritabanında ürün var mı kontrol et
    const existing = await payload.find({
      collection: 'products' as any,
      where: { slug: { equals: itemSlug } }
    })

    const productData = {
      title: item.title,
      slug: itemSlug,
      category: categoryId,
      price: item.price,
      hasSizes: item.hasSizes,
      hasNumberSelection: item.hasNumberSelection || false,
      sizes: item.sizes,
      isActive: 'active'
    }

    if (existing.docs.length > 0) {
      // Güncelle
      await payload.update({
        collection: 'products' as any,
        id: existing.docs[0].id,
        data: productData
      })
      console.log(`Güncellendi: ${item.title}`)
    } else {
      // Oluştur
      await payload.create({
        collection: 'products' as any,
        data: productData
      })
      console.log(`Oluşturuldu: ${item.title}`)
    }
  }

  console.log('Fiyat ve Ürün ekleme/güncelleme başarıyla tamamlandı.')
  process.exit(0)
}

run()
