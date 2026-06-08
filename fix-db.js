import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URI,
});

async function run() {
  await client.connect();
  console.log('Connected to DB');

  try {
    // Drop the old Custom Cakes table and enums so Drizzle doesn't ask rename questions
    await client.query(`DROP TABLE IF EXISTS "custom_cakes" CASCADE;`);
    console.log('Dropped custom_cakes table');

    await client.query(`DROP TYPE IF EXISTS "enum_custom_cakes_cream_flavor" CASCADE;`);
    await client.query(`DROP TYPE IF EXISTS "enum_custom_cakes_extra_ingredients" CASCADE;`);
    await client.query(`DROP TYPE IF EXISTS "enum_custom_cakes_sponge_type" CASCADE;`);
    await client.query(`DROP TYPE IF EXISTS "enum_custom_cakes_status" CASCADE;`);
    console.log('Dropped custom_cakes enums');

  } catch (err) {
    console.error('Error running migrations:', err);
  } finally {
    await client.end();
  }
}

run();
