import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

const categories = [
  { title: 'Adet Pastalar', slug: 'adet-pastalar' },
  { title: 'Bütün Pastalar', slug: 'butun-pastalar' },
  { title: 'Sütlü Tatlılar', slug: 'sutlu-tatlilar' },
  { title: 'Şerbetli Tatlılar', slug: 'serbetli-tatlilar' },
  { title: 'Çikolatalar', slug: 'cikolatalar' },
  { title: 'Tuzlu Kurabiyeler', slug: 'tuzlu-kurabiyeler' },
  { title: 'Tatlı Kurabiyeler', slug: 'tatli-kurabiyeler' },
  { title: 'Börekler', slug: 'borekler' },
];

const products = [
  {
    title: 'Çilekli Adet Pasta',
    slug: 'cilekli-adet-pasta',
    description: 'Taze çilekler ve enfes krema ile hazırlanan tek kişilik rüya.',
    price: 120,
    categorySlug: 'adet-pastalar',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Çikolatalı Bütün Pasta',
    slug: 'cikolatali-butun-pasta',
    description: 'Yoğun Belçika çikolatası ve fıstık parçacıkları.',
    price: 650,
    categorySlug: 'butun-pastalar',
    imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Profiterol',
    slug: 'profiterol',
    description: 'Özel sosu ve taze şu hamuru ile klasikleşen lezzet.',
    price: 110,
    categorySlug: 'sutlu-tatlilar',
    imageUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Fıstıklı Baklava',
    slug: 'fistikli-baklava',
    description: 'Boz iç fıstık ile hazırlanan bol tereyağlı geleneksel tat.',
    price: 450,
    categorySlug: 'serbetli-tatlilar',
    imageUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=800&auto=format&fit=crop', // Fallback image
  },
];

export async function GET(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise });

    // 1. Kategorileri Ekle
    const categoryDocs: Record<string, string> = {};
    for (const cat of categories) {
      const existing = await payload.find({
        collection: 'categories',
        where: { slug: { equals: cat.slug } },
      });

      if (existing.totalDocs === 0) {
        const created = await payload.create({
          collection: 'categories',
          data: { title: cat.title, slug: cat.slug },
        });
        categoryDocs[cat.slug] = created.id;
      } else {
        categoryDocs[cat.slug] = existing.docs[0].id;
      }
    }

    // 2. Ürünleri Ekle
    for (const prod of products) {
      const existing = await payload.find({
        collection: 'products',
        where: { slug: { equals: prod.slug } },
      });

      if (existing.totalDocs === 0) {
        await payload.create({
          collection: 'products',
          data: {
            title: prod.title,
            slug: prod.slug,
            description: prod.description,
            price: prod.price,
            category: categoryDocs[prod.categorySlug], // İlişkili Kategori ID
          },
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Veritabanı (Seed) başarıyla dolduruldu!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
