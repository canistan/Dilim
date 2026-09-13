const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URI || process.env.POSTGRES_URL
});

async function fix() {
  try {
    await client.connect();
    
    // Add missing is_active column
    const queries = [
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS "is_active" varchar DEFAULT 'active';`
    ];

    for (const q of queries) {
      await client.query(q);
      console.log("Executed: ", q);
    }
    console.log("Column added successfully.");
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

fix();
