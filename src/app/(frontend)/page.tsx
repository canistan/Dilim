import { getPayload } from 'payload'
import configPromise from '@payload-config'
import HomePageClient from './HomePageClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Dilim Pastaneleri | Kavacık & Ümraniye'nin En İyi Pastanesi",
  description: "Kavacık ve Ümraniye'de yaş pasta, doğum günü pastası, nişan pastası siparişi verin. 1977'den beri İstanbul Anadolu Yakası'nda butik pasta üretimi. Aynı gün teslimat.",
}

// Next.js ISR
export const revalidate = 3600

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })
  
  let homepageData = null
  let instagramData = null
  try {
    homepageData = await payload.findGlobal({ 
      // @ts-ignore
      slug: 'homepage',
      depth: 2 
    })
    
    instagramData = await payload.findGlobal({
      // @ts-ignore
      slug: 'instagram-feed',
      depth: 1
    })
  } catch (error) {
    console.error('Error fetching global data:', error)
  }

  // Serialize the data for client component (Next.js requires plain objects)
  const serializedData = homepageData ? JSON.parse(JSON.stringify(homepageData)) : null
  const serializedInstagramData = instagramData ? JSON.parse(JSON.stringify(instagramData)) : null

  return (
    <HomePageClient homepageData={serializedData} instagramData={serializedInstagramData} />
  )
}
