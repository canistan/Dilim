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

  const generatePrompt = (productName: string) => {
    return `A high-quality, professional food photography of "${productName}". The food is placed on a modern clean marble or rustic wooden bakery counter. Bright, natural lighting, soft shadows, warm and inviting atmosphere. Authentic bakery photography style, avoiding over-saturated or futuristic AI looks. Shot with a DSLR, 4k resolution.`;
  };

  const products = await payload.find({
    collection: 'products',
    limit: 200,
  });

  const missingImageProducts = products.docs.filter(
    (p: any) => !p.image || (typeof p.image === 'object' && p.image?.filename === 'test.jpg') || (typeof p.image === 'string' && p.image === '6665796a6036130b0e527d42')
  );

  console.log(`[BAŞLIYOR] Eksik görseli olan toplam ${missingImageProducts.length} ürün bulundu.`);

  for (let i = 0; i < missingImageProducts.length; i++) {
    const product = missingImageProducts[i];
    console.log(`[${i+1}/${missingImageProducts.length}] Üretiliyor: ${product.title}`);

    try {
      const prompt = generatePrompt(product.title);
      
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
        console.error(`Hata: ${product.title} için resim üretilemedi. Yanıt:`, JSON.stringify(data));
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

      const filename = `${product.slug || product.id}-image.webp`;
      const tempFilePath = path.join(TEMP_DIR, filename);
      fs.writeFileSync(tempFilePath, webpBuffer);

      const media = await payload.create({
        collection: 'media',
        data: { alt: product.title },
        file: {
          data: webpBuffer,
          mimetype: 'image/webp',
          name: filename,
          size: webpBuffer.length,
        }
      });

      await payload.update({
        collection: 'products',
        id: product.id,
        data: { image: media.id }
      });

      console.log(`✅ Başarılı: ${product.title} veritabanına eklendi.`);
      fs.unlinkSync(tempFilePath);

      // Rate limit koruması (Tier 1 için 5 RPM)
      await new Promise(r => setTimeout(r, 12500));

    } catch (err: any) {
      console.error(`X Hata (${product.title}):`, err.message);
      await new Promise(r => setTimeout(r, 12500));
    }
  }

  console.log("🎉 Tüm işlemler başarıyla tamamlandı!");
  process.exit(0);
}

run().catch(console.error);
