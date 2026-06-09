import { Client } from 'pg';
import fs from 'fs';

// .env dosyasını oku ve DATABASE_URI'yi bul
const envContent = fs.readFileSync('.env', 'utf-8');
const match = envContent.match(/DATABASE_URI="?([^"\n]+)"?/);
const uri = match ? match[1] : null;

async function run() {
  if (!uri) {
    console.error("DATABASE_URI bulunamadı!");
    return;
  }
  
  const client = new Client({
    connectionString: uri,
  });

  try {
    await client.connect();
    console.log("Siparişler tablosundaki eksik veriler temizleniyor...");
    
    // NULL olan firstName, lastName, email, phone, district, address alanlarını varsayılan ile doldur
    await client.query(`UPDATE "orders" SET "customer_info_first_name" = 'Eski Müşteri' WHERE "customer_info_first_name" IS NULL;`);
    await client.query(`UPDATE "orders" SET "customer_info_last_name" = 'Bilgisi Yok' WHERE "customer_info_last_name" IS NULL;`);
    await client.query(`UPDATE "orders" SET "customer_info_email" = 'bilinmiyor@dilim.com.tr' WHERE "customer_info_email" IS NULL;`);
    await client.query(`UPDATE "orders" SET "customer_info_phone" = '0000000000' WHERE "customer_info_phone" IS NULL;`);
    await client.query(`UPDATE "orders" SET "customer_info_district" = 'Bilinmiyor' WHERE "customer_info_district" IS NULL;`);
    await client.query(`UPDATE "orders" SET "customer_info_address" = 'Bilinmiyor' WHERE "customer_info_address" IS NULL;`);
    
    console.log("Tablolar başarıyla güncellendi.");
  } catch (err) {
    console.error("Hata:", err);
  } finally {
    await client.end();
  }
}

run();
