import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'
import path from 'path'
import fs from 'fs'

const run = async () => {
  const payload = await getPayload({ config: configPromise })

  const branches = [
    {
      name: 'Ümraniye Şubesi',
      isFranchise: false,
      address: 'İnkilap Mahallesi Adem Yavuz Caddesi\nNumara: 1/4 Ümraniye / İstanbul',
      phone: '+90 505 963 80 24',
      workingHours: '08:00 - 22:00 (Haftanın Her Günü)',
      googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Dilim+Pastanesi+Ümraniye',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.6658909905864!2d29.100954314818352!3d41.032565025879876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAxJzU3LjIiTiAyOcKwMDYnMTEuMyJF!5e0!3m2!1str!2str!4v1506351314913',
    },
    {
      name: 'Kavacık Şubesi',
      isFranchise: false,
      address: 'Rüzgarlıbahçe Mah. Cumhuriyet Cad. No: 10\nAcarlar İş Merkezi, Kavacık, Beykoz / İstanbul',
      phone: '+90 505 963 80 21',
      workingHours: '08:00 - 22:00 (Haftanın Her Günü)',
      googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Dilim+Pastanesi+Kavacık',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3006.841344028522!2d29.09568331482048!3d41.094313022076044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDA1JzM5LjUiTiAyOcKwMDUnNTIuMyJF!5e0!3m2!1str!2str!4v1506350216306',
    },
    {
      name: 'Beykoz Şubesi',
      isFranchise: true,
      address: 'Fevzipaşa Caddesi Numara: 10/A\nBeykoz / İstanbul',
      phone: '+90 216 323 24 30',
      workingHours: '08:00 - 22:00 (Haftanın Her Günü)',
      googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Dilim+Pastanesi+Beykoz',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3005.0042118386923!2d29.089701314821873!3d41.134434019602054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDA4JzA0LjAiTiAyOcKwMDUnMzAuOCJF!5e0!3m2!1str!2str!4v1506351581686',
    }
  ]

  for (const branch of branches) {
    const existing = await payload.find({
      collection: 'branches',
      where: { name: { equals: branch.name } }
    })
    
    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'branches',
        data: branch,
      })
      console.log(`Created branch: ${branch.name}`)
    } else {
      console.log(`Branch already exists: ${branch.name}`)
    }
  }

  process.exit(0)
}

run().catch(console.error)
