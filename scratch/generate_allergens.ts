import { getPayload } from 'payload'
import configPromise from '../src/payload.config'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const commonAllergens = {
  sut: 'Süt ve süt ürünleri (Laktoz)',
  yumurta: 'Yumurta',
  gluten: 'Glüten',
  soya: 'Soya lesitini (Soya)',
  ceviz: 'Ceviz',
  fistik: 'Antep Fıstığı',
  findik: 'Fındık',
  badem: 'Badem',
  yerFistigi: 'Yer Fıstığı',
}

function determineAllergens(title: string, categoryName: string): string {
  const t = title.toLowerCase();
  const c = categoryName.toLowerCase();
  const allergens = new Set<string>();

  // Almost all bakery items have gluten, dairy, and eggs
  const isCakeOrPastry = c.includes('pasta') || c.includes('baklava') || c.includes('tatlı') || c.includes('kurabiye') || c.includes('macaron');
  
  if (isCakeOrPastry) {
    allergens.add(commonAllergens.sut);
    allergens.add(commonAllergens.yumurta);
    
    // Macaron generally doesn't have gluten but has almond
    if (c.includes('macaron')) {
      allergens.add(commonAllergens.badem);
    } else {
      allergens.add(commonAllergens.gluten);
    }
  }

  if (t.includes('çikolata') || t.includes('cikolata') || c.includes('çikolata')) {
    allergens.add(commonAllergens.soya); // Most chocolate contains soy lecithin
    allergens.add(commonAllergens.sut); // Milk chocolate
  }

  if (t.includes('ceviz')) allergens.add(commonAllergens.ceviz);
  if (t.includes('fıstık') || t.includes('fistik')) allergens.add(commonAllergens.fistik);
  if (t.includes('fındık') || t.includes('findik')) allergens.add(commonAllergens.findik);
  if (t.includes('badem')) allergens.add(commonAllergens.badem);
  if (t.includes('yer fıstığı') || t.includes('yer fistigi')) allergens.add(commonAllergens.yerFistigi);

  // If no allergens detected, provide a generic cross-contamination warning
  if (allergens.size === 0) {
    return 'Eser miktarda süt, yumurta, glüten ve kuruyemiş içerebilir.';
  }

  return Array.from(allergens).join(', ') + ' içerir. Eser miktarda diğer kuruyemişleri içerebilir.';
}

async function run() {
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    limit: 1000,
    depth: 1, // To get category details
  })

  let updatedCount = 0;

  for (const product of products.docs) {
    const categoryName = (product.category as any)?.title || '';
    const allergensStr = determineAllergens(product.title, categoryName);
    
    await payload.update({
      collection: 'products',
      id: product.id,
      data: {
        allergens: allergensStr
      }
    });
    console.log(`Updated ${product.title} -> ${allergensStr}`);
    updatedCount++;
  }

  console.log(`\nSuccessfully updated ${updatedCount} products with allergen warnings.`);
  process.exit(0);
}

run().catch(console.error);
