import 'dotenv/config';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function run() {
  const payload = await getPayload({ config: configPromise });
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    console.error("Lütfen OPENAI_API_KEY'i .env dosyasına ekleyin.");
    process.exit(1);
  }

  const TEMP_DIR = path.resolve(process.cwd(), 'temp_images');
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
  }

  const generatePrompt = (blogTitle: string) => {
    return `A high-quality, professional, appetizing photography representing the concept of "${blogTitle}". It should be related to patisserie, bakery, desserts, or celebration moments. Bright, natural lighting, modern aesthetic, beautiful composition. Shot with a DSLR, 4k resolution, highly detailed.`;
  };

  const blogs = await payload.find({
    collection: 'blog',
    limit: 100,
  });

  const missingImageBlogs = blogs.docs.filter(
    (b: any) => !b.image || (typeof b.image === 'object' && b.image?.filename === 'test.jpg') || (typeof b.image === 'string' && b.image === '6665796a6036130b0e527d42')
  );

  console.log(`[BAŞLIYOR] Eksik görseli olan toplam ${missingImageBlogs.length} blog bulundu.`);

  for (let i = 0; i < missingImageBlogs.length; i++) {
    const blog = missingImageBlogs[i];
    console.log(`[${i+1}/${missingImageBlogs.length}] Üretiliyor: ${blog.title}`);

    try {
      const prompt = generatePrompt(blog.title);
      
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: '1024x1024',
          response_format: 'url'
        })
      });

      const data = await response.json();

      if (!response.ok || !data.data || !data.data[0].url) {
        console.error(`Hata: ${blog.title} için resim üretilemedi. Yanıt:`, JSON.stringify(data));
        await new Promise(r => setTimeout(r, 12500));
        continue;
      }

      const imageUrl = data.data[0].url;
      const imgRes = await fetch(imageUrl);
      const arrayBuffer = await imgRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const webpBuffer = await sharp(buffer)
        .webp({ quality: 80 })
        .toBuffer();

      const filename = `${blog.slug || blog.id}-blog.webp`;
      const tempFilePath = path.join(TEMP_DIR, filename);
      fs.writeFileSync(tempFilePath, webpBuffer);

      const media = await payload.create({
        collection: 'media',
        data: { alt: blog.title },
        file: {
          data: webpBuffer,
          mimetype: 'image/webp',
          name: filename,
          size: webpBuffer.length,
        }
      });

      await payload.update({
        collection: 'blog',
        id: blog.id,
        data: { image: media.id }
      });

      console.log(`✅ Başarılı: ${blog.title} veritabanına eklendi.`);
      fs.unlinkSync(tempFilePath);

      // Rate limit koruması (Tier 1 için 5 RPM -> 12 saniye bekleme)
      if (i < missingImageBlogs.length - 1) {
        console.log("Rate limit için 12.5 saniye bekleniyor...");
        await new Promise(r => setTimeout(r, 12500));
      }

    } catch (err) {
      console.error(`Beklenmeyen hata (${blog.title}):`, err);
    }
  }

  console.log("Blog görselleri işlemi tamamlandı!");
  process.exit(0);
}

run();
