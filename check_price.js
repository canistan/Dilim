require('dotenv').config();
const { Client } = require('pg');

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URI });
  await client.connect();
  const res = await client.query("SELECT title, price FROM products WHERE title ILIKE '%Çatal%' OR title ILIKE '%Peynirli Kol Böreği%' LIMIT 5");
  console.log("Database Prices:");
  console.table(res.rows);
  await client.end();
}
run();
