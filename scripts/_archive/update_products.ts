import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URI });
  try {
    await client.connect();
    
    // Rakamlı Mumlar -> rakam seçimi
    await client.query('UPDATE products SET has_number_selection = true WHERE id = 367;');
    
    // Pleksi -> yazı seçimi
    await client.query('UPDATE products SET has_text_selection = true, title = \'Yazılı Pleksi\' WHERE id = 361;');

    // Yazılı Mumlar -> Siteden gizle (pasif)
    await client.query('UPDATE products SET is_active = \'passive\' WHERE id = 365;');
    
    console.log('Update done');
  } catch(e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
