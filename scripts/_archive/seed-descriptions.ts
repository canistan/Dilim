import { getPayload } from 'payload'
import configPromise from '../src/payload.config'
import fs from 'fs'

const descriptions: Record<string, string> = {
  "FISTIK ÇİKOLATALI TEK PASTA": "Özenle seçilmiş Antep fıstıkları ve premium çikolatanın muhteşem uyumunu tek kişilik porsiyonda sunan taptaze spesiyal lezzetimiz.",
  "MUZ ÇİKOLATALI TEK PASTA": "Taze dilimlenmiş tatlı muzlar ve yoğun çikolata kreması ile hazırlanan, her çatalda mutluluk veren tek kişilik enfes pastamız.",
  "DUSTY CROPHOPPER": "Çocukların en sevdiği sevimli uçak karakteri Dusty konseptiyle tamamen el işçiliğiyle hazırlanan, renkli ve eğlenceli özel gün pastası.",
  "FOREST ANIMALS": "Orman hayvanları figürleriyle usta ellerden çıkan, doğa konseptli çocuk partilerinin vazgeçilmezi sevimli ve butik tasarım pasta.",
  "DİLBER DUDAĞI": "İncecik açılmış yufkası, bol ceviz içi ve tam kıvamında şerbetiyle geleneksel Türk tatlısı Dilber Dudağı'nın en taze hali.",
  "SÜTLÜ NURİYE": "Hafif sütlü şerbeti ve bol fındıklı içeriğiyle, klasik şerbetli tatlılara hafif ve enfes bir alternatif sunan Sütlü Nuriye.",
  "FISTIKLI DÜRÜM": "Yüzde yüz doğal Antep fıstığının ustalıkla sarıldığı, damakta eriyen çıtır çıtır yufkasıyla özel Fıstıklı Dürüm.",
  "TEL KADAYIF": "Altı üstü nar gibi kızarmış, içi bol fıstıklı ve tam kıvamında şerbetiyle geleneksel lezzet Tel Kadayıf.",
  "ŞEKERPARE": "Ağızda dağılan yumuşacık hamuru ve tam kararında şerbetiyle, çay saatlerinizin vazgeçilmezi klasik Şekerpare.",
  "FISTIKLI BAKLAVA": "Gaziantep'in meşhur boz iç fıstıkları ve incecik 40 kat yufkayla hazırlanan, sade yağın nefis kokusuyla Fıstıklı Baklava.",
  "ŞÖBİYET": "Bol fıstıklı ve özel kaymaklı iç dolgusuyla, dışı çıtır içi yumuşacık unutulmaz lezzet Şöbiyet.",
  "NİŞAN PASTASI-04": "Nişan ve söz merasimlerinize zarafet katacak, romantik detaylar ve çiçek aranjmanlarıyla süslenmiş özel tasarım katlı pasta.",
  "NİŞAN PASTASI-03": "En mutlu gününüz için modern ve şık çizgilerle tasarlanmış, misafirlerinizi hem görünümü hem tadıyla büyüleyecek butik nişan pastası.",
  "NİŞAN PASTASI-02": "Göz alıcı detayları ve zarif süslemeleriyle, unutulmaz nişan törenlerinizin yıldızı olacak özel sipariş katlı tasarım pasta.",
  "NİŞAN PASTASI-01": "Klasik ve sade zarafeti seven çiftler için ustalarımız tarafından özenle hazırlanan, lezzetiyle iz bırakan düğün ve nişan pastası.",
  "CAMELOT": "Orta Çağ ve şövalye konseptli, detaylı şato figürleriyle süslenmiş, çocukların hayal dünyasını süsleyen özel tasarım macera pastası.",
  "KUNG FU PANDA": "Sevilen animasyon kahramanı Po ve arkadaşlarının figürleriyle tasarlanmış, doğum günlerine neşe katan Kung Fu Panda konseptli pasta.",
  "KAPTAN YUNUS": "Denizlerin sevimli kahramanı yunuslar ve okyanus temasıyla hazırlanan, denizci konseptli partiler için harika tasarım pasta.",
  "DENİZ KIZI": "Masalsı deniz kızı Ariel konseptiyle, deniz kabukları ve incilerle süslenmiş kız çocuklarının hayallerindeki doğum günü pastası.",
  "PUPPY PUG": "Sevimli Pug cinsi köpek figürüyle tamamen el yapımı şeker hamurundan hazırlanan, hayvansever çocukların favorisi şirin pasta.",
  "M&M PASTA": "Üzerinden dökülen rengarenk M&M çikolatalarıyla hem görsel bir şölen sunan hem de çikolata krizlerine son veren eğlenceli tasarım pasta.",
  "LEGO MAN": "Lego parçaları ve oyuncak figürleriyle süslenmiş, yaratıcı çocukların doğum günleri için özel olarak hazırlanan renkli Lego pastası.",
  "101 DALMAÇYALI": "Klasik 101 Dalmaçyalı masalından fırlamış benekli köpek figürleriyle tasarlanan, nostaljik ve sevimli butik çocuk pastası.",
  "VİŞNE MUZ FINDIK": "Mayhoş vişne taneleri, tatlı muz dilimleri ve kavrulmuş fındığın mükemmel uyumuyla hazırlanan, hafif ve ferahlatıcı yaş pasta.",
  "LİMONLU CHEESECAKE": "Taptaze limonların ferahlatıcı aroması ve pürüzsüz peynir kremasıyla, hafif ekşi-tatlı uyumunu sevenler için Limonlu Cheesecake.",
  "BÖĞÜRTLEN ÇİKOLATA": "Orman meyvelerinin kraliçesi böğürtlen ile yoğun bitter çikolatanın buluştuğu, damakta iz bırakan enfes yaş pasta.",
  "FRAMBUAZLI CHEESECAKE": "Üzeri nefis frambuaz sosu ile kaplı, altı kıtır bisküvi tabanlı ve tam kıvamında fırınlanmış klasik Frambuazlı Cheesecake.",
  "MUZLU": "Bembeyaz yumuşacık pandispanya, bol taze muz dilimleri ve hafif vanilya kremasıyla hazırlanan her yaşın favorisi sade muzlu pasta.",
  "KARAMEL KRONKANLI": "Ev yapımı karamel sosu ve çıtır çıtır kavrulmuş krokan parçalarıyla lezzetlendirilmiş, karamel tutkunlarının vazgeçilmezi spesiyal pasta.",
  "ÇİLEKLİ": "Mevsimin en taze, kıpkırmızı çilekleri ve hafif pastacı kremasıyla hazırlanan, bahar esintisi tadında klasik meyveli yaş pasta.",
  "ÇİLEKLİ MUZLU": "Taze çilek ve muzun ayrılmaz uyumunu, yumuşacık sünger kek ve özel kremamızla birleştiren herkesin sevdiği efsane lezzet.",
  "SPESİYAL FISTIK ÇİKOLATA": "Bol Antep fıstığı parçaları ve yoğun Belçika çikolatasının muazzam dengesiyle, çikolata ve fıstık aşıklarına özel lüks yaş pasta.",
  "DİLİM FİSTORİA": "Dilim Pastaneleri'nin imza ürünü; özel yeşil fıstık kreması ve yoğun fıstık katmanlarıyla hazırlanan premium lezzet Fıstoria.",
  "PROFİTEROLLÜ PASTA": "Üzeri nefis çikolata soslu mini profiterol toplarıyla kaplı, içi enfes pastacı kreması dolu gösterişli ve lezzet şöleni yaş pasta.",
  "KARIŞIK MEYVELİ": "Mevsimin en güzel taze meyveleriyle rengarenk süslenen, hafif yapısıyla damakları yormayan meyve şöleni yaş pasta.",
  "FRAMBUAZ ÇİKOLATA": "Taptaze frambuazların hafif mayhoş tadı ile premium çikolatanın yoğunluğunun harmanlandığı, şık görünümlü enfes spesiyal yaş pasta.",
  "MUZ ÇİKOLATA": "Taze muz dilimleri ve akışkan çikolata kremasının klasik ve kusursuz buluşmasıyla hazırlanan, en çok tercih edilen yaş pastalarımızdan."
}

async function run() {
  console.log('Veritabanına bağlanılıyor...')
  const payload = await getPayload({ config: configPromise })
  
  console.log('Ürünler getiriliyor...')
  const products = await payload.find({
    collection: 'products',
    limit: 1000,
  })

  console.log(`Toplam ${products.docs.length} ürün bulundu. Güncellemeler başlıyor...`)

  let updatedCount = 0

  for (const product of products.docs) {
    const desc = descriptions[product.title]
    if (desc) {
      await payload.update({
        collection: 'products',
        id: product.id,
        data: {
          description: desc,
        },
      })
      console.log(`✓ ${product.title} için açıklama güncellendi.`)
      updatedCount++
    } else {
      console.log(`- ${product.title} için açıklama bulunamadı, es geçiliyor.`)
    }
  }

  console.log(`İşlem tamamlandı. Toplam ${updatedCount} ürün güncellendi.`)
  process.exit(0)
}

run().catch(console.error)
