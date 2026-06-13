import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export const maxDuration = 60; // Set max duration for Vercel

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })

    // 1. Check or Create "Ekstralar" Category
    const categoryResult = await payload.find({
      collection: 'categories',
      where: {
        slug: { equals: 'ekstralar' },
      },
    })

    let extrasCategoryId: any

    if (categoryResult.totalDocs > 0) {
      extrasCategoryId = categoryResult.docs[0].id
    } else {
      const newCategory = await payload.create({
        collection: 'categories',
        data: {
          title: 'Ekstralar',
          slug: 'ekstralar',
        },
      })
      extrasCategoryId = newCategory.id
    }

    // 2. Define Candles
    const candlesToSeed = [
      {
        title: 'Klasik İnce Mum (10 Adet)',
        slug: 'klasik-ince-mum-10-adet',
        description: 'Pastanızın üzerinde şık duracak 10 adet renkli klasik ince mum.',
        price: 25,
        category: extrasCategoryId,
        stock: 1000,
        images: [],
        hasSizes: false,
      },
      {
        title: 'Rakam Mum',
        slug: 'rakam-mum',
        description: 'Doğum günleri ve yıl dönümleri için yaldızlı rakam mum. Lütfen istediğiniz rakamı not kısmında belirtiniz.',
        price: 45,
        category: extrasCategoryId,
        stock: 1000,
        images: [],
        hasSizes: false,
      },
      {
        title: 'Kıvılcımlı Maytap',
        slug: 'kivilcimli-maytap',
        description: 'Kutlamalarınıza renk ve ışıltı katacak, dumansız pasta maytabı.',
        price: 60,
        category: extrasCategoryId,
        stock: 1000,
        images: [],
        hasSizes: false,
      }
    ]

    let addedCount = 0

    // 3. Create Products if they don't exist
    for (const candle of candlesToSeed) {
      const existing = await payload.find({
        collection: 'products',
        where: { slug: { equals: candle.slug } },
      })

      if (existing.totalDocs === 0) {
        await payload.create({
          collection: 'products',
          data: candle,
        })
        addedCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: `${addedCount} adet yeni ekstra ürün (mum/maytap vb) 'Ekstralar' kategorisine eklendi.`,
    })
  } catch (error: any) {
    console.error('Seed Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
