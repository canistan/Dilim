import { getPayload } from 'payload'
import configPromise from '@payload-config'
import HomePageClient from './HomePageClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Dilim Pastaneleri | Lezzetin Adresi",
  description: "Özel anlarınıza eşlik eden eşsiz tatlar. Lüks yaş pasta, özel gün pastası ve geleneksel tatlılar için Dilim Pastaneleri.",
}

// Next.js ISR
export const revalidate = 3600

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })
  
  let homepageData = null
  try {
    homepageData = await payload.findGlobal({ 
      slug: 'homepage',
      depth: 2 
    })
  } catch (error) {
    console.error('Error fetching homepage data:', error)
  }

  // Serialize the data for client component (Next.js requires plain objects)
  const serializedData = homepageData ? JSON.parse(JSON.stringify(homepageData)) : null

  return (
    <HomePageClient homepageData={serializedData} />
  )
}
