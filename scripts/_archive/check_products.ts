import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URI });
  try {
    await client.connect();
    const res = await client.query('SELECT id, title, has_number_selection, has_text_selection FROM products WHERE title ILIKE \'%mum%\' OR title ILIKE \'%pleksi%\';');
    console.log(res.rows);
  } catch(e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
