import { getPayload } from 'payload'
import configPromise from '@payload-config'
import IletisimClient from './IletisimClient'

export const metadata = {
  title: 'İletişim | Dilim Pastaneleri',
  description: 'Bizimle iletişime geçin. Şubelerimiz, adres bilgilerimiz ve telefon numaralarımız.',
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
    branches = branchesRes.docs
  } catch (error) {
    console.error('Error fetching branches:', error)
  }

  return <IletisimClient contactSettings={contactSettings} branches={branches} />
}
