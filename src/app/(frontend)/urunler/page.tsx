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
    image: doc.image && typeof doc.image === 'object' ? doc.image.url : null,
  }))

  const products = productsRes.docs.map((doc: any) => ({
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
    price: doc.price,
    category: doc.category,
    images: doc.images,
    hasSizes: doc.hasSizes,
    sizes: doc.sizes,
  }))

  const extrasCategories = await payload.find({
    collection: 'categories' as any,
    where: { 
      or: [
        { slug: { equals: 'ekstralar' } },
        { slug: { equals: 'hediyelik' } },
        { slug: { contains: 'hediye' } }
      ]
    },
    limit: 5,
  })
  
  let crossSellDocs: any[] = []
  if (extrasCategories.docs.length > 0) {
    const categoryIds = extrasCategories.docs.map((cat: any) => cat.id)
    const extrasRes = await payload.find({
      collection: 'products' as any,
      where: { category: { in: categoryIds } },
      limit: 15,
      depth: 2,
    })
    crossSellDocs = extrasRes.docs
  }

  const crossSellProducts = crossSellDocs.map((doc: any) => ({
    id: doc.id.toString(),
    name: doc.title,
    price: doc.price,
    image: (doc.images && doc.images.length > 0 && doc.images[0].url) ? doc.images[0].url : '/placeholder.png'
  }))

  return (
    <ProductsClient categories={categories} products={products} crossSellProducts={crossSellProducts} />
  )
}
