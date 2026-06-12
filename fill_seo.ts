import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'

async function run() {
  const payload = await getPayload({ config: configPromise })
  console.log('Blog yazılarının SEO alanları otomatik oluşturuluyor...')

  const result = await payload.find({
    collection: 'blog',
    limit: 100,
  })

  for (const doc of result.docs) {
    try {
      let newMeta: any = doc.meta || {};
      let isModified = false;

      // Eğer SEO title yoksa, otomatik oluştur
      if (!newMeta.title || newMeta.title.trim() === '') {
        newMeta.title = `${doc.title} | Dilim Pastaneleri`;
        isModified = true;
      }

      // Eğer SEO description yoksa, otomatik oluştur
      if (!newMeta.description || newMeta.description.trim() === '') {
        let desc = 'Dilim Pastaneleri - Özel günlerinizi tatlandırın.';
        
        // İçerikten ilk metni çıkarmaya çalış (Lexical json yapısı)
        if (doc.content && typeof doc.content === 'object') {
          try {
            const root = (doc.content as any).root;
            if (root && root.children) {
              const paragraphs = root.children.filter((c: any) => c.type === 'paragraph');
              if (paragraphs.length > 0 && paragraphs[0].children) {
                const texts = paragraphs[0].children.map((c: any) => c.text).join(' ');
                if (texts.length > 10) {
                  desc = texts.substring(0, 150);
                  if (texts.length > 150) desc += '...';
                }
              }
            }
          } catch(e) {}
        }
        
        newMeta.description = desc;
        isModified = true;
      }

      // Resim yoksa öne çıkan görseli SEO görseli yap
      if (!newMeta.image && doc.image) {
        newMeta.image = typeof doc.image === 'object' ? doc.image.id : doc.image;
        isModified = true;
      }

      if (isModified) {
        await payload.update({
          collection: 'blog',
          id: doc.id,
          data: {
            meta: newMeta
          }
        })
        console.log(`SEO güncellendi: ${doc.title}`)
      } else {
        console.log(`Zaten dolu: ${doc.title}`)
      }

    } catch (err) {
      console.error(`Hata: ${doc.title}`, err)
    }
  }

  console.log('Tüm blog SEO işlemleri tamamlandı.')
  process.exit(0)
}

run()
