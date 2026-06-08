import pg from 'pg';
import fs from 'fs';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URI,
});

const staticProducts = JSON.parse(fs.readFileSync('./src/data/products.json', 'utf8'));

async function run() {
  try {
    const res = await pool.query(`
      SELECT p.id, p.title
      FROM products p 
      ORDER BY p.id ASC
      LIMIT 10
    `);
    
    for (const p of res.rows) {
      const staticProd = staticProducts.find(sp => sp.name === p.title);
      console.log(`ID: ${p.id}, Product: "${p.title}" -> Static match: ${staticProd ? 'YES' : 'NO'}, Image: ${staticProd?.image}`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
run();
