import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { formatSlug } from '@/utilities/formatSlug';

const trMap: { [key: string]: string } = {
  'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
  'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u',
};

const slugify = (text: string): string => {
  let result = text;
  for (const key in trMap) {
    result = result.replace(new RegExp(key, 'g'), trMap[key]);
  }
  return result.replace(/ /g, '-').replace(/[^\w-]+/g, '').toLowerCase();
};

export async function GET(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise });
    const results: string[] = [];

    // Fix Products
    const products = await payload.find({ collection: 'products' as any, limit: 1000 });
    for (const doc of products.docs as any[]) {
      const correctSlug = slugify(doc.title);
      if (doc.slug !== correctSlug) {
        await payload.update({
          collection: 'products' as any,
          id: doc.id,
          data: { slug: correctSlug },
        });
        results.push(`Updated Product: ${doc.title} -> ${correctSlug}`);
      }
    }

    // Fix Categories
    const categories = await payload.find({ collection: 'categories' as any, limit: 1000 });
    for (const doc of categories.docs as any[]) {
      const correctSlug = slugify(doc.title);
      if (doc.slug !== correctSlug) {
        await payload.update({
          collection: 'categories' as any,
          id: doc.id,
          data: { slug: correctSlug },
        });
        results.push(`Updated Category: ${doc.title} -> ${correctSlug}`);
      }
    }

    // Fix Blogs
    const blogs = await payload.find({ collection: 'blog' as any, limit: 1000 });
    for (const doc of blogs.docs as any[]) {
      const correctSlug = slugify(doc.title);
      if (doc.slug !== correctSlug) {
        await payload.update({
          collection: 'blog' as any,
          id: doc.id,
          data: { slug: correctSlug },
        });
        results.push(`Updated Blog: ${doc.title} -> ${correctSlug}`);
      }
    }

    return NextResponse.json({ success: true, fixed: results.length, results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
