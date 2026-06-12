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

function createLexicalContent(heading: string, paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'heading',
          tag: 'h2',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'text',
              format: 0,
              mode: 'normal',
              style: '',
              text: heading,
              version: 1,
            },
          ],
        },
        ...paragraphs.map(p => ({
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'text',
              format: 0,
              mode: 'normal',
              style: '',
              text: p,
              version: 1,
            },
          ],
        }))
      ],
    },
  }
}

async function run() {
  const payload = await getPayload({ config: configPromise })
  console.log('Blog içerikleri düzeltiliyor (Lexical & SEO Meta)...')

  const blogs = [
    {
      title: 'Pastacılıkta 30 Yıllık Serüvenimiz',
      imageUrl: 'https://images.unsplash.com/photo-1557308536-ee471ef2c390?q=80&w=1200&auto=format&fit=crop',
      filename: 'blog-pastane-seruven.jpg',
      meta: {
        title: 'Pastacılıkta 30 Yıllık Serüvenimiz | Dilim Pastaneleri',
        description: 'Dilim Pastaneleri olarak 30 yıldır sizlere en taze ve lezzetli pastaları sunmanın gururunu yaşıyoruz. Hikayemizi keşfedin.',
      },
      content: createLexicalContent(
        'Küçük Bir Fırından Büyük Bir Aileye',
        [
          'Her şey 30 yıl önce, sabahın erken saatlerinde mahallemize yayılan taze poğaça ve ekmek kokularıyla başladı. O zamanlar küçük, mütevazı bir fırındık. Ancak içimizdeki lezzet tutkusu ve müşterilerimizin yüzündeki tebessüm, bizi bugünlere taşıyan en büyük motivasyon kaynağı oldu.',
          'Bugün, sadece pasta yapmıyoruz; özel anılarınızı tatlandırıyor, sevdiklerinizle paylaştığınız mutluluğa ortak oluyoruz. Her dilimde aynı kalite, her lokmada aynı özen var.'
        ]
      )
    },
    {
      title: 'Doğum Günü Pastası Seçerken Nelere Dikkat Edilmeli?',
      imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=1200&auto=format&fit=crop',
      filename: 'blog-dogum-gunu.jpg',
      meta: {
        title: 'Doğum Günü Pastası Seçme Rehberi | Dilim Pastaneleri',
        description: 'Sevdikleriniz için unutulmaz bir doğum günü pastası seçmenin püf noktaları. Tema, lezzet ve porsiyon önerileri.',
      },
      content: createLexicalContent(
        'Mükemmel Pastayı Bulma Rehberi',
        [
          'Doğum günleri, sevdiklerimizle bir araya geldiğimiz en özel günlerden biridir. Ve bir doğum gününün olmazsa olmazı şüphesiz ki harika bir pastadır. Peki, mükemmel pastayı nasıl seçmelisiniz?',
          '1. Misafir Sayısını Doğru Hesaplayın: Pastanın boyutu, misafir sayısına göre belirlenmelidir. Kimse pastasız kalmak istemez!',
          '2. Damak Tadını Göz Önünde Bulundurun: Çikolata tutkunları için yoğun ganajlı, meyve severler için hafif ve ferah pastalar tercih edilebilir. Kutlanacak kişinin favori lezzetini bilmek en önemli adımdır.'
        ]
      )
    },
    {
      title: 'Çikolatanın İyisi Nasıl Anlaşılır?',
      imageUrl: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=1200&auto=format&fit=crop',
      filename: 'blog-cikolata.jpg',
      meta: {
        title: 'Gerçek ve Kaliteli Çikolata Nasıl Anlaşılır? | Dilim',
        description: 'Kaliteli çikolatayı anlamanın yolları nelerdir? Kakao oranından parlaklığına, gerçek çikolatanın sırları.',
      },
      content: createLexicalContent(
        'Gerçek Çikolatanın Sırları',
        [
          'Birçoğumuz çikolatayı çok severiz ancak gerçek ve kaliteli bir çikolatayı sıradan bir çikolatadan ayırmak uzmanlık gerektirebilir. İşte size birkaç ipucu:',
          'Öncelikle, kaliteli çikolata parlak bir görünüme sahiptir. Mat veya üzerinde beyaz benekler olan çikolatalar genellikle yanlış sıcaklıkta saklanmış demektir.',
          'İkinci olarak, kırıldığında tok bir "çıt" sesi çıkarmalıdır. Bu ses, kakao yağının doğru şekilde temperlendiğinin bir göstergesidir.'
        ]
      )
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
      
      let mediaId;
      const existingMedia = await payload.find({
        collection: 'media',
        where: { filename: { equals: blogData.filename } }
      })

      if (existingMedia.totalDocs > 0) {
        mediaId = existingMedia.docs[0].id;
      } else {
        const mediaDoc = await payload.create({
          collection: 'media',
          data: { alt: blogData.title },
          file: fileData,
        })
        mediaId = mediaDoc.id;
      }

      blogData.meta.image = mediaId; // Assign image to SEO meta
      
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
            image: mediaId,
            meta: blogData.meta,
          }
        })
        console.log(`Güncellendi: ${blogData.title}`)
      } else {
        await payload.create({
          collection: 'blog',
          data: {
            title: blogData.title,
            content: blogData.content as any,
            image: mediaId,
            meta: blogData.meta,
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
