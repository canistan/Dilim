import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import * as xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';

export async function GET(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise });

    // 1. Read Excel raw data
    const excelPath = path.join(process.cwd(), 'public', 'FiyatListesi.xlsx');
    if (!fs.existsSync(excelPath)) {
      return NextResponse.json({ success: false, error: 'Excel not found' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(excelPath);
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    const rawData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    
    // Flatten excel text to a single massive uppercase string for easy searching
    let excelText = '';
    let isBeverageSection = false;
    
    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i] as any[];
      let rowText = row.map(c => String(c).toUpperCase()).join(' ');
      
      if (rowText.includes('İÇECEKLER') || rowText.includes('SICAK VE EL YAPIMI İÇECEKLER')) {
        isBeverageSection = true;
      }
      
      if (!isBeverageSection) {
        excelText += rowText + ' ';
      }
    }

    // 2. Fetch all products from Payload
    const existingProductsRes = await payload.find({
      collection: 'products' as any,
      limit: 1000,
    });
    const existingProducts = existingProductsRes.docs;

    let deletedCount = 0;
    let deletedNames: string[] = [];
    let keptCount = 0;
    let keptNames: string[] = [];

    // 3. Intelligent filtering
    for (const product of existingProducts) {
      const prodName = product.title.toUpperCase();
      
      // We will check if any words of the product name exist in the excelText
      // A safe heuristic: If the exact name is in the text, it's valid.
      // We should also normalize turkish characters for safety.
      
      const normalize = (str: string) => str.replace(/Ğ/g, 'G').replace(/Ü/g, 'U').replace(/Ş/g, 'S').replace(/İ/g, 'I').replace(/Ö/g, 'O').replace(/Ç/g, 'C');
      
      const normProdName = normalize(prodName);
      const normExcelText = normalize(excelText);
      
      // Certain beverage-related keywords to force delete
      const isBeverage = ['ÇAY', 'KAHVE', 'COCA COLA', 'FANTA', 'SPRITE', 'SU', 'AYRAN', 'ICE TEA', 'ESPRESSO', 'LATTE', 'MOCHA', 'SAHLEP', 'CHURCHILL', 'MEYVE SUYU'].some(bev => ` ${normProdName} `.includes(` ${normalize(bev)} `));
      
      let shouldDelete = false;

      if (isBeverage) {
         shouldDelete = true;
      } else if (!normExcelText.includes(normProdName)) {
         // Also try splitting by space if it's a long name, maybe parts are there.
         // Actually, if the exact name is not in the excel, we delete it as per user request to "remove extras".
         // However, what if CMS name is "Su Böreği (Kg)" and Excel has "SU BÖREĞİ"?
         // Let's strip brackets.
         const cleanName = normProdName.replace(/\(.*\)/g, '').trim();
         if (!normExcelText.includes(cleanName)) {
           shouldDelete = true;
         }
      }

      if (shouldDelete) {
        await payload.delete({
          collection: 'products' as any,
          id: product.id,
        });
        deletedCount++;
        deletedNames.push(product.title);
      } else {
        keptCount++;
        keptNames.push(product.title);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Intelligent Sync completed.',
      stats: {
        totalBefore: existingProducts.length,
        deletedCount,
        keptCount
      },
      deletedNames,
      keptNames
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
