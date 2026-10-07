require('dotenv').config();
const { Client } = require('pg');
async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URI });
  await client.connect();
  const res = await client.query('SELECT categories.title, COUNT(products.id) as cnt FROM categories LEFT JOIN products ON products.category_id = categories.id GROUP BY categories.id, categories.title ORDER BY cnt ASC');
  console.log(res.rows);
  await client.end();
}
run();
