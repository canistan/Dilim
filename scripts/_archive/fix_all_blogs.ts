import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'

function convertToLexical(oldContent: any) {
  if (!Array.isArray(oldContent)) {
    // Zaten lexical veya boş
    return oldContent;
  }

  const lexicalChildren = oldContent.map((node: any) => {
    if (node.type === 'h2' || node.type === 'h3') {
      return {
        type: 'heading',
        tag: node.type,
        format: '',
        indent: 0,
        version: 1,
        children: node.children?.map((child: any) => ({
          type: 'text',
          format: 0,
          mode: 'normal',
          style: '',
          text: child.text || '',
          version: 1,
        })) || []
      }
    } else {
      // varsayılan paragraph
      return {
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        children: node.children?.map((child: any) => ({
          type: 'text',
          format: 0,
          mode: 'normal',
          style: '',
          text: child.text || '',
          version: 1,
        })) || []
      }
    }
  });

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: lexicalChildren,
    }
  }
}

async function run() {
  const payload = await getPayload({ config: configPromise })
  console.log('Tüm blog içerikleri düzeltiliyor...')

  const result = await payload.find({
    collection: 'blog',
    limit: 100,
  })

  for (const doc of result.docs) {
    try {
      let isModified = false;
      let newContent = doc.content;
      let newMeta = doc.meta || {};

      // 1. Content düzeltme
      if (Array.isArray(doc.content)) {
        newContent = convertToLexical(doc.content);
        isModified = true;
      }

      // 2. SEO düzeltme
      const oldSeo: any = doc.seo || {};
      if (oldSeo.metaTitle || oldSeo.metaDescription) {
        newMeta = {
          ...newMeta,
          title: oldSeo.metaTitle || newMeta.title,
          description: oldSeo.metaDescription || newMeta.description,
        }
        if (doc.image) {
          newMeta.image = typeof doc.image === 'object' ? doc.image.id : doc.image;
        }
        isModified = true;
      }

      if (isModified) {
        await payload.update({
          collection: 'blog',
          id: doc.id,
          data: {
            content: newContent,
            meta: newMeta,
            seo: null // eskiyi sil
          }
        })
        console.log(`Düzeltildi: ${doc.title}`)
      } else {
        console.log(`Gerek yok: ${doc.title}`)
      }

    } catch (err) {
      console.error(`Hata: ${doc.title}`, err)
    }
  }

  console.log('Tüm blog içerikleri başarıyla tarandı ve düzeltildi.')
  process.exit(0)
}

run()
