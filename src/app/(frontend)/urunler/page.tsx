import { getPayload } from 'payload'
import configPromise from '@payload-config'
import ProductsClient from './ProductsClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ürünlerimiz | Dilim Pastaneleri',
  description: 'Tüm yaş pasta, özel gün pastası ve tatlı çeşitlerimizi inceleyin.',
}

// Next.js ISR (Incremental Static Regeneration) - 1 saatte bir yenile
export const revalidate = 3600

export default async function ProductsPage() {
  const payload = await getPayload({ config: configPromise })

  // Fetch categories
  const categoriesRes = await payload.find({
    collection: 'categories' as any,
    limit: 100,
  })

  // Fetch products
  const productsRes = await payload.find({
    collection: 'products' as any,
    limit: 1000,
  })

  // Serialize to simple objects to pass to Client Component
  const categories = categoriesRes.docs.map((doc: any) => ({
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
  }))

  const products = productsRes.docs.map((doc: any) => ({
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
    price: doc.price,
    category: doc.category,
    images: doc.images,
  }))

  return (
    <ProductsClient categories={categories} products={products} />
  )
}
