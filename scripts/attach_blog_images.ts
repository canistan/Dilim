import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import fs from 'fs';
import path from 'path';

async function run() {
  const payload = await getPayload({ config: configPromise });

  const imagesToAttach = [
    {
      keyword: 'Söz',
      filename: 'blog_soz_nisan_1790350520950.jpg'
    },
    {
      keyword: 'Doğum Günü',
      filename: 'blog_dogum_gunu_umraniye_1790350532011.jpg'
    },
    {
      keyword: 'Yaş Pasta',
      filename: 'blog_kavacik_yas_pasta_1790350543178.jpg'
    },
    {
      keyword: 'Kurumsal',
      filename: 'blog_kurumsal_pasta_1790350555180.jpg'
    },
    {
      keyword: 'Glutensiz',
      filename: 'blog_glutensiz_pasta_1790350565736.jpg'
    },
    {
      keyword: 'Çikolatalı',
      filename: 'blog_cikolata_kahve_1790350577292.jpg'
    },
    {
      keyword: 'Düğün',
      filename: 'blog_dugun_pastasi_1790350589139.jpg'
    },
    {
      keyword: 'Çocuk',
      filename: 'blog_cocuk_dogum_gunu_1790370007322.jpg'
    }
  ];

  const artifactDir = '/Users/canalbayrak/.gemini/antigravity-ide/brain/dcf6d1c5-efdf-48a2-91c7-a15b2735c1eb';

  const blogs = await payload.find({
    collection: 'blog',
    limit: 100,
  });

  for (const mapping of imagesToAttach) {
    const blog = blogs.docs.find((b: any) => b.title.includes(mapping.keyword));
    if (blog) {
      console.log(`Eşleştirildi: "${blog.title}" -> ${mapping.filename}`);
      
      const filePath = path.join(artifactDir, mapping.filename);
      if (fs.existsSync(filePath)) {
        const buffer = fs.readFileSync(filePath);
        
        try {
          const media = await payload.create({
            collection: 'media',
            data: { alt: blog.title },
            file: {
              data: buffer,
              mimetype: 'image/jpeg',
              name: mapping.filename,
              size: buffer.length,
            }
          });

          await payload.update({
            collection: 'blog',
            id: blog.id,
            data: { image: media.id }
          });
          console.log(`✅ Başarılı: ${blog.title} güncellendi.`);
        } catch (err) {
          console.error(`Media ekleme hatası:`, err);
        }
      } else {
         console.log(`⚠️ Dosya bulunamadı: ${filePath}`);
      }
    }
  }

  console.log("İşlem tamamlandı!");
  process.exit(0);
}

run();
