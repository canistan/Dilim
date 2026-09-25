import 'dotenv/config'
import payload from 'payload'
import config from '../src/payload.config'
import fs from 'fs'
import path from 'path'

const newLocalBlogs = [
  {
    title: 'Kavacık Pasta Siparişi: Günlük Taze ve Butik Yaş Pasta Rehberi',
    slug: 'kavacik-pasta-siparisi-rehberi',
    excerpt: "Kavacık, Acarkent ve Rüzgarlıbahçe bölgesinde aynı gün teslimatlı, günlük taze ve özel tasarım yaş pasta siparişi için bilmeniz gereken tüm detaylar.",
    content: `İstanbul Anadolu Yakası'nın en gözde lokasyonlarından biri olan Kavacık'ta, özel günlerinizi tatlandıracak doğru yaş pastayı bulmak artık çok kolay! Dilim Pastaneleri Kavacık şubemiz, 2000 yılından bu yana Acarkent, Rüzgarlıbahçe, Beykoz ve çevre bölgelere günlük taze, katkısız ve butik pasta hizmeti sunmaktadır.

## Kavacık'ta Taze Pasta Siparişi Verirken Nelere Dikkat Edilmeli?

Bir doğum günü, yıldönümü veya kutlama için pasta siparişi verirken en önemli kriter **tazeliktir**. Fabrikasyon ve günlerce bekletilmiş pastalar yerine, günlük olarak imalathaneden çıkan taze meyveli veya Belçika çikolatalı pastalar tercih edilmelidir.

### 1. Aynı Gün Teslimat Kolaylığı
Kavacık bölgesindeki yoğun iş temposunda veya son dakika sürprizlerinde, aynı gün adrese teslimat yapan pastaneler büyük kolaylık sağlar. Dilim Pastaneleri Kavacık şubemizden vereceğiniz siparişler, özel soğutmalı kuryelerimiz ile bozulmadan kapınıza kadar ulaştırılır.

### 2. Kişiye Özel Pasta Tasarımı (Kendi Pastanı Tasarla)
Standart pastaların dışına çıkmak isteyenler için Kavacık şubemizde kişiye özel 3D figürlü, resimli ve tematik pasta siparişleri alınmaktadır. Web sitemizdeki **Kendi Pastanı Tasarla** modülünü kullanarak hayalinizdeki pastayı kolayca oluşturabilirsiniz.

### 3. Katkısız ve %100 Doğal Malzemeler
Tüm yaş pastalarımızda glikoz şurubu veya yapay aromalar kesinlikle kullanılmaz. %100 doğal pancar şekeri, taze mevsim meyveleri ve birinci sınıf çikolatalar ile hazırlanan pastalarımız hem çocuklarınız hem de misafirleriniz için güvenli bir lezzet sunar.

Siz de Kavacık, Acarkent ve çevresinde taze pasta siparişi vermek istiyorsanız web sitemiz üzerinden hemen siparişinizi oluşturabilir veya Kavacık şubemizi ziyaret edebilirsiniz!`,
    author: 'Dilim Pastaneleri Kavacık Şefleri',
    date: '2026-09-25',
    readTime: '4 dk okuma',
    image: '/dilim-kavacik-sube.jpg'
  },
  {
    title: 'Ümraniye Doğum Günü Pastası & Özel Tasarım Pasta Rehberi',
    slug: 'umraniye-dogum-gunu-pastasi-rehberi',
    excerpt: "Ümraniye, Tepeüstü ve Çakmak bölgesinde doğum günü pastası seçimi, 200m² modern imalathanemiz ve aynı gün teslimat avantajları.",
    content: `Doğum günleri, sevdiklerimize verdiğimiz değeri göstermenin en özel yoludur. Ümraniye ve çevresinde unutulmaz bir doğum günü partisi organize ediyorsanız, partinin odak noktası şüphesiz lezzetli ve gösterişli bir doğum günü pastasıdır.

## Ümraniye'de Doğum Günü Pastası Trendleri

Ümraniye Eğitim ve Araştırma Hastanesi karşısındaki 200 m² modern imalathanemizde, her yaş grubuna özel doğum günü pastaları üretilmektedir.

### 1. Çocuk Doğum Günü Konsept Pastaları
Çocukların en sevdiği kahramanlar, çizgi film karakterleri ve 3D şeker hamuru figürleri ile süslenen pastalar Ümraniye şubemizde yoğun ilgi görmektir. Safari, uzay, deniz kızı veya süper kahraman konseptli pastalar çocukların doğum günlerini masala dönüştürür.

### 2. Yetişkinler İçin Minimalist & Şık Tasarımlar
Yetişkin doğum günlerinde ise daha sade, modern, makaron ve taze meyvelerle süslenmiş "Naked Cake" veya çikolata ganaj kaplamalı pastalar öne çıkıyor. Yoğun Belçika çikolatası ve fıstık uyumu damaklarda unutulmaz bir iz bırakır.

### 3. Ümraniye İmalatından Doğrudan Teslimat
Ümraniye şubemizdeki geniş üretim kapasitemiz sayesinde siparişleriniz doğrudan fırından ve kremleme aşamasından çıkar çıkmaz taptaze teslim edilir. Tepeüstü, Çakmak, Şerifali ve Ataşehir bölgelerine hızlı kurye teslimatımız mevcultur.

Hayalinizdeki doğum günü pastasını sipariş etmek için Dilim Pastaneleri Ümraniye şubemizle iletişime geçebilir veya sitemiz üzerinden online sipariş verebilirsiniz.`,
    author: 'Dilim Pastaneleri Ümraniye Ekibi',
    date: '2026-09-25',
    readTime: '4 dk okuma',
    image: '/dilim-umraniye-sube.jpg'
  },
  {
    title: "Kavacık ve Ümraniye'de Söz & Nişan Pastası Seçimi: Sipariş Tavsiyeleri",
    slug: 'kavacik-umraniye-soz-nisan-pastasi-rehberi',
    excerpt: "İstanbul Anadolu Yakası'nda evliliğe adım atan çiftler için söz ve nişan pastası seçim rehberi, kat sayıları, lezzet uyumu ve teslimat detayları.",
    content: `Evliliğe giden yolda ilk ve en tatlı adım olan söz ve nişan merasimleri, ailelerin ve sevdiklerin bir araya geldiği unutulmaz anlardır. Bu özel gecenin en şık detaylarından biri ise zarafetiyle göz kamaştıran nişan pastasıdır.

## Nişan Pastası Seçerken Dikkat Edilmesi Gerekenler

Kavacık ve Ümraniye şubelerimizde çiftlerimize özel söz ve nişan pastası danışmanlığı sunuyoruz. İşte mükemmel bir nişan pastası için dikkat edilmesi gereken püf noktaları:

### 1. Merasim Mekanına Uygun Model Seçimi
Evde yapılan sıcak bir söz merasimi için 2 katlı, taze canlı çiçekler ve şeker hamuru detaylarıyla süslenmiş zarif bir pasta idealdir. Salonda veya davet alanında yapılacak büyük bir nişan organizasyonu için ise çok katlı gösterişli modeller tercih edilmelidir.

### 2. Damak Tadına Uygun Hafif Lezzetler
Nişan törenlerinde ikram edilen pastaların ağır olmaması önemlidir. Beyaz çikolatalı ve frambuazlı pandispanya veya limonlu-vanilyalı hafif krema kombinasyonları misafirlerin genel beğenisini kazanır.

### 3. Güvenli Lojistik ve Zamanında Teslimat
Söz ve nişan günlerinde organizasyon stresi yaşamamanız için pastanız Kavacık veya Ümraniye şubemizden özel soğutmalı araçlarımızla tam belirttiğiniz saatte merasim mekanına ulaştırılır.

Dilim Pastaneleri olarak bu özel gününüzde yanınızda olmaktan mutluluk duyuyoruz. Söz ve nişan pastası kataloğumuzu incelemek ve özel fiyat almak için şubelerimizi ziyaret edebilir veya bizimle iletişime geçebilirsiniz.`,
    author: 'Dilim Pastaneleri Organizasyon Danışmanları',
    date: '2026-09-25',
    readTime: '5 dk okuma',
    image: '/hakkimizda_hero.png'
  }
]

