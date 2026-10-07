import 'dotenv/config';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import fs from 'fs';
import path from 'path';
import os from 'os';
import sharp from 'sharp';

async function run() {
  const payload = await getPayload({ config: configPromise });
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    console.error("Lütfen OPENAI_API_KEY'i .env dosyasına ekleyin.");
    process.exit(1);
  }

  // Komut satırından kategori adını al
  const targetCategory = process.argv[2];

  // Tüm ürünleri çek (kategori bilgisiyle beraber)
  const products = await payload.find({
    collection: 'products',
    limit: 1000,
    depth: 1, // Kategoriyi detaylı çekmek için
  });

  // Görseli olmayan veya test görseli olan ürünleri filtrele
  const missingImageProducts = products.docs.filter(
    (p: any) => !p.image || (typeof p.image === 'object' && p.image?.filename === 'test.jpg') || (typeof p.image === 'string' && p.image === '6665796a6036130b0e527d42')
  );

  // Eğer komuta kategori girilmediyse, hangi kategoride kaç eksik ürün var listele
  if (!targetCategory) {
    console.log("⚠️ Lütfen çalıştırmak istediğiniz kategoriyi tırnak içinde belirtin.");
    console.log("Örnek kullanım: npx tsx scripts/generate_category_preview.ts \"Şerbetli Tatlılar\"\n");
    
    const categoryCounts: Record<string, number> = {};
    for (const p of missingImageProducts) {
      const catName = p.category && typeof p.category === 'object' ? p.category.title : 'Kategorisiz';
      categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
    }
    
    console.log("📊 Eksik Görselli Ürünlerin Kategorilere Göre Dağılımı:");
    for (const [cat, count] of Object.entries(categoryCounts)) {
      console.log(`- "${cat}": ${count} ürün`);
    }
    process.exit(0);
  }

  // Sadece hedeflenen kategorideki eksik görselli ürünleri seç
  const categoryProducts = missingImageProducts.filter((p: any) => {
    const catName = p.category && typeof p.category === 'object' ? p.category.title : 'Kategorisiz';
    return catName === targetCategory;
  });

  if (categoryProducts.length === 0) {
    console.log(`❌ "${targetCategory}" kategorisinde görseli eksik olan ürün bulunamadı.`);
    process.exit(0);
  }

  console.log(`\n🚀 "${targetCategory}" kategorisi için ${categoryProducts.length} adet görsel üretimi başlıyor...`);

  // Masaüstünde onay klasörünü oluştur
  const safeCategoryName = targetCategory.replace(/[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ ]/g, "").trim();
  const outputDir = path.join(os.homedir(), 'Desktop', 'Dilim_Gorsel_Onay', safeCategoryName);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`📁 Görseller şuraya kaydedilecek: ${outputDir}\n`);

  for (let i = 0; i < categoryProducts.length; i++) {
    const product = categoryProducts[i];
    console.log(`[${i+1}/${categoryProducts.length}] Üretiliyor: ${product.title}`);

    try {
      // 1. AŞAMA: GPT-4o-mini ile muazzam bir prompt hazırlat
      const systemPrompt = `Sen Türkiye'de lüks bir pastanenin yemek fotoğrafçısı ve sanat yönetmenisin. Sana bir Türk pastanesi ürününün adı ve kategorisi verilecek. Senin görevin DALL-E 3 için mükemmel, iştah açıcı ve kültürel olarak tamamen DOĞRU bir İngilizce fotoğraf promptu yazmak. 
Kurallar:
1. Pizza diyorsa bu İtalyan dev pizza değil, Türk pastane usulü (kalın hamurlu, poğaça hamuruna benzer) mini pizza veya dilim pizzadır.
2. Midye diyorsa (kategori şerbetli tatlıysa), bu deniz ürünü olan midye değil, fıstıklı şerbetli baklava türü olan "Midye Tatlısı"dır.
3. Arka plan modern temiz mermer veya şık bir ahşap pastane tezgahı olsun. 
4. Gerçekçi (DSLR 4k) olsun, plastik veya aşırı yapay zeka (AI) gibi durmasın.
5. SADECE İngilizce prompt metnini ver, başka hiçbir şey yazma.`;

      const userMsg = `Product Name: ${product.title}\nCategory: ${targetCategory}`;

      const chatRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMsg }
          ],
          temperature: 0.7
        })
      });

      const chatData = await chatRes.json();
      if (!chatRes.ok || !chatData.choices) {
        console.error(`   ❌ OpenAI API (Chat) Hatası:`, JSON.stringify(chatData, null, 2));
        continue;
      }
      const dallePrompt = chatData.choices[0].message.content.trim();
      console.log(`   💡 GPT Promptu hazırlandı.`);

      // 2. AŞAMA: DALL-E 3 ile görseli üret
      const imageRes = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'chatgpt-image-latest',
          prompt: dallePrompt,
          n: 1,
          size: '1024x1024'
        })
      });

      const imageData = await imageRes.json();
      if (!imageRes.ok || !imageData.data || (!imageData.data[0].url && !imageData.data[0].b64_json)) {
        // DALL-E Hatası logunu kısalt (base64'ü ekrana basmasın)
        console.error(`   ❌ DALL-E Hatası: Beklenmeyen veri formatı.`);
        continue;
      }

      let buffer: Buffer;
      if (imageData.data[0].b64_json) {
        buffer = Buffer.from(imageData.data[0].b64_json, 'base64');
      } else {
        const imageUrl = imageData.data[0].url;
        const imgFetch = await fetch(imageUrl);
        const arrayBuffer = await imgFetch.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
      }

      const webpBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();
      const safeTitle = product.title.replace(/[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ ]/g, "").trim();
      
      const imagePath = path.join(outputDir, `${safeTitle}.webp`);
      const promptPath = path.join(outputDir, `${safeTitle}_prompt.txt`);

      fs.writeFileSync(imagePath, webpBuffer);
      fs.writeFileSync(promptPath, dallePrompt); // Ne üretildiğini bilmek için promptu da kaydediyoruz

      console.log(`   ✅ Kaydedildi: ${safeTitle}.webp`);

      // Rate limit koruması (Tier 1 için 5 RPM -> 12 saniye bekleme)
      await new Promise(r => setTimeout(r, 12500));

    } catch (err: any) {
      console.error(`   ❌ Sistem Hatası (${product.title}):`, err.message);
    }
  }

  console.log(`\n🎉 "${targetCategory}" kategorisi bitti! Görselleri Masaüstü/Dilim_Gorsel_Onay klasöründen inceleyebilirsiniz.`);
  process.exit(0);
}

run().catch(console.error);
