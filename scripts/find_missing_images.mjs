import pg from 'pg';
import 'dotenv/config';

const { Client } = pg;
const client = new Client({
  connectionString: process.env.DATABASE_URI,
});

async function findMissing() {
  await client.connect();
  const res = await client.query(`
    SELECT id, title, category_id 
    FROM products 
    WHERE image_id IS NULL OR image_id = (SELECT id FROM media WHERE filename = 'test.jpg' LIMIT 1)
  `);
  console.log(`Found ${res.rowCount} products missing images.`);
  res.rows.forEach(r => console.log(`- ${r.title} (ID: ${r.id})`));
  await client.end();
}
findMissing().catch(console.error);
