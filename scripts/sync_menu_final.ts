import 'dotenv/config'
import payload from 'payload'
import config from '../src/payload.config'
import fs from 'fs'

const docxData = {
  "TEK PASTALAR": [
    "ÇİLEKLİ TEK PASTA",
    "ÇİLEK ÇİKOLATALI TEK PASTA",
    "KARIŞIK MEYVELİ TEK PASTA",
    "ORMAN MEYVELİ TEK PASTA",
    "FISTIK ÇİKOLATALI TEK PASTA",
    "FRAMBUAZLI TEK PASTA",
    "FRAMBUAZ ÇİKOLATALI TEK PASTA",
    "LOTUSLU TEK PASTA",
    "MUZLU TEK PASTA",
    "MUZ ÇİKOLATALI TEK PASTA",
    "IBIZA MUZLU",
    "IBIZA ÇİLEKLİ",
    "MUZLU RULO PASTA",
    "ÇİLEKLİ RULO PASTA",
    "KROKANLI TEK PASTA",
    "MİLFÖY",
    "ŞEKER HAMURLU TEK PASTA"
  ],
  "SÜTLÜ TATLILAR": [
    "KAZANDİBİ", "TAVUKGÖĞSÜ", "SÜTLAÇ", "KEŞKÜL", "MUHALLEBİ", "ALAÇATI MUHALLEBİSİ", 
    "ORMAN MEYVELİ MAGNOLYA", "ÇİLEKLİ MAGNOLYA", "MUZLU ÇİKOLATALI MAGNOLYA", 
    "SPOONFUL", "SUPANGLE", "PROFİTEROL", "TRALİÇE", "AŞURE",
    "LOTUSLU CHEESECAKE", "LİMONLU CHEESECAKE", "FRAMBUAZLI CHEESECAKE", "DUBAI CHEESECAKE"
  ],
  "PETİFÜRLER": [
    "KROKANLI PETİFÜRLER", "MUZLU ÇİKOLATALI PETİFÜRLER", "MİNİ MUZLU RULO", "MİNİ KROKANLI RULO", 
    "MİNİ ÇİLEKLİ RULO", "ÇİLEKLİ TARTOLET", "MİNİ İBİZA ÇİLEKLİ", "MİNİ İBİZA MUZLU", 
    "MİNİ CHEESECAKE", "EKLER BEYAZ KREMA", "EKLER ÇİKOLATA KREMA", "MİNİ SÜT BURGERLER"
  ],
  "YAŞ PASTALAR": [
    "ÇİLEKLİ", "ÇİLEK ÇİKOLATALI", "ÇİLEKLİ PROFİTEROL SOSLU", "GANAJ", 
    "FISTIK ÇİKOLATALI", "FISTIKLI MUZLU", "KARIŞIK MEYVELİ", "ORMAN MEYVELİ", 
    "FRAMBUAZLI", "FRAMBUAZ ÇİKOLATALI", "FRAMBUAZ MUZLU", "PROFİTEROLLÜ", 
    "LOTUS ÇİLEKLİ", "MUZLU", "MUZ ÇİKOLATALI", "KROKANLI"
  ],
  "ŞERBETLİ TATLILAR": [
    "KLASİK CEVİZLİ BAKLAVA", "CEVİZLİ EV BAKLAVASI", "SARAY SARMASI", "VEZİR PARMAĞI", "CEVİZLİ TEL KADAYIF",
    "KLASİK FISTIKLI BAKLAVA", "HAVUÇ DİLİMİ", "SARI BURMA", "ŞÖBİYET", "MİDYE", "FISTIKLI TEL KADAYIF", "SOĞUK BAKLAVA", "FISTIKLI ŞEKERPARE", "FISTIKLI GÜLLAÇ",
    "SÜTLÜ NURİYE", "FINDIKLI ŞEKERPARE", "YALOVA SÜTLÜSÜ", "FINDIKLI GÜLLAÇ",
    "KARIŞIK TATLI KURABİYE", "KARIŞIK TUZLU KURABİYE", "MİNİ PİZZALAR", "SAKALLI", "PEYNİRLİ SU BÖREĞİ", "KIYMALI KOL BÖREĞİ", "PEYNİRLİ KOL BÖREĞİ", "PATATESLİ KOL BÖREĞİ"
  ],
  "PAKET ÜRÜNLER": [
    "ACIBADEM KÜÇÜK", "ANASONLU GALET", "ANASONLU GEVREK", "BATONSALE", "BEZE", "BİSKOTTİ", 
    "ÇEKİRDEKLİ GALET", "ÇEKİRDEKLİ YAPRAK GEVREK", "GRİSSİNİ", "JAPONEX", "KAŞARLI GALET", 
    "KIRIKKIRAK", "SELANİK GEVREĞİ", "ZEYTİNLİ GEVREK"
  ]
};

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

