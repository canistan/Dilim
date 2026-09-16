import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URI });
  try {
    await client.connect();
    
    const catRes = await client.query('SELECT id, title FROM categories ORDER BY title;');
    console.log("=== KATEGORİLER ===");
    catRes.rows.forEach(c => console.log(`- ${c.title}`));
    
    const prodRes = await client.query(`
      SELECT p.id, p.title as product_title, c.title as category_title 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p._status = 'published' AND p.is_active = 'active'
      ORDER BY c.title, p.title;
    `);
    
    console.log("\n=== ÜRÜNLER ===");
    prodRes.rows.forEach(p => console.log(`${p.id} | ${p.product_title} | ${p.category_title || 'KATEGORİSİZ'}`));
    
  } catch(e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
