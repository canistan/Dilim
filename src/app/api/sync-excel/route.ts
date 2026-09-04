import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import * as xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';

export async function GET(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise });

    // 1. Excel Dosyasını Oku
    const excelPath = path.join(process.cwd(), 'public', 'FiyatListesi.xlsx');
    if (!fs.existsSync(excelPath)) {
      return NextResponse.json({ success: false, error: 'Excel dosyası bulunamadı. Beklenen yol: ' + excelPath }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(excelPath);
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Ham JSON olarak al (matris)
    const rawData = xlsx.utils.sheet_to_json(sheet, { header: 1, raw: false });

    const validProducts: any[] = [];
    let stopParsing = false;

    // Excel satırlarını tara
    for (let i = 0; i < rawData.length; i++) {
      const row: any[] = rawData[i] as any[];
      
      // İçecekler bölümünü kontrol et ve durdur
      for (const cell of row) {
        if (typeof cell === 'string' && (cell.trim() === 'İÇECEKLER' || cell.trim() === 'SICAK ve EL YAPIMI İÇECEKLER')) {
          stopParsing = true;
          break;
        }
      }
      if (stopParsing) break;

      // Fiyatları bul
      for (let j = 0; j < row.length; j++) {
        const cell = row[j];
        if (!cell || typeof cell !== 'string') continue;

        // Sayı içeren bir hücre mi? (Fiyat olabilir)
        const possiblePrice = parseFloat(cell.replace(',', '.'));
        if (!isNaN(possiblePrice) && possiblePrice > 0) {
          // Önceki 1-2 hücreye bakarak ismini ve birimini (AD/KG) bul
          let unit = 'ADET';
          let name = '';

          if (j >= 1) {
            const unitOrName = String(row[j-1]).trim();
            if (['ADET', 'AD', 'KG', 'PAKET', 'KİLO', 'DİLİM', 'BİRİM'].includes(unitOrName.toUpperCase())) {
              unit = unitOrName;
              if (j >= 2) {
                name = String(row[j-2]).trim();
              }
            } else {
              name = unitOrName;
            }
          }

          if (name && name !== 'nan' && !['ADET', 'BIRIM', 'FIYAT', 'KILOLUK'].includes(name.toUpperCase())) {
            // Başlık veya geçersiz bir satır değilse ekle
            validProducts.push({ name, unit, price: possiblePrice });
          }
        }
      }
    }

    // Tekrarlananları temizle
    const uniqueProductsMap = new Map();
    for (const p of validProducts) {
      if (!uniqueProductsMap.has(p.name)) {
        uniqueProductsMap.set(p.name, p);
      }
    }
    const finalProducts = Array.from(uniqueProductsMap.values());

    // 2. CMS (Payload) veritabanındaki mevcut ürünleri getir
    const existingProductsRes = await payload.find({
      collection: 'products' as any,
      limit: 1000,
    });
    const existingProducts = existingProductsRes.docs;

    const namesInExcel = finalProducts.map(p => p.name.toUpperCase());
    let deletedCount = 0;
    let addedCount = 0;
    let updatedCount = 0;

    // 3. CMS'te olup Excel'de OLMAYANLARI sil (Eski veya hatalı ürünler)
    for (const product of existingProducts) {
      const prodName = product.title.toUpperCase();
      if (!namesInExcel.includes(prodName)) {
        await payload.delete({
          collection: 'products' as any,
          id: product.id,
        });
        deletedCount++;
      }
    }

    // "Genel" adında bir kategori ID'si al veya oluştur
    let categoryId = null;
    const catRes = await payload.find({ collection: 'categories' as any, limit: 1 });
    if (catRes.docs.length > 0) {
      categoryId = catRes.docs[0].id;
    }

    // 4. Excel'deki ürünleri CMS'te GÜNCELLE veya YENİ EKLE
    for (const p of finalProducts) {
      const title = p.name;
      const slug = title.toLowerCase().replace(/[^a-z0-9ğüşöçıİĞÜŞÖÇ]+/g, '-').replace(/(^-|-$)+/g, '');
      const numPrice = p.price;

      const existingProdList = existingProducts.filter(ep => ep.title.toUpperCase() === title.toUpperCase() || ep.slug === slug);
      
      if (existingProdList.length > 0) {
        // Güncelle
        const existingProd = existingProdList[0];
        if (existingProd.price !== numPrice) {
          await payload.update({
            collection: 'products' as any,
            id: existingProd.id,
            data: {
              price: numPrice,
              description: `Birim: ${p.unit}`
            }
          });
          updatedCount++;
        }
      } else {
        // Yeni oluştur
        await payload.create({
          collection: 'products' as any,
          data: {
            title: title,
            slug: slug,
            price: numPrice,
            category: categoryId, 
            description: `Birim: ${p.unit}`,
            hasSizes: false,
            stock: 100,
            isSameDayEligible: true
          }
        });
        addedCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Senkronizasyon başarılı.',
      stats: {
        excelProductCount: finalProducts.length,
        deletedCount,
        addedCount,
        updatedCount
      },
      finalProducts
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
