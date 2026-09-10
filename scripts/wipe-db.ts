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
    console.log("Müşteriler ve siparişler temizleniyor...");
    
    await client.query('DELETE FROM "orders_order_items";');
    await client.query('DELETE FROM "orders";');
    await client.query('DELETE FROM "customers";');
    
    console.log("Temizlik başarıyla tamamlandı!");
  } catch (err) {
    console.error("Hata:", err);
  } finally {
    await client.end();
  }
}

run();
