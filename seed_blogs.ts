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
  console.log('Blog içerikleri oluşturuluyor...')

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
        {
          type: 'h2',
          children: [{ text: 'Küçük Bir Fırından Büyük Bir Aileye' }]
        },
        {
          type: 'paragraph',
          children: [{ text: 'Her şey 30 yıl önce, sabahın erken saatlerinde mahallemize yayılan taze poğaça ve ekmek kokularıyla başladı. O zamanlar küçük, mütevazı bir fırındık. Ancak içimizdeki lezzet tutkusu ve müşterilerimizin yüzündeki tebessüm, bizi bugünlere taşıyan en büyük motivasyon kaynağı oldu.' }]
        },
        {
          type: 'paragraph',
          children: [{ text: 'Bugün, sadece pasta yapmıyoruz; özel anılarınızı tatlandırıyor, sevdiklerinizle paylaştığınız mutluluğa ortak oluyoruz. Her dilimde aynı kalite, her lokmada aynı özen var.' }]
        }
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
        {
          type: 'h2',
          children: [{ text: 'Mükemmel Pastayı Bulma Rehberi' }]
        },
        {
          type: 'paragraph',
          children: [{ text: 'Doğum günleri, sevdiklerimizle bir araya geldiğimiz en özel günlerden biridir. Ve bir doğum gününün olmazsa olmazı şüphesiz ki harika bir pastadır. Peki, mükemmel pastayı nasıl seçmelisiniz?' }]
        },
        {
          type: 'h3',
          children: [{ text: '1. Misafir Sayısını Doğru Hesaplayın' }]
        },
        {
          type: 'paragraph',
          children: [{ text: 'Pastanın boyutu, misafir sayısına göre belirlenmelidir. Kimse pastasız kalmak istemez! Standart olarak 1 numaralı pastalarımız 6-8 kişiliktir.' }]
        },
        {
          type: 'h3',
          children: [{ text: '2. Damak Tadını Göz Önünde Bulundurun' }]
        },
        {
          type: 'paragraph',
          children: [{ text: 'Çikolata tutkunları için yoğun ganajlı, meyve severler için hafif ve ferah pastalar tercih edilebilir. Kutlanacak kişinin favori lezzetini bilmek en önemli adımdır.' }]
        }
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
        {
          type: 'h2',
          children: [{ text: 'Gerçek Çikolatanın Sırları' }]
        },
        {
          type: 'paragraph',
          children: [{ text: 'Birçoğumuz çikolatayı çok severiz ancak gerçek ve kaliteli bir çikolatayı sıradan bir çikolatadan ayırmak uzmanlık gerektirebilir. İşte size birkaç ipucu:' }]
        },
        {
          type: 'paragraph',
          children: [{ text: 'Öncelikle, kaliteli çikolata parlak bir görünüme sahiptir. Mat veya üzerinde beyaz benekler olan çikolatalar genellikle yanlış sıcaklıkta saklanmış demektir.' }]
        },
        {
          type: 'paragraph',
          children: [{ text: 'İkinci olarak, kırıldığında tok bir "çıt" sesi çıkarmalıdır. Bu ses, kakao yağının doğru şekilde temperlendiğinin bir göstergesidir.' }]
        }
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
      
      // Check if it exists
      const existing = await payload.find({
        collection: 'blog',
        where: { title: { equals: blogData.title } }
      })
      
      if (existing.totalDocs > 0) {
        await payload.update({
          collection: 'blog',
          id: existing.docs[0].id,
          data: {
            content: blogData.content as any,
            image: mediaDoc.id,
            seo: blogData.seo,
          }
        })
        console.log(`Güncellendi: ${blogData.title}`)
      } else {
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
      }
    } catch (err) {
      console.error(`Hata: ${blogData.title}`, err)
    }
  }

  console.log('Blog içerikleri tamamlandı.')
  process.exit(0)
}

run()
