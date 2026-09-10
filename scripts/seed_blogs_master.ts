import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'
import fs from 'fs'
import path from 'path'

async function downloadImage(url: string, filename: string) {
  const filepath = path.join(__dirname, filename)
  if (fs.existsSync(filepath)) return filepath
  
  console.log(`İndiriliyor: ${url}`)
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  fs.writeFileSync(filepath, buffer)
  return filepath
}

async function run() {
  const payload = await getPayload({ config: configPromise })
  console.log('Eski blog içerikleri siliniyor...')

  // Delete all existing blogs
  const allBlogs = await payload.find({
    collection: 'blog',
    limit: 1000
  });

  for (const doc of allBlogs.docs) {
    await payload.delete({
      collection: 'blog',
      id: doc.id
    });
  }
  
  console.log(`${allBlogs.totalDocs} eski blog silindi.`);
  console.log('9 adet yepyeni SEO uyumlu blog içeriği oluşturuluyor...');

  const blogs = [
    {
      title: 'Pastacılıkta 30 Yıllık Serüvenimiz',
      imageUrl: 'https://images.unsplash.com/photo-1557308536-ee471ef2c390?q=80&w=1200&auto=format&fit=crop', // bakery interior
      filename: 'blog-pastane-seruven.jpg',
      seo: {
        metaTitle: 'Pastacılıkta 30 Yıllık Serüvenimiz | Dilim Pastaneleri',
        metaDescription: 'Dilim Pastaneleri olarak 30 yıldır sizlere en taze ve lezzetli pastaları sunmanın gururunu yaşıyoruz. Hikayemizi keşfedin.',
        metaKeywords: 'pastane, hikayemiz, serüven, 30 yıl, dilim pastaneleri'
      },
      content: [
        { type: 'h2', children: [{ text: 'Küçük Bir Fırından Büyük Bir Aileye' }] },
        { type: 'paragraph', children: [{ text: 'Her şey 30 yıl önce, sabahın erken saatlerinde mahallemize yayılan taze poğaça ve ekmek kokularıyla başladı. O zamanlar küçük, mütevazı bir fırındık. Ancak içimizdeki lezzet tutkusu ve müşterilerimizin yüzündeki tebessüm, bizi bugünlere taşıyan en büyük motivasyon kaynağı oldu.' }] },
        { type: 'paragraph', children: [{ text: 'Bugün, sadece pasta yapmıyoruz; özel anılarınızı tatlandırıyor, sevdiklerinizle paylaştığınız mutluluğa ortak oluyoruz. Her dilimde aynı kalite, her lokmada aynı özen var.' }] }
      ]
    },
    {
      title: 'Doğum Günü Pastası Seçerken Nelere Dikkat Edilmeli?',
      imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=1200&auto=format&fit=crop', // cake
      filename: 'blog-dogum-gunu.jpg',
      seo: {
        metaTitle: 'Doğum Günü Pastası Seçme Rehberi | Dilim Pastaneleri',
        metaDescription: 'Sevdikleriniz için unutulmaz bir doğum günü pastası seçmenin püf noktaları. Tema, lezzet ve porsiyon önerileri.',
        metaKeywords: 'doğum günü pastası, pasta seçimi, pasta rehberi, çikolatalı pasta'
      },
      content: [
        { type: 'h2', children: [{ text: 'Mükemmel Pastayı Bulma Rehberi' }] },
        { type: 'paragraph', children: [{ text: 'Doğum günleri, sevdiklerimizle bir araya geldiğimiz en özel günlerden biridir. Ve bir doğum gününün olmazsa olmazı şüphesiz ki harika bir pastadır. Peki, mükemmel pastayı nasıl seçmelisiniz?' }] },
        { type: 'h3', children: [{ text: '1. Misafir Sayısını Doğru Hesaplayın' }] },
        { type: 'paragraph', children: [{ text: 'Pastanın boyutu, misafir sayısına göre belirlenmelidir. Kimse pastasız kalmak istemez! Standart olarak 1 numaralı pastalarımız 6-8 kişiliktir.' }] },
        { type: 'h3', children: [{ text: '2. Damak Tadını Göz Önünde Bulundurun' }] },
        { type: 'paragraph', children: [{ text: 'Çikolata tutkunları için yoğun ganajlı, meyve severler için hafif ve ferah pastalar tercih edilebilir. Kutlanacak kişinin favori lezzetini bilmek en önemli adımdır.' }] }
      ]
    },
    {
      title: 'Çikolatanın İyisi Nasıl Anlaşılır?',
      imageUrl: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=1200&auto=format&fit=crop', // luxury chocolate
      filename: 'blog-cikolata.jpg',
      seo: {
        metaTitle: 'Gerçek ve Kaliteli Çikolata Nasıl Anlaşılır? | Dilim',
        metaDescription: 'Kaliteli çikolatayı anlamanın yolları nelerdir? Kakao oranından parlaklığına, gerçek çikolatanın sırları.',
        metaKeywords: 'kaliteli çikolata, gerçek çikolata, çikolata seçimi, madlen çikolata'
      },
      content: [
        { type: 'h2', children: [{ text: 'Gerçek Çikolatanın Sırları' }] },
        { type: 'paragraph', children: [{ text: 'Birçoğumuz çikolatayı çok severiz ancak gerçek ve kaliteli bir çikolatayı sıradan bir çikolatadan ayırmak uzmanlık gerektirebilir. İşte size birkaç ipucu:' }] },
        { type: 'paragraph', children: [{ text: 'Öncelikle, kaliteli çikolata parlak bir görünüme sahiptir. Mat veya üzerinde beyaz benekler olan çikolatalar genellikle yanlış sıcaklıkta saklanmış demektir.' }] },
        { type: 'paragraph', children: [{ text: 'İkinci olarak, kırıldığında tok bir "çıt" sesi çıkarmalıdır. Bu ses, kakao yağının doğru şekilde temperlendiğinin bir göstergesidir.' }] }
      ]
    },
    {
      title: 'Nişan Pastası Seçiminde 5 Altın Kural',
      imageUrl: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=1200&auto=format&fit=crop', // wedding/engagement cake
      filename: 'blog-nisan-pastasi.jpg',
      seo: {
        metaTitle: 'Nişan Pastası Seçiminde 5 Altın Kural | Dilim',
        metaDescription: 'Hayatınızın en özel günlerinden biri olan nişan töreniniz için en mükemmel pastayı nasıl seçebilirsiniz? Gelin birlikte inceleyelim.',
        metaKeywords: 'nişan pastası, düğün pastası, özel tasarım pasta, butik pasta'
      },
      content: [
        { type: 'h2', children: [{ text: 'Görsellik Kadar Lezzet de Önemli' }] },
        { type: 'paragraph', children: [{ text: 'Nişan pastaları, törenin en çok fotoğraflanan ve konuşulan detaylarından biridir. Pastanızın tasarımına karar verirken mekanın konseptini, elbisenizi ve hatta mevsime uygun çiçekleri bile göz önünde bulundurabilirsiniz.' }] },
        { type: 'paragraph', children: [{ text: 'Ancak unutulmaması gereken en önemli kural: Görsel bir şölen sunan pastanız, damaklarda da unutulmaz bir tat bırakmalıdır! Dilim Pastaneleri olarak özel tasarım nişan pastalarında taze orman meyveleri, özel Belçika çikolatası ve hafif kremalar kullanmayı tercih ediyoruz.' }] }
      ]
    },
    {
      title: 'Makaron: Fransız Mutfağından Gelen Zarif Lezzet',
      imageUrl: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?q=80&w=1200&auto=format&fit=crop', // macarons
      filename: 'blog-makaron.jpg',
      seo: {
        metaTitle: 'Gerçek Fransız Makaronu Nedir? | Dilim Pastaneleri',
        metaDescription: 'Rengarenk, dışı çıtır, içi yumuşacık makaronların sırrı nedir? Kahvenin en zarif eşlikçisi olan bu Fransız lezzetini yakından tanıyın.',
        metaKeywords: 'makaron, fransız tatlıları, kahve yanı, hediye kutusu'
      },
      content: [
        { type: 'h2', children: [{ text: 'Renklerin ve Aromaların Dansı' }] },
        { type: 'paragraph', children: [{ text: 'Badem unu, yumurta akı ve şekerin o mucizevi birleşimi... Fransız mutfağının tüm dünyaya armağanı olan makaron, yapımı ustalık isteyen en hassas tatlılardan biridir.' }] },
        { type: 'paragraph', children: [{ text: 'Fıstıklı, ahududulu, limonlu, çikolatalı ve karamelli... Rengarenk makaronlarımız kahve molalarınızın vazgeçilmezi olmaya aday. Özellikle misafirliklerde veya şık bir hediye arayışında olanlar için hazırladığımız özel makaron kutularımız çok seviliyor.' }] }
      ]
    },
    {
      title: 'Hediyelik Çikolata Alırken Dikkat Edilmesi Gerekenler',
      imageUrl: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?q=80&w=1200&auto=format&fit=crop', // gift chocolates
      filename: 'blog-hediye-cikolata.jpg',
      seo: {
        metaTitle: 'En Şık Hediyelik Çikolatalar ve Tavsiyeler | Dilim',
        metaDescription: 'Özel günlerde, kız isteme merasimlerinde veya kurumsal tebriklerde tercih edebileceğiniz şık ve lezzetli hediyelik çikolatalar.',
        metaKeywords: 'hediyelik çikolata, kız isteme çikolatası, madlen, spesiyal çikolata'
      },
      content: [
        { type: 'h2', children: [{ text: 'Bazen Kelimeler Yetmez, Çikolata Konuşur' }] },
        { type: 'paragraph', children: [{ text: 'Yeni iş tebriği, doğum ziyareti, kız isteme töreni ya da sadece içinizden geldiği için... Çikolata her duruma ayak uydurabilen en asil hediyedir.' }] },
        { type: 'h3', children: [{ text: 'Kutu Tasarımı ve İçerik' }] },
        { type: 'paragraph', children: [{ text: 'Kız isteme törenleri için gümüş veya gold detaylı, gösterişli kutular; kurumsal hediyeler için ise daha minimal ve elegant tasarımlar tercih edilmelidir. İçerikte ise her damağa hitap edecek sütlü, bitter ve beyaz çikolata spesiyallerinden oluşan karma bir aranjman her zaman garantidir.' }] }
      ]
    },
    {
      title: 'Cheesecake Yapımının Gizli Püf Noktaları',
      imageUrl: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?q=80&w=1200&auto=format&fit=crop', // cheesecake
      filename: 'blog-cheesecake.jpg',
      seo: {
        metaTitle: 'Mükemmel Cheesecake Yapımının Sırları | Dilim Blog',
        metaDescription: 'Çatlamayan, tam kıvamında, yumuşacık fırınlanmış San Sebastian ve New York usulü cheesecake tariflerinin ipuçları.',
        metaKeywords: 'cheesecake, san sebastian, tatlı tarifleri, püf noktaları'
      },
      content: [
        { type: 'h2', children: [{ text: 'Pürüzsüz Bir Doku İçin Sabır Şart' }] },
        { type: 'paragraph', children: [{ text: 'Cheesecake fırından çıktığında üzerinde oluşabilen çatlaklar, genellikle fırın kapağının çok erken açılması veya malzemelerin aşırı çırpılıp içine fazla hava hapsedilmesinden kaynaklanır.' }] },
        { type: 'paragraph', children: [{ text: 'Dilim Pastaneleri mutfağında hazırladığımız meşhur limonlu ve frambuazlı cheesecake\'lerimizin o pürüzsüz dokusunun ardında, taze labne peynirinin doğru sıcaklıkta yavaşça karıştırılması ve benmari usulü fırınlanması yatar.' }] }
      ]
    },
    {
      title: 'Kahve ve Tatlı Uyumu: Hangi Tatlı Hangi Kahveyle?',
      imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1200&auto=format&fit=crop', // coffee and sweet
      filename: 'blog-kahve-tatli.jpg',
      seo: {
        metaTitle: 'Tatlı ve Kahve Uyumu Sanatı | Dilim Pastaneleri',
        metaDescription: 'Filtre kahve, espresso veya Türk kahvesi... Kahvenizin notalarına en uygun tatlı eşleşmelerini keşfedin.',
        metaKeywords: 'kahve tatlı uyumu, espresso, pasta kahve, lezzet rehberi'
      },
      content: [
        { type: 'h2', children: [{ text: 'Lezzetleri Birbiriyle Çarpıştırmayın, Tamamlayın' }] },
        { type: 'paragraph', children: [{ text: 'Eğer oldukça tatlı, karamel veya yoğun sütlü çikolata içeren bir pasta yiyorsanız, yanına sade bir Filtre Kahve veya Americano tercih ederek damağınızı dengeleyebilirsiniz.' }] },
        { type: 'paragraph', children: [{ text: 'Buna karşılık taze demlenmiş, hafif köpüklü bir Türk Kahvesi, yanına kesinlikle çifte kavrulmuş fıstıklı taze lokum veya klasik bitter madlen çikolata ister. Kahvenin sert yapısı, çikolatanın yoğunluğuyla harika bir uyum yakalar.' }] }
      ]
    },
    {
      title: 'Dilim\'de Pazar Kahvaltıları Bir Başka!',
      imageUrl: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1200&auto=format&fit=crop', // breakfast pastry
      filename: 'blog-kahvalti.jpg',
      seo: {
        metaTitle: 'Pazar Kahvaltılarının Vazgeçilmezi Unlu Mamuller | Dilim',
        metaDescription: 'Sıcacık su böreği, çıtır kruvasanlar ve taptaze poğaçalarla güne enerjik başlayın. Kahvaltılık unlu mamullerimiz hakkında.',
        metaKeywords: 'kahvaltı, su böreği, poğaça, simit, pazar sabahı'
      },
      content: [
        { type: 'h2', children: [{ text: 'Fırından Yeni Çıkmış Bir Sabah' }] },
        { type: 'paragraph', children: [{ text: 'Pazar sabahı aileyi bir araya getiren kahvaltı sofrasının kokusu gibisi var mı? Sofranın tam ortasında duran, peyniri erimiş sıcak bir su böreği ya da bol tereyağlı çıtır çıtır kruvasanlar sabahın en güzel hediyesidir.' }] },
        { type: 'paragraph', children: [{ text: 'Her sabah gün ağarmadan şubelerimizde başlayan hummalı çalışmanın tek bir amacı var: Sizin kahvaltı sofranıza o enfes kokuyu en taze haliyle ulaştırabilmek.' }] }
      ]
    }
  ]

  for (const blogData of blogs) {
    try {
      const filepath = await downloadImage(blogData.imageUrl, blogData.filename)
      
      const fileData = {
        name: blogData.filename,
        data: fs.readFileSync(filepath),
        mimetype: 'image/jpeg',
        size: fs.statSync(filepath).size,
      }
      
      const mediaDoc = await payload.create({
        collection: 'media',
        data: { alt: blogData.title },
        file: fileData,
      })
      
      await payload.create({
        collection: 'blog',
        data: {
          title: blogData.title,
          content: blogData.content as any,
          image: mediaDoc.id,
          seo: blogData.seo,
        }
      })
      console.log(`Oluşturuldu: ${blogData.title}`)
      
    } catch (err) {
      console.error(`Hata: ${blogData.title}`, err)
    }
  }

  console.log('Tüm blog işlemleri başarıyla tamamlandı.')
  process.exit(0)
}

run()
