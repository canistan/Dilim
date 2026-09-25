import 'dotenv/config'
import payload from 'payload'
import config from '../src/payload.config'
import OpenAI from 'openai'

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const generateSEO = async (productName: string, categoryName: string) => {
  const prompt = `
Sen Dilim Pastaneleri'nin uzman SEO yöneticisisin. Sana verdiğim ürünün adına ve kategorisine bakarak, Google'da en çok tıklanacak şekilde bir SEO Başlığı (Title) ve SEO Açıklaması (Description) üret.

Kurallar:
1. Başlık (Title) maksimum 60 karakter olmalı.
2. Açıklama (Description) maksimum 155 karakter olmalı.
3. Anlamı kesinlikle bozma, sahte veya alakasız ürün vaadinde bulunma.
4. İçerisine Kavacık veya Ümraniye kelimelerini ürünün doğasına uygun şekilde dengeli yerleştir (ikisini birden veya tek birini). Bazen hiçbirini koymasan da olur eğer sığmıyorsa ama önceliğin yerel SEO.
5. 'Beykoz' kelimesini ASLA kullanma.
6. İştah açıcı, lüks ve 'sipariş' odaklı kelimeler (örn: taze, günlük üretim, aynı gün teslimat, siparişi) kullan.
7. Çıktıyı SADECE JSON formatında ver. Ekstra hiçbir açıklama veya markdown backtick ( \`\`\` ) kullanma.

Format:
{
  "title": "Ürün Adı Siparişi | Kavacık & Ümraniye",
  "description": "Buraya maksimum 155 karakterlik iştah açıcı açıklama gelecek."
}

Ürün Adı: ${productName}
Kategori: ${categoryName}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) return null;
    return JSON.parse(content);
  } catch (error) {
    console.error(`\n[!] Error generating SEO for ${productName}:`, error);
    return null;
  }
}

const run = async () => {
  try {
    console.log('Payload başlatılıyor...');
    await payload.init({ config, local: true })
    
    console.log('Ürünler çekiliyor...');
    const products = await payload.find({
      collection: 'products',
      limit: 1000,
    })

    console.log(`\nToplam ${products.totalDocs} ürün bulundu. SEO optimizasyonu başlıyor...\n`);

    let count = 0;
    let successCount = 0;

    for (const product of products.docs) {
      let categoryName = 'Pastane Ürünleri';
      if (product.category && typeof product.category === 'object' && product.category.title) {
          categoryName = product.category.title;
      }

      console.log(`[${count + 1}/${products.totalDocs}] İşleniyor: ${product.title}`);
      
      const seoData = await generateSEO(product.title, categoryName);
      
      if (seoData && seoData.title && seoData.description) {
        await payload.update({
          collection: 'products',
          id: product.id,
          data: {
            meta: {
              title: seoData.title,
              description: seoData.description
            }
          }
        });
        console.log(`  ✓ Title: ${seoData.title}`);
        console.log(`  ✓ Desc:  ${seoData.description}\n`);
        successCount++;
      } else {
        console.log(`  ✗ Hata: SEO üretilemedi.\n`);
      }
      
      count++;
      // API Rate limitine takılmamak için 500ms bekle
      await new Promise(r => setTimeout(r, 500));
    }
    
    console.log(`\nTebrikler! Toplam ${successCount}/${products.totalDocs} ürünün SEO Meta etiketleri OpenAI ile güncellendi.`);
    process.exit(0)
  } catch (err) {
    console.error("Script Hatası:", err);
    process.exit(1)
  }
}

run()
