import { config } from 'dotenv';
config();
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import fs from 'fs';
import path from 'path';

async function updateCategories() {
  console.log("Payload başlatılıyor...");
  const payload = await getPayload({ config: configPromise });

  // 1. Mevcut kategorileri çekelim
  const categoriesRes = await payload.find({
    collection: 'categories',
    limit: 100,
  });

  const categories = categoriesRes.docs;
  console.log(`Veritabanında ${categories.length} adet kategori bulundu.`);

  // Kategori adından ID'ye hızlı erişim haritası
  const categoryMap: Record<string, string | number> = {};
  categories.forEach(cat => {
    categoryMap[cat.title.toLowerCase().trim()] = cat.id;
  });

  // Eğer "Tatlılar" kategorisi yoksa, uyar.
  if (!categoryMap['tatlılar']) {
     console.log("Tatlılar kategorisi bulunamadı, oluşturuluyor...");
     const newCat = await payload.create({
       collection: 'categories',
       data: { title: 'Tatlılar' }
     });
     categoryMap['tatlılar'] = newCat.id;
  }

  // 2. Ürünleri çekelim
  const productsRes = await payload.find({
    collection: 'products',
    limit: 500,
    depth: 1, // Kategorilerin içeriğini de görebilmek için
  });

  console.log(`Toplam ${productsRes.docs.length} ürün inceleniyor...`);

  const results: any[] = [];
  let updatedCount = 0;

  for (const product of productsRes.docs) {
    const title = product.title.toUpperCase();
    const currentCategoryDoc = product.category;
    const currentCategoryTitle = (currentCategoryDoc && typeof currentCategoryDoc === 'object' && 'title' in currentCategoryDoc) 
                                 ? currentCategoryDoc.title 
                                 : 'Belirsiz';

    let newCategoryTitle = currentCategoryTitle;
    let shouldUpdate = false;

    // AI Algoritması: Ürün ismine göre mantıksal eşleştirme
    if (
      title.includes('BAKLAVA') || title.includes('KADAYIF') || title.includes('ŞÖBİYET') || 
      title.includes('ŞEKERPARE') || title.includes('GÜLLAÇ') || title.includes('NURİYE') ||
      title.includes('TRALİÇE') || title.includes('SÜTLAÇ') || title.includes('SUPANGLE') ||
      title.includes('KAZANDİBİ') || title.includes('KEŞKÜL') || title.includes('TAVUK GÖĞSÜ') ||
      title.includes('VEZİR PARMAĞI') || title.includes('AŞURE') || title.includes('MİDYE') // Midye baklava
    ) {
      newCategoryTitle = 'Tatlılar';
    } else if (
      title.includes('KURABİYE') || title.includes('BİSKOTTİ') || title.includes('ACIBADEM') ||
      title.includes('BEZE') || title.includes('JAPONEX') || title.includes('SELANİK') ||
      title.includes('ÇATAL') || title.includes('AY ÇÖREĞİ') || title.includes('TAHİNLİ ÇÖREK')
    ) {
      newCategoryTitle = 'Kekler ve Çörekler';
    } else if (
      title.includes('SAKALLI') || title.includes('PONÇİK') || title.includes('İRAN POĞAÇASI')
    ) {
      newCategoryTitle = 'Mayalı Poğaçalar';
    } else if (
      title.includes('GEVREK') || title.includes('GALET') || title.includes('KIRIKKIRAK') || title.includes('GRİSSİNİ')
    ) {
      newCategoryTitle = 'Paket Ürünler';
    } else if (
      title.includes('ÇİKOLATA') || title.includes('DRAJE') || title.includes('LOKUM') || title.includes('MADLEN')
    ) {
      newCategoryTitle = 'Çikolata ve Lokumlar';
    } else if (
      title.includes('BÜYÜK PİZZA') || title.includes('KÜÇÜK PİZZA') 
    ) {
      newCategoryTitle = 'Kekler ve Çörekler';
    }

    // Eğer yeni bir kategori önerildiyse ve o kategori veritabanında varsa değiştir
    if (newCategoryTitle !== currentCategoryTitle) {
      const newCategoryId = categoryMap[newCategoryTitle.toLowerCase().trim()];
      
      if (newCategoryId) {
        console.log(`Güncelleniyor: ${title} -> ${newCategoryTitle}`);
        // Güncellemeyi yap
        try {
          await payload.update({
            collection: 'products',
            id: product.id,
            data: {
              category: newCategoryId,
            }
          });
          shouldUpdate = true;
          updatedCount++;
          console.log(`Başarılı: ${title}`);
        } catch (err) {
          console.error(`HATA: ${title} güncellenemedi!`, err);
        }
      }
    }

    results.push({
      id: product.id,
      title: product.title,
      oldCategory: currentCategoryTitle,
      newCategory: shouldUpdate ? newCategoryTitle : currentCategoryTitle,
      changed: shouldUpdate ? "EVET" : "HAYIR"
    });
  }

  console.log(`\nBaşarıyla ${updatedCount} adet ürünün kategorisi güncellendi!`);

  // Sonuçları MD Tablosu formatında dök (daha güzel görünmesi için)
  const mdRows = [
    '# Kategori Güncelleme Sonuçları\n',
    '| ID | Ürün Adı | Eski Kategori | Yeni Kategori | Değişti mi? |',
    '|---|---|---|---|---|'
  ];
  
  results.forEach(r => {
    mdRows.push(`| ${r.id} | ${r.title} | ${r.oldCategory} | ${r.newCategory} | ${r.changed} |`);
  });

  const mdContent = mdRows.join('\n');
  const reportPath = path.resolve(process.cwd(), 'kategori_sonuclari.md');
  fs.writeFileSync(reportPath, mdContent, 'utf-8');

  console.log(`Rapor başarıyla oluşturuldu: ${reportPath}`);
  process.exit(0);
}

updateCategories().catch(console.error);
