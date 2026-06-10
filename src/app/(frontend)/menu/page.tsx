import { getPayload } from 'payload'
import configPromise from '@payload-config'
import MenuClient from './MenuClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kafé Menüsü | Dilim Pastaneleri',
  description: 'Taze kahvelerimiz, leziz dilim pastalarımız ve içeceklerimiz.',
}

// Next.js ISR - 1 saatte bir yenile
export const revalidate = 3600

export default async function MenuPage() {
  const payload = await getPayload({ config: configPromise })

  // Fetch categories
  const categoriesRes = await payload.find({
    collection: 'categories' as any,
    limit: 100,
  })

  // Fetch products that are marked to show in menu
  const productsRes = await payload.find({
    collection: 'products' as any,
    limit: 1000,
    where: {
      showInMenu: {
        equals: true,
      }
    }
  })

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
    description: doc.description,
    category: doc.category,
    images: doc.images,
  }))

  return (
    <MenuClient categories={categories} products={products} />
  )
}
