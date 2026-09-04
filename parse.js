const xlsx = require('xlsx');
const fs = require('fs');

const fileBuffer = fs.readFileSync('public/FiyatListesi.xlsx');
const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

const rawData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

const validProducts = [];
let stopParsing = false;

for (let i = 0; i < rawData.length; i++) {
  const row = rawData[i];
  
  for (const cell of row) {
    if (typeof cell === 'string' && (cell.trim() === 'İÇECEKLER' || cell.trim() === 'SICAK ve EL YAPIMI İÇECEKLER')) {
      stopParsing = true;
      break;
    }
  }
  if (stopParsing) break;

  for (let j = 0; j < row.length; j++) {
    const cell = row[j];
    if (cell == null) continue;

    // A price might be a number (if xlsx parsed it as number) or string.
    let possiblePrice = NaN;
    if (typeof cell === 'number') {
      possiblePrice = cell;
    } else if (typeof cell === 'string') {
      possiblePrice = parseFloat(cell.replace(',', '.'));
    }

    if (!isNaN(possiblePrice) && possiblePrice > 0) {
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

      if (name && name.toUpperCase() !== 'NAN' && !['ADET', 'BIRIM', 'FIYAT', 'KILOLUK', 'KİLOLUK'].includes(name.toUpperCase())) {
        validProducts.push({ name, unit, price: possiblePrice });
      }
    }
  }
}

const uniqueProductsMap = new Map();
for (const p of validProducts) {
  if (!uniqueProductsMap.has(p.name)) {
    uniqueProductsMap.set(p.name, p);
  }
}
const finalProducts = Array.from(uniqueProductsMap.values());

fs.writeFileSync('perfect_excel_dump.json', JSON.stringify(finalProducts, null, 2));
console.log(`Extracted ${finalProducts.length} products.`);
