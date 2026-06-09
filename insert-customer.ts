import { Client } from 'pg';
import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf-8');
const match = envContent.match(/DATABASE_URI="?([^"\n]+)"?/);
const uri = match ? match[1] : null;

async function run() {
  if (!uri) return;
  const client = new Client({ connectionString: uri });
  try {
    await client.connect();
    // Insert a dummy customer
    await client.query(`
      INSERT INTO "customers" 
      ("email", "name", "created_at", "updated_at") 
      VALUES 
      ('test@test.com', 'Test Müşteri', NOW(), NOW());
    `);
    console.log("Dummy customer inserted.");
  } catch (err) {
    console.error("Hata:", err);
  } finally {
    await client.end();
  }
}
run();
