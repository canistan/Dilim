import 'dotenv/config'
import payload from 'payload'
import config from '../src/payload.config'

const run = async () => {
  await payload.init({ config, local: true })

  const productsRes = await payload.find({
    collection: 'products' as any,
    limit: 1000,
  })

  let updateCount = 0;

  for (const doc of productsRes.docs) {
    const title = doc.title.toUpperCase();
    let ingredients = '';
    let allergens = 'Süt ürünleri, yumurta ve gluten (buğday) içerir.';

    // TEMEL İÇERİKLER
    if (doc.categoryTitle === 'ŞERBETLİ TATLILAR' || title.includes('BAKLAVA') || title.includes('KADAYIF') || title.includes('ŞEKERPARE')) {
      ingredients = 'Buğday unu, sade yağ, pancar şekeri, su, nişasta, yumurta.';
      if (title.includes('CEVİZ')) {
        ingredients += ' Bol ceviz içi.';
        allergens += ' Ceviz içerir.';
      } else if (title.includes('FISTIK')) {
        ingredients += ' Birinci kalite Antep fıstığı.';
        allergens += ' Antep fıstığı içerir.';
      } else if (title.includes('FINDIK')) {
        ingredients += ' Kavrulmuş fındık.';
        allergens += ' Fındık içerir.';
      }
    } 
    else if (doc.categoryTitle === 'SÜTLÜ TATLILAR' || title.includes('MUHALLEBİ') || title.includes('MAGNOLYA') || title.includes('TAVUKGÖĞSÜ')) {
      ingredients = 'Günlük pastörize inek sütü, pancar şekeri, pirinç/mısır nişastası, taze krema, vanilya.';
      if (title.includes('ÇİLEK')) ingredients += ' Taze çilek, çilek püresi, bebe bisküvisi.';
      if (title.includes('MUZ')) ingredients += ' Taze muz, bebe bisküvisi.';
      if (title.includes('LOTUS')) {
        ingredients += ' Lotus karamel bisküvi ve ezmesi.';
        allergens += ' Soya içerir.';
      }
    }
    else if (title.includes('CHEESECAKE')) {
      ingredients = 'Taze peynir, labne, krema, yumurta, şeker, yulaflı bisküvi tabanı, tereyağı.';
      if (title.includes('LİMON')) ingredients += ' Doğal limon suyu ve limon kabuğu rendesi sosu.';
      if (title.includes('FRAMBUAZ')) ingredients += ' Taze frambuaz sosu.';
      if (title.includes('LOTUS')) {
        ingredients += ' Lotus bisküvi tabanı ve Lotus karamel kreması.';
        allergens += ' Soya içerir.';
      }
      if (title.includes('DUBAI')) ingredients += ' Özel fıstık ezmesi, kadayıf parçacıkları ve çikolata.';
    }
    else if (title.includes('KURABİYE') || title.includes('PİZZA') || title.includes('GEVREK') || title.includes('GALET')) {
      ingredients = 'Buğday unu, bitkisel margarin/tereyağı, yumurta, kabartma tozu.';
      if (title.includes('TUZLU') || title.includes('PİZZA')) {
        ingredients += ' Tuz, mahlep, susam, çörekotu, peynir/zeytin/sosis (çeşidine göre).';
        allergens += ' Susam ve çörekotu içerebilir.';
      } else {
        ingredients += ' Pudra şekeri, vanilya, damla çikolata/meyve parçacıkları.';
      }
    }
    else {
      // GENEL (YAŞ PASTALAR & TEK PASTALAR & PETİFÜR)
      ingredients = 'Özel pandispanya keki (buğday unu, yumurta, şeker, kakao/vanilya), pastacı kreması (süt, yumurta, nişasta), şanti.';
      
      if (title.includes('ÇİKOLATA') || title.includes('GANAJ') || title.includes('PROFİTEROL') || title.includes('EKLER')) {
        ingredients += ' Gerçek Belçika çikolatası (sütlü/bitter), kakao tozu, kakao yağı.';
        allergens += ' Eser miktarda soya lesitini içerebilir.';
      }
      if (title.includes('ÇİLEK')) ingredients += ' Taze doğranmış çilek.';
      if (title.includes('MUZ')) ingredients += ' Taze muz dilimleri.';
      if (title.includes('MEYVELİ') || title.includes('ORMAN') || title.includes('FRAMBUAZ')) {
        ingredients += ' Taze orman meyveleri (frambuaz, böğürtlen, yaban mersini), meyve jölesi.';
      }
      if (title.includes('FISTIK')) {
        ingredients += ' Antep fıstığı parçacıkları.';
        allergens += ' Antep fıstığı içerir.';
      }
      if (title.includes('KROKAN')) {
        ingredients += ' Karamelize fındık/fıstık krokanı.';
        allergens += ' Kuruyemiş (Fındık/Fıstık) içerir.';
      }
    }

    // Ekstra uyarilar
    allergens += ' Tesisimizde diğer kuruyemiş (ceviz, badem) ve susam ürünleri de işlenmektedir, bu sebeple eser miktarda çapraz bulaşma riski barındırabilir.';

    // Description (Yapılışı) da bos ise şık bir metin ekle
    let description = doc.description || '';
    if (!description || description.trim() === '') {
      description = `Usta ellerden çıkan, taptaze ve günlük malzemelerle hazırlanan eşsiz ${doc.title.toLowerCase()}. Dilim Pastaneleri kalitesiyle, sevdiklerinizle paylaşmanız için özenle üretilmiştir.`;
    }

    await payload.update({
      collection: 'products' as any,
      id: doc.id,
      data: {
        ingredients: ingredients,
        allergens: allergens,
        description: description
      }
    });

    updateCount++;
  }

  console.log(`Bitti! Toplam ${updateCount} ürünün içerik ve alerjen uyarısı eklendi.`);
  process.exit(0);
}

run();