const run = async () => {
  await payload.init({
    config: config,
    local: true,
  })

  // 1. Kategorileri Ayarla
  const categoriesMap: Record<string, string> = {}
  
  // Önce 6 Ana Kategoriyi oluştur veya al
  for (const catName of Object.keys(docxData)) {
    const slug = turkishLower(catName).replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')

    const existing = await payload.find({
      collection: 'categories' as any,
      where: { slug: { equals: slug } }
    })
    
    if (existing.docs.length > 0) {
      categoriesMap[catName] = existing.docs[0].id
      await payload.update({
        collection: 'categories' as any,
        id: existing.docs[0].id,
        data: { title: catName, isActive: true }
      })
    } else {
      const newCat = await payload.create({
        collection: 'categories' as any,
        data: {
          title: catName,
          slug: slug,
          isActive: true
        }
      })
      categoriesMap[catName] = newCat.id
    }
  }

  // Diğer tüm kategorileri pasif yap
  const allCats = await payload.find({ collection: 'categories' as any, limit: 100 })
  for (const c of allCats.docs) {
    if (!Object.values(categoriesMap).includes(c.id)) {
      await payload.update({
        collection: 'categories' as any,
        id: c.id,
        data: { isActive: false }
      })
    }
  }

  // 2. Ürünleri Eşleştir
  const allProducts = await payload.find({ collection: 'products' as any, limit: 1000 })
  const foundDocxItems = new Set<string>()

  for (const product of allProducts.docs) {
    const titleLower = turkishLower(product.title)
    
    let matchedCategory = null;
    let matchedDocxItem = null;

    // Docx listesindeki tüm item'ları gez
    for (const [catName, items] of Object.entries(docxData)) {
      for (const item of items) {
        // Tam eşleşme veya içeriyorsa eşleşme (Örn: "Çilekli" -> "Çilekli Yaş Pasta")
        if (titleLower === turkishLower(item) || titleLower.includes(turkishLower(item)) || turkishLower(item).includes(titleLower)) {
          matchedCategory = catName
          matchedDocxItem = item
          break
        }
      }
      if (matchedCategory) break
    }

    if (matchedCategory && matchedDocxItem) {
      foundDocxItems.add(matchedDocxItem)
      await payload.update({
        collection: 'products' as any,
        id: product.id,
        data: {
          category: categoriesMap[matchedCategory],
          isActive: 'active'
        }
      })
    } else {
      // Eşleşmedi -> Pasif yap
      await payload.update({
        collection: 'products' as any,
        id: product.id,
        data: {
          isActive: 'passive'
        }
      })
    }
  }

  // 3. Eksik Ürünleri Bul (Docx'te var, DB'de eşleşmedi)
  const missingProducts: any = {}
  for (const [catName, items] of Object.entries(docxData)) {
    missingProducts[catName] = []
    for (const item of items) {
      if (!foundDocxItems.has(item)) {
        missingProducts[catName].push(item)
      }
    }
  }

  // Sonuçları JSON olarak kaydet
  fs.writeFileSync('missing_products_report.json', JSON.stringify({
    totalProductsInDB: allProducts.totalDocs,
    matchedProducts: foundDocxItems.size,
    missingProducts
  }, null, 2))

  console.log("Senkronizasyon tamamlandı. Eksikler missing_products_report.json dosyasına yazıldı.")
  process.exit(0)
}

run()
