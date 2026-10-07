// Blog content sütununu text -> jsonb'ye dönüştürmek için migration scripti
import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URI,
});

async function migrate() {
  await client.connect();
  console.log('Connected to database');
  
  try {
    // Mevcut content verilerini kontrol et
    const result = await client.query('SELECT id, content FROM blog WHERE content IS NOT NULL');
    console.log(`Found ${result.rows.length} blog rows with content`);
    
    // Eski text sütununu kaldır (Payload yeniden oluşturacak)
    await client.query('ALTER TABLE blog DROP COLUMN IF EXISTS content');
    console.log('Dropped old content column');
    
    console.log('Migration complete! Restart dev server for Payload to recreate the column as jsonb.');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await client.end();
  }
}

migrate();