async function seedLocalSEO() {
  console.log('Seeding Local SEO Blogs into Payload CMS...')
  await payload.init({ config })

  for (const blogData of newLocalBlogs) {
    const existing = await payload.find({
      collection: 'blog',
      where: { slug: { equals: blogData.slug } }
    })

    if (existing.docs.length === 0) {
      const richContent = [
        {
          children: [
            { text: blogData.content }
          ]
        }
      ]

      await payload.create({
        collection: 'blog',
        data: {
          title: blogData.title,
          slug: blogData.slug,
          content: richContent as any,
        }
      })
      console.log(`✅ Created blog in Payload: ${blogData.title}`)
    } else {
      console.log(`ℹ️ Blog already exists in Payload: ${blogData.title}`)
    }
  }

  const blogJsonPath = path.join(process.cwd(), 'src/data/blog.json')
  let currentBlogJson: any[] = []
  if (fs.existsSync(blogJsonPath)) {
    currentBlogJson = JSON.parse(fs.readFileSync(blogJsonPath, 'utf-8'))
  }

  let idCounter = Math.max(...currentBlogJson.map((b: any) => b.id || 0), 0) + 1

  for (const b of newLocalBlogs) {
    if (!currentBlogJson.some((existing: any) => existing.slug === b.slug)) {
      currentBlogJson.unshift({
        id: idCounter++,
        ...b
      })
    }
  }

  fs.writeFileSync(blogJsonPath, JSON.stringify(currentBlogJson, null, 2), 'utf-8')
  console.log('✅ Updated src/data/blog.json with new Local SEO blog posts!')
  process.exit(0)
}

seedLocalSEO().catch(err => {
  console.error('Error seeding local blogs:', err)
  process.exit(1)
})
