import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const uri = process.env.DATABASE_URI || process.env.POSTGRES_URL;

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
    console.log("Veritabanına bağlanıldı. Lock tabloları temizleniyor...");
    
    await client.query('DROP TABLE IF EXISTS "payload_locked_documents__rels" CASCADE;');
    await client.query('DROP TABLE IF EXISTS "payload_locked_documents" CASCADE;');
    
    console.log("Tablolar başarıyla silindi. Payload onları yeniden, doğru şemayla oluşturacak.");
  } catch (err) {
    console.error("Hata:", err);
  } finally {
    await client.end();
  }
}

run();
