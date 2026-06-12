import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'
import fs from 'fs'
import path from 'path'

async function uploadLocalImage(payload: any, localPath: string, altText: string) {
  try {
    const fullPath = path.join(process.cwd(), 'public', localPath)
    if (!fs.existsSync(fullPath)) {
      console.log(`Uyarı: Resim bulunamadı ${fullPath}`)
      return null
    }

    const filename = path.basename(fullPath)
    
    // Check if already exists
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } }
    })

    if (existing.totalDocs > 0) {
      console.log(`Resim zaten var: ${filename}`)
      return existing.docs[0].id
    }

    const fileData = {
      name: filename,
      data: fs.readFileSync(fullPath),
      mimetype: filename.endsWith('.png') ? 'image/png' : 'image/jpeg',
      size: fs.statSync(fullPath).size,
    }
    
    const mediaDoc = await payload.create({
      collection: 'media',
      data: { alt: altText },
      file: fileData,
    })
    
    console.log(`Resim yüklendi: ${filename}`)
    return mediaDoc.id
  } catch (e) {
    console.error(`Resim yüklenirken hata: ${localPath}`, e)
    return null
  }
}

async function run() {
  const payload = await getPayload({ config: configPromise })
  console.log('Anasayfa (Homepage) verileri dolduruluyor...')

  // Upload images
  const heroImageId = await uploadLocalImage(payload, 'generated/hero_cake_4k.png', 'Premium Yaş Pasta Hero')
  const cat1ImageId = await uploadLocalImage(payload, 'generated/category_yas_pastalar.png', 'Yaş Pastalar')
  const cat2ImageId = await uploadLocalImage(payload, 'generated/category_tasarla.png', 'Kendi Pastanı Tasarla')
  const cat3ImageId = await uploadLocalImage(payload, 'generated/category_tatlilar.png', 'Tatlılar ve Ekler')

  const homepageData = {
    heroTitle: 'Özel Anlarınıza Tatlı Bir Dokunuş',
    heroSubtitle: 'Özel günleriniz ve tatlı krizleriniz için özenle hazırlanan günlük pastalarımızı keşfedin. Kendi pastanızı tasarlayın veya menümüzden seçin.',
    heroImage: heroImageId,
    heroButton1Text: 'Hemen Tasarla',
    heroButton1Link: '/tasarla',
    heroButton2Text: 'Ürünleri İncele',
    heroButton2Link: '/urunler',
    
    featuredSectionEyebrow: 'Seçimlerimiz',
    featuredSectionTitle: 'Sizin İçin Önerilenler',
    
    fallbackCards: [
      {
        title: 'Yaş Pastalar',
        link: '/urunler?kategori=yas-pastalar',
        buttonText: 'Koleksiyonu İncele',
        image: cat1ImageId
      },
      {
        title: 'Kendi Pastanı Tasarla',
        link: '/tasarla',
        buttonText: 'Hemen Tasarla',
        image: cat2ImageId
      },
      {
        title: 'Tatlılar & Ekler',
        link: '/urunler?kategori=tatlilar',
        buttonText: 'Koleksiyonu İncele',
        image: cat3ImageId
      }
    ]
  }

  try {
    await payload.updateGlobal({
      slug: 'homepage',
      data: homepageData as any,
    })
    console.log('Anasayfa ayarları başarıyla güncellendi!')
  } catch (err) {
    console.error('Anasayfa güncellenirken hata oluştu:', err)
  }

  process.exit(0)
}

run()
