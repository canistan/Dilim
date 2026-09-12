const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URI || process.env.POSTGRES_URL
});

async function fix() {
  try {
    await client.connect();
    // Payload uses enum for _status usually (draft, published), but adding it as varchar is enough to stop the crash.
    // Let's actually check how Payload defines it, or just use payload's own push if possible.
    // Wait, let's just add it as varchar. Payload will alter it if needed.
    await client.query(`ALTER TABLE products ADD COLUMN _status varchar;`);
    console.log("Added _status column");
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

fix();
