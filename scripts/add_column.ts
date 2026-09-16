import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URI });
  try {
    await client.connect();
    await client.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS has_text_selection boolean;');
    console.log('Column added successfully.');
  } catch(e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
