import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

function toTitleCase(str: string) {
  return str.toLowerCase().split(' ').map(word => {
    // Türkçe karakterleri göz önünde bulundur
    if (word === 've') return 've'; // "ve" küçük kalsın
    if (word.length === 0) return '';
    return word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1);
  }).join(' ');
}

async function run() {
  const payload = await getPayload({ config: configPromise })
  
  const categories = await payload.find({
    collection: 'categories',
    limit: 100,
  })
  
  for (const cat of categories.docs) {
    const newTitle = toTitleCase(cat.title);
    if (newTitle !== cat.title) {
      console.log(`Güncelleniyor: "${cat.title}" -> "${newTitle}"`);
      await payload.update({
        collection: 'categories',
        id: cat.id,
        data: {
          title: newTitle
        }
      });
    } else {
      console.log(`Değişiklik yok: "${cat.title}"`);
    }
  }
  
  console.log('Kategoriler başarıyla düzeltildi!');
  process.exit(0)
}

run().catch(console.error)
