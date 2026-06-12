import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })

    // Helper to upload media
    const uploadMedia = async (filename: string, alt: string) => {
      const filePath = path.join(process.cwd(), 'public', filename)
      if (!fs.existsSync(filePath)) return null

      const buffer = fs.readFileSync(filePath)
      const ext = path.extname(filename).toLowerCase()
      let mimetype = 'image/png'
      if (ext === '.jpg' || ext === '.jpeg') mimetype = 'image/jpeg'
      
      const media = await payload.create({
        collection: 'media',
        data: { alt },
        file: {
          data: buffer,
          mimetype,
          name: filename,
          size: buffer.length
        }
      })
      return media.id
    }

    // Upload 6 images for instagram feed
    const img1 = await uploadMedia('detay_pasta_1.png', 'Instagram Post 1')
    const img2 = await uploadMedia('detay_pasta_2.png', 'Instagram Post 2')
    const img3 = await uploadMedia('urunler_yas_pasta.png', 'Instagram Post 3')
    const img4 = await uploadMedia('detay_pasta_3.png', 'Instagram Post 4')
    const img5 = await uploadMedia('hakkimizda_cikolata.png', 'Instagram Post 5')
    const img6 = await uploadMedia('hakkimizda_ic_mekan.png', 'Instagram Post 6')

    const posts = []
    if (img1) posts.push({ image: img1, link: 'https://instagram.com/dilimpastaneleri/', isReel: false })
    if (img2) posts.push({ image: img2, link: 'https://instagram.com/dilimpastaneleri/', isReel: true })
    if (img3) posts.push({ image: img3, link: 'https://instagram.com/dilimpastaneleri/', isReel: false })
    if (img4) posts.push({ image: img4, link: 'https://instagram.com/dilimpastaneleri/', isReel: true })
    if (img5) posts.push({ image: img5, link: 'https://instagram.com/dilimpastaneleri/', isReel: false })
    if (img6) posts.push({ image: img6, link: 'https://instagram.com/dilimpastaneleri/', isReel: false })

    await payload.updateGlobal({
      slug: 'instagram-feed' as any,
      data: {
        posts: posts
      }
    })

    return NextResponse.json({ success: true, message: 'Instagram feed seeded successfully!' })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
