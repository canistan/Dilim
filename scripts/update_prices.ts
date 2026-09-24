import 'dotenv/config'
import payload from 'payload'
import config from '../src/payload.config'

const run = async () => {
  await payload.init({ config, local: true })

  const priceMap: { [key: string]: number } = {
    "PROFİTEROL": 350,
    "ORMAN MEYVELİ MAGNOLYA": 375,
    "MİLFÖY (SİPARİŞ ÜZERİNE)": 350,
    "KROKANLI TEK PASTA": 360,
    "MUZLU RULO PASTA": 360,
    "IBIZA ÇİLEKLİ (BURÇAK BİSKÜVİLİ)": 360,
    "IBIZA MUZLU (BURÇAK BİSKÜVİLİ)": 360,
    "ÇİLEK ÇİKOLATALI TEK PASTA": 360,
    "ÇİLEKLİ TEK PASTA": 360,
    "KARIŞIK PETİFÜR": 1400,
    "EKLER BEYAZ KREMA": 1400,
    "EKLER ÇİKOLATA KREMA": 1400,
    "MİNİ SÜT BURGERLER": 1400,
    "MİNİ CHEESECAKE": 1400,
    "MİNİ İBİZA MUZLU": 1400,
    "MİNİ İBİZA ÇİLEKLİ": 1400,
    "ÇİLEKLİ TARTOLET": 1400,
    "MİNİ ÇİLEKLİ RULO": 1400,
    "MİNİ KROKANLI RULO": 1400,
    "MİNİ MUZLU RULO": 1400,
    "MUZLU ÇİKOLATALI PETİFÜRLER": 1400,
    "KROKANLI PETİFÜRLER": 1400
  };

  const allProducts = await payload.find({
    collection: 'products' as any,
    limit: 1000,
  });

  let updatedCount = 0;

  for (const [pName, price] of Object.entries(priceMap)) {
    const targetNameLC = pName.toLowerCase('tr-TR');
    
    // İsmi eşleşen veya içinde "MİLFÖY" geçen vb. 
    // Tam isim eşleşmesi arıyoruz.
    const existing = allProducts.docs.find(d => {
       if (!d.title) return false;
       const dbNameLC = d.title.toLowerCase('tr-TR');
       // Milföy istisnası (isimde sipariş üzerine eklemiştik)
       if (targetNameLC.includes('milföy') && dbNameLC.includes('milföy')) return true;
       return dbNameLC === targetNameLC;
    });

    if (existing) {
      await payload.update({
        collection: 'products' as any,
        id: existing.id,
        data: {
          price: price
        }
      });
      console.log(`[FİYAT GÜNCELLENDİ] ${existing.title} -> ${price} TL`);
      updatedCount++;
    } else {
      console.log(`[BULUNAMADI] ${pName}`);
    }
  }

  console.log(`\\nİşlem Tamamlandı: Toplam ${updatedCount} ürünün fiyatı güncellendi.`);
  process.exit(0);
}

run();
