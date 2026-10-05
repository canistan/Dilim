import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

/**
 * Glutensiz/şekersiz blog yazısındaki yanlış vaadi düzeltir.
 * - URL ve başlık korunur (SEO değeri kaybolmaz)
 * - En başa bilgilendirme paragrafı eklenir (Google snippet'inde görünür)
 * - "sipariş üzerine glutensiz ... sunuyoruz" paragrafı, dürüst bir SSS bölümüyle değiştirilir
 * - meta.description elle ayarlanır
 *
 * Kullanım:  npx tsx scripts/fix_gluten_blog.ts          (sadece önizleme)
 *            npx tsx scripts/fix_gluten_blog.ts --apply  (veritabanına yazar)
 */

const SLUG = 'ozel-diyetler-glutensiz-sekersiz-pasta'
const APPLY = process.argv.includes('--apply')

const DISCLAIMER =
  "📌 Bilgilendirme: Bu yazı genel bir rehberdir. Dilim Pastaneleri'nde şu an glutensiz veya şekersiz pasta bulunmamaktadır."

const FAQ_HEADING = "Dilim Pastaneleri'nde Glutensiz veya Şekersiz Pasta Var mı?"
const FAQ_TEXT =
  "Şu an için hayır. Tüm pastalarımız klasik tariflerle, buğday unu ve şeker kullanılarak hazırlanıyor. Mutfağımızda un kullanıldığı için çapraz bulaşma riskini ortadan kaldıramıyoruz; bu nedenle çölyak hastası ve gluten hassasiyeti olan misafirlerimize güvenli bir seçenek sunamadığımızı açıkça belirtmek isteriz. Özel diyet ürünleri eklediğimizde bu sayfayı güncelleyeceğiz. Alerjen bilgisi için şubelerimizi arayabilirsiniz."

const META_DESCRIPTION =
  "Glutensiz ve şekersiz pastacılıkta badem unu, doğal tatlandırıcılar ve vegan kremalar. Not: Dilim Pastaneleri'nde şu an glutensiz/şekersiz pasta bulunmamaktadır."

const textNode = (text: string) => ({
  type: 'text',
  text,
  format: 0,
  style: '',
  mode: 'normal',
  detail: 0,
  version: 1,
})

const paragraph = (text: string, bold = false) => ({
  type: 'paragraph',
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr',
  textFormat: bold ? 1 : 0,
  children: [{ ...textNode(text), format: bold ? 1 : 0 }],
})

const heading = (text: string, tag = 'h2') => ({
  type: 'heading',
  tag,
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr',
  children: [textNode(text)],
})

const nodeText = (n: any): string =>
  n?.text ?? (Array.isArray(n?.children) ? n.children.map(nodeText).join('') : '')

async function run() {
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'blog' as any,
    where: { slug: { equals: SLUG } },
    limit: 1,
  })
  const post: any = docs[0]
  if (!post) throw new Error(`Yazı bulunamadı: ${SLUG}`)

  console.log('Başlık:', post.title)
  console.log('Mevcut meta:', post.meta)

  const content = post.content

  // Eski kayıtlar düz metin (paragraflar \n\n ile, başlıklar "## " ile) olarak saklanıyor
  if (typeof content === 'string') {
    const blocks = content.split('\n\n')
    console.log('\n--- MEVCUT İÇERİK (metin) ---')
    blocks.forEach((b, i) => console.log(`[${i}] ${b.slice(0, 110)}`))

    if (blocks[0].includes('Bilgilendirme:')) {
      console.log('\nBilgilendirme zaten eklenmiş; işlem yapılmadı.')
      process.exit(0)
    }

    const kept = blocks.filter((b) => {
      const t = b.toLowerCase()
      return !(t.includes('sunuyoruz') && (t.includes('glutensiz') || t.includes('vegan')))
    })
    const newBlocks = [DISCLAIMER, ...kept, `## ${FAQ_HEADING}`, FAQ_TEXT]

    console.log(`\nÇıkarılan blok sayısı: ${blocks.length - kept.length}`)
    console.log('\n--- YENİ İÇERİK (metin) ---')
    newBlocks.forEach((b, i) => console.log(`[${i}] ${b.slice(0, 110)}`))

    if (!APPLY) {
      console.log('\nÖnizleme modu. Uygulamak için --apply ile çalıştırın.')
      process.exit(0)
    }

    await payload.update({
      collection: 'blog' as any,
      id: post.id,
      data: {
        content: newBlocks.join('\n\n'),
        meta: { ...(post.meta || {}), description: META_DESCRIPTION },
      } as any,
    })
    console.log('\n✅ Yazı güncellendi.')
    process.exit(0)
  }

  if (!content?.root?.children) {
    console.log('Beklenmeyen içerik formatı:', typeof content)
    process.exit(1)
  }

  const children: any[] = content.root.children
  console.log('\n--- MEVCUT İÇERİK ---')
  children.forEach((n, i) => console.log(`[${i}] ${n.type}${n.tag ? '/' + n.tag : ''}: ${nodeText(n).slice(0, 110)}`))

  // Daha önce uygulanmışsa tekrar uygulama
  if (nodeText(children[0]).includes('Bilgilendirme:')) {
    console.log('\nBilgilendirme zaten eklenmiş; işlem yapılmadı.')
    process.exit(0)
  }

  // Yanlış vaadi içeren paragrafları çıkar
  const filtered = children.filter((n) => {
    const t = nodeText(n).toLowerCase()
    return !(t.includes('sunuyoruz') && (t.includes('glutensiz') || t.includes('vegan')))
  })
  const removed = children.length - filtered.length

  const newChildren = [
    paragraph(DISCLAIMER, true),
    ...filtered,
    heading(FAQ_HEADING),
    paragraph(FAQ_TEXT),
  ]

  console.log(`\nÇıkarılan paragraf sayısı: ${removed}`)
  console.log('\n--- YENİ İÇERİK ---')
  newChildren.forEach((n, i) => console.log(`[${i}] ${n.type}${(n as any).tag ? '/' + (n as any).tag : ''}: ${nodeText(n).slice(0, 110)}`))

  if (!APPLY) {
    console.log('\nÖnizleme modu. Uygulamak için --apply ile çalıştırın.')
    process.exit(0)
  }

  await payload.update({
    collection: 'blog' as any,
    id: post.id,
    data: {
      content: { ...content, root: { ...content.root, children: newChildren } },
      meta: { ...(post.meta || {}), description: META_DESCRIPTION },
    } as any,
  })

  console.log('\n✅ Yazı güncellendi.')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
