import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })

    // Helper to upload media
    const uploadMedia = async (filename: string, alt: string) => {
      const filePath = path.join(process.cwd(), 'public', filename)
      if (!fs.existsSync(filePath)) return null

      const buffer = fs.readFileSync(filePath)
      const ext = path.extname(filename).toLowerCase()
      let mimetype = 'image/png'
      if (ext === '.jpg' || ext === '.jpeg') mimetype = 'image/jpeg'
      
      const media = await payload.create({
        collection: 'media',
        data: { alt },
        file: {
          data: buffer,
          mimetype,
          name: filename,
          size: buffer.length
        }
      })
      return media.id
    }

    // Upload images
    const heroImage = await uploadMedia('hakkimizda_hero.png', 'Hakkımızda Hero')
    const storyImage1 = await uploadMedia('detay_pasta_3.png', 'Detay Pasta 3')
    const storyImage2 = await uploadMedia('hakkimizda_chef.png', 'Şefimiz') // unsplash yerine lokal
    const storyImage3 = await uploadMedia('detay_pasta_1.png', 'Detay Pasta 1')
    const storyImage4 = await uploadMedia('detay_pasta_2.png', 'Detay Pasta 2')
    const founderImage = await uploadMedia('mehmet_sahin.jpg', 'Mehmet Şahin')

    await payload.updateGlobal({
      slug: 'about-settings' as any,
      data: {
        heroImage,
        heroSubtitle: "1977'den Beri",
        heroTitle: 'Hakkımızda',
        storyTitle: "Kuzguncuk'tan Gelen",
        storySubtitle: 'Geleneksel Lezzet',
        storyContent: [
          { paragraph: "<strong>Dilim Pastaneleri</strong> 1977 yılında, İstanbul’un tarihi semtlerinden biri olan boğazın girişindeki Kuzguncuk semtinde, Hayri, Hüsnü ve Mehmet ŞAHİN kardeşler tarafından kurulmuştur. Kısa sürede hizmet ve lezzet farklılığını mahalle sakinlerine kabul ettirerek, ününü semtin dışına da taşımış, semt dışından birçok kişi Dilim Pastaneleri’nin sadık müşterisi olmuştur." },
          { paragraph: "2000 yılında, Mehmet ŞAHİN, nefis börek, poğaça, pasta, dondurma ve tatlıların eşsiz lezzetini, yeni gelişmekte olan <strong>Kavacık</strong> semtine taşıyarak modern imalathanesiyle birlikte yeni bir başlangıç yapmıştır. Kavacık'ın vazgeçilmez lezzet durağı haline gelen markamız, kısa sürede prestijli bir konuma ulaşmıştır." },
          { paragraph: "Ümraniye ilçesinden gelen yoğun talep üzerine Eğitim ve Araştırma Hastanesinin karşısına <strong>Ümraniye</strong> şubesi açılmış; burada 200 m²’lik modern, hijyenik imalathanemizle birlikte daha geniş bir hizmet alanına geçilmiştir." },
          { paragraph: "Şu anda, İstanbul’un Anadolu yakasında <strong>Kavacık Merkez ve Ümraniye olmak üzere 2 şubemizle</strong> hizmet vermekteyiz. ISO ve HACCP kalite standartlarının uygulandığı, alanında uzman ustalarımız ve güler yüzlü ekibimizle birlikte yaş pasta, kuru pasta, tatlı ve dondurma gibi birçok özel lezzeti üreterek misafirlerimize en taze haliyle sunmanın haklı gururunu yaşıyoruz." }
        ],
        storyImage1,
        storyImage2,
        storyImage3,
        storyImage4,
        founderImage,
        founderQuote: "\"1977'den bu yana tek bir gayemiz var: En özel günlerinizde masanızda yer almak ve sizlere yalnızca en taze lezzetleri sunmak. Çeyrek asrı aşan bu yolculukta bizi aileden biri olarak gören tüm müşterilerimize sonsuz teşekkürler.\"",
        founderName: 'Mehmet Şahin',
        founderTitle: 'Dilim Pastaneleri Kurucusu',
        valuesTitle: 'Değerlerimiz',
        values: [
          { icon: 'star', title: 'Üstün Kalite', description: 'ISO ve HACCP standartlarında, en kaliteli hammaddelerle tavizsiz üretim.' },
          { icon: 'heart', title: 'Geleneksel Lezzet', description: '1977\'den gelen reçetelerimizle, geçmişin samimiyetini bugüne taşıyoruz.' },
          { icon: 'award', title: 'Ustalık', description: 'Alanında uzman, tecrübeli şeflerimizin sanat eseri tadında dokunuşları.' },
          { icon: 'coffee', title: 'Misafirperverlik', description: 'Her bir müşterimizi evimizde ağırlıyormuşçasına gösterdiğimiz özen ve ilgi.' }
        ]
      }
    })

    return NextResponse.json({ success: true, message: 'About page seeded successfully!' })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
