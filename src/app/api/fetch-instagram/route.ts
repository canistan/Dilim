import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // ŞİMDİLİK MOCK VERİ: Gerçekte burası Instagram API'sine veya bir Scraper'a bağlanmalı.
    // Instagram public scraper'ları çok sık banlandığı için güvenli bir mock döndürüyoruz.
    const mockPosts = [
      {
        id: '1',
        imageUrl: '/generated/detay_pasta_1.png',
        link: 'https://instagram.com/bi_dilimpasta/1',
        isReel: false
      },
      {
        id: '2',
        imageUrl: '/generated/detay_pasta_2.png',
        link: 'https://instagram.com/bi_dilimpasta/2',
        isReel: true
      },
      {
        id: '3',
        imageUrl: '/generated/detay_pasta_3.png',
        link: 'https://instagram.com/bi_dilimpasta/3',
        isReel: false
      },
      {
        id: '4',
        imageUrl: '/generated/hakkimizda_chef.png',
        link: 'https://instagram.com/bi_dilimpasta/4',
        isReel: false
      },
      {
        id: '5',
        imageUrl: '/generated/hakkimizda_cikolata.png',
        link: 'https://instagram.com/bi_dilimpasta/5',
        isReel: true
      },
      {
        id: '6',
        imageUrl: '/generated/hakkimizda_ic_mekan.png',
        link: 'https://instagram.com/bi_dilimpasta/6',
        isReel: false
      },
      {
        id: '7',
        imageUrl: '/generated/urunler_yas_pasta.png',
        link: 'https://instagram.com/bi_dilimpasta/7',
        isReel: false
      },
      {
        id: '8',
        imageUrl: '/generated/hero_cake_4k.png',
        link: 'https://instagram.com/bi_dilimpasta/8',
        isReel: false
      },
      {
        id: '9',
        imageUrl: '/generated/detay_pasta_1.png',
        link: 'https://instagram.com/bi_dilimpasta/9',
        isReel: false
      },
      {
        id: '10',
        imageUrl: '/generated/detay_pasta_2.png',
        link: 'https://instagram.com/bi_dilimpasta/10',
        isReel: true
      }
    ];

    return NextResponse.json({
      success: true,
      posts: mockPosts
    });
  } catch (error) {
    console.error('Instagram fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Instagram posts' },
      { status: 500 }
    )
  }
}
