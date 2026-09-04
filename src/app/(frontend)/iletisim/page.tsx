import { getPayload } from 'payload'
import configPromise from '@payload-config'
import IletisimClient from './IletisimClient'

export const metadata = {
  title: 'İletişim & Şubelerimiz | Kavacık, Ümraniye Pastane - Dilim Pastaneleri',
  description: 'Dilim Pastaneleri Kavacık ve Ümraniye şube adresleri, telefon numaraları, çalışma saatleri ve yol tarifi. Pasta siparişi için bize ulaşın.',
}

export const revalidate = 3600 // ISR

export default async function IletisimPage() {
  const payload = await getPayload({ config: configPromise })
  
  let contactSettings = null
  try {
    contactSettings = await payload.findGlobal({
      slug: 'contact-settings',
    })
  } catch (error) {
    console.error('Error fetching contact settings:', error)
  }

  let branches = []
  try {
    const branchesRes = await payload.find({
      collection: 'branches',
      limit: 100,
    })
    
    // Şubeleri istenilen sıraya göre diz: Kavacık, Ümraniye, Beykoz
    const order = ['kavacık', 'ümraniye', 'beykoz']
    
    branches = branchesRes.docs.sort((a, b) => {
      const nameA = (a.name || '').toLowerCase()
      const nameB = (b.name || '').toLowerCase()
      
      const indexA = order.findIndex(loc => nameA.includes(loc))
      const indexB = order.findIndex(loc => nameB.includes(loc))
      
      const posA = indexA !== -1 ? indexA : 999
      const posB = indexB !== -1 ? indexB : 999
      
      return posA - posB
    })
  } catch (error) {
    console.error('Error fetching branches:', error)
  }

  return <IletisimClient contactSettings={contactSettings} branches={branches} />
}
