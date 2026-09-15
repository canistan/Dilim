import { getPayload } from 'payload'
import configPromise from '../src/payload.config'
import * as dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

async function run() {
  const payload = await getPayload({ config: configPromise })
  
  const ocrText = fs.readFileSync(path.resolve(__dirname, 'ocr_products.txt'), 'utf-8')
  const lines = ocrText.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('Kategori'));
  
  const pdfProducts: { title: string, price: number }[] = [];
  
  for (const line of lines) {
    if (!/\d/.test(line)) continue;
    
    const match = line.match(/^(.*?)\s+(ADET \/ KİLO|ADET|KİLOGRAM)\s+([\d\.]+)(\s+[\d\.]+)?$/);
    if (match) {
      pdfProducts.push({
        title: match[1].trim(),
        price: parseFloat(match[3])
      });
    } else {
      // Just try to grab title and first number
      const parts = line.split(/\s+/);
      const firstNumIndex = parts.findIndex(p => /^\d+\.?\d*$/.test(p));
      if (firstNumIndex > 0) {
        const title = parts.slice(0, firstNumIndex).join(' ').replace(/ADET|KİLOGRAM|ADET \/ KİLO/, '').trim();
        const price = parseFloat(parts[firstNumIndex]);
        pdfProducts.push({ title, price });
      } else {
        console.log('Unparsed line:', line);
      }
    }
  }

  const dbProductsReq = await payload.find({
    collection: 'products',
    limit: 1000,
  })
  
  const dbProducts = dbProductsReq.docs;

  console.log(`\nFound ${pdfProducts.length} products in PDF, ${dbProducts.length} products in DB.\n`);
  
  const discrepancies: string[] = [];
  const missingInDb: string[] = [];
  const missingInPdf: string[] = [];
  
  for (const pdfP of pdfProducts) {
    const dbMatch = dbProducts.find(p => p.title.toLowerCase() === pdfP.title.toLowerCase());
    
    if (!dbMatch) {
      missingInDb.push(`- ${pdfP.title} (Fiyat: ${pdfP.price})`);
    } else {
      // handle hasSizes
      if (dbMatch.hasSizes && dbMatch.sizes) {
         // The DB product has sizes. Let's see if the price matches any of the sizes or base price.
         const minSizePrice = Math.min(...dbMatch.sizes.map(s => s.price));
         if (minSizePrice !== pdfP.price && dbMatch.price !== pdfP.price) {
           discrepancies.push(`- ${pdfP.title}: PDF'de ${pdfP.price} TL, DB'de (Boyutlu) min ${minSizePrice} TL / base ${dbMatch.price} TL`);
         }
      } else if (dbMatch.price !== pdfP.price) {
        discrepancies.push(`- ${pdfP.title}: PDF'de ${pdfP.price} TL, DB'de ${dbMatch.price} TL`);
      }
    }
  }

  for (const dbP of dbProducts) {
    const pdfMatch = pdfProducts.find(p => p.title.toLowerCase() === dbP.title.toLowerCase());
    if (!pdfMatch) {
      missingInPdf.push(`- ${dbP.title} (DB Fiyatı: ${dbP.price})`);
    }
  }

  if (discrepancies.length > 0) {
    console.log("=== FİYAT UYUŞMAZLIKLARI ===");
    discrepancies.forEach(d => console.log(d));
    console.log();
  } else {
    console.log("Fiyatı eşleşen tüm ürünler birbiriyle uyumlu.\n");
  }

  if (missingInDb.length > 0) {
    console.log("=== PDF'TE OLUP SİTEDE (DB) OLMAYANLAR ===");
    missingInDb.forEach(m => console.log(m));
    console.log();
  }

  if (missingInPdf.length > 0) {
    console.log("=== SİTEDE OLUP PDF'TE OLMAYANLAR (Ekstra Ürünler) ===");
    missingInPdf.forEach(m => console.log(m));
    console.log();
  }
  
  process.exit(0);
}

run().catch(console.error);
