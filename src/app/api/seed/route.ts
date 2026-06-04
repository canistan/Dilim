import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import productsData from '@/data/products.json';
import blogsData from '@/data/blog.json';

const CATEGORIES = [
  { slug: 'yas-pastalar', title: 'YAŞ PASTALAR' },
  { slug: 'ozel-gun', title: 'ÖZEL GÜN PASTALARI' },
  { slug: 'tatlilar', title: 'TATLILAR' },
  { slug: 'tek-pastalar', title: 'TEK PASTALAR' }
];

export async function GET(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise });

    // 1. Kategorileri Ekle
    const categoryDocs: Record<string, string> = {};
    for (const cat of CATEGORIES) {
      const existing = await payload.find({
        collection: 'categories' as any,
        where: { slug: { equals: cat.slug } },
      });

      if (existing.totalDocs === 0) {
        const created = await payload.create({
          collection: 'categories' as any,
          data: { title: cat.title, slug: cat.slug },
        });
        categoryDocs[cat.slug] = created.id;
      } else {
        categoryDocs[cat.slug] = existing.docs[0].id;
      }
    }

    // 2. Ürünleri Ekle
    for (const prod of productsData) {
      const slug = prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const existing = await payload.find({
        collection: 'products' as any,
        where: { slug: { equals: slug } },
      });

      if (existing.totalDocs === 0) {
        // Parse price (₺180 -> 180, Özel Fiyat -> 0)
        let numPrice = 0;
        if (prod.price !== "Özel Fiyat") {
          numPrice = parseInt(prod.price.replace(/[^0-9]/g, ''), 10) || 0;
        }

        await payload.create({
          collection: 'products' as any,
          data: {
            title: prod.name,
            slug: slug,
            description: prod.originalCategory, // using this as a short description for now
            price: numPrice,
            category: categoryDocs[prod.category], // İlişkili Kategori ID
          },
        });
      }
    }

    // 3. Blogları Ekle
    for (const blog of blogsData) {
      const existing = await payload.find({
        collection: 'blog' as any,
        where: { slug: { equals: blog.slug } },
      });

      if (existing.totalDocs === 0) {
        await payload.create({
          collection: 'blog' as any,
          data: {
            title: blog.title,
            slug: blog.slug,
            content: blog.content,
            // image would be a media ID if we uploaded it, skipping image mapping for now or map it if it's string.
            // but our payload collection expects a media relationship. We'll leave it empty for now since we haven't seeded media.
          },
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Gerçek menü ve bloglar veritabanına başarıyla aktarıldı!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
