import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise });

    const productsFile = '/Users/canalbayrak/.gemini/antigravity-ide/brain/a365bdb0-40a2-466c-843f-9229e028cade/scratch/clean_products.json';
    const rawData = fs.readFileSync(productsFile, 'utf8');
    const cleanProducts = JSON.parse(rawData);

    // Fetch existing
    const existingProductsRes = await payload.find({
      collection: 'products' as any,
      limit: 1000,
    });
    const existingProducts = existingProductsRes.docs;
    const existingNames = existingProducts.map(p => p.title.toUpperCase());

    let addedCount = 0;
    let addedNames: string[] = [];
    
    let categoryId = null;
    const catRes = await payload.find({ collection: 'categories' as any, limit: 1 });
    if (catRes.docs.length > 0) {
      categoryId = catRes.docs[0].id;
    }

    for (const p of cleanProducts) {
      const name = p.name.trim();
      const numPrice = p.price;
      
      // Filter out invalid names we got from bad parsing
      if (['AD', 'ADET', 'BIRIM', 'FIYAT', 'KILOLUK', '350', '235', '325', '200'].includes(name.toUpperCase())) {
        continue;
      }
      
      if (!existingNames.includes(name.toUpperCase())) {
        const slug = name.toLowerCase().replace(/[^a-z0-9ğüşöçıİĞÜŞÖÇ]+/g, '-').replace(/(^-|-$)+/g, '');
        
        // Ensure slug is unique
        const existingSlugRes = await payload.find({
            collection: 'products' as any,
            where: { slug: { equals: slug } }
        });
        
        if (existingSlugRes.docs.length === 0) {
          await payload.create({
            collection: 'products' as any,
            data: {
              title: name,
              slug: slug,
              price: numPrice,
              category: categoryId, 
              description: `Birim: ${p.unit}`,
              hasSizes: false,
              stock: 100,
              isSameDayEligible: true
            }
          });
          addedCount++;
          addedNames.push(name);
          existingNames.push(name.toUpperCase()); // update local array
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Missing products added successfully.',
      stats: { addedCount },
      addedNames
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
