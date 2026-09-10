import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'

async function run() {
  const payload = await getPayload({ config: configPromise })
  console.log('Özel pasta ayarları yükleniyor...')

  await payload.updateGlobal({
    slug: 'custom-cake-options',
    data: {
      sizeOptions: [
        { slugId: '6-8', name: '6-8 Kişilik', desc: 'Küçük Kutlamalar İçin (Tek Katlı)', price: '₺850' },
        { slugId: '10-12', name: '10-12 Kişilik', desc: 'Orta Boy Kutlamalar (Geniş Tek Kat)', price: '₺1200' },
        { slugId: '15-20+', name: '15-20+ Kişilik', desc: 'Kalabalık Partiler (İki Katlı)', price: '₺1850' },
      ],
      baseOptions: [
        { slugId: 'vanilla', name: 'Sade Vanilyalı Sünger', desc: 'Hafif ve klasik lezzet' },
        { slugId: 'cacao', name: 'Zengin Kakaolu Sünger', desc: 'Yoğun çikolata tutkunları için' },
        { slugId: 'redvelvet', name: 'Red Velvet (Kırmızı Kadife)', desc: 'Özel dokusuyla premium seçim' },
      ],
      fillingOptions: [
        { slugId: 'choco-banana', name: 'Çikolata & Muz', desc: 'Klasikleşmiş efsane uyum' },
        { slugId: 'raspberry-white', name: 'Frambuaz & Beyaz Çikolata', desc: 'Hafif ekşi ve tatlı dengesi' },
        { slugId: 'pistachio', name: 'Antep Fıstığı & Krokan', desc: 'Geleneksel lüks lezzet' },
        { slugId: 'strawberry-choco', name: 'Çilek & Çikolata', desc: 'Taze çilekler ve enfes çikolata uyumu' },
        { slugId: 'lotus-caramel', name: 'Lotus & Karamel', desc: 'Kıtır Lotus bisküvisi ve akışkan karamel' },
        { slugId: 'black-forest', name: 'Kara Orman (Black Forest)', desc: 'Vişne, kakao ve çikolata parçacıkları' },
        { slugId: 'banoffee', name: 'Muz & Karamel (Banoffee tarzı)', desc: 'Taze muz ve karamelin baş döndüren tadı' },
      ],
      frostingOptions: [
        { slugId: 'fondant', name: 'Şeker Hamuru', desc: 'Kusursuz pürüzsüzlük ve özel figürler için' },
        { slugId: 'ganache', name: 'Çikolata Ganaj', desc: 'Dripping efektli enfes çikolata kaplama' },
        { slugId: 'naked', name: 'Naked Cake', desc: 'Rustik, doğal ve kremalı görünüm' },
      ]
    }
  });

  console.log('Başarıyla yüklendi!');
  process.exit(0)
}

run().catch(console.error)
