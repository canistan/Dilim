const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URI || process.env.POSTGRES_URL
});

async function fix() {
  try {
    await client.connect();
    
    // Drop bad columns
    const queries = [
      `ALTER TABLE orders DROP COLUMN IF EXISTS "iyzicoPaymentId";`,
      `ALTER TABLE orders DROP COLUMN IF EXISTS "refundStatus";`,
      `ALTER TABLE orders DROP COLUMN IF EXISTS "cancellationRequest_requested";`,
      `ALTER TABLE orders DROP COLUMN IF EXISTS "cancellationRequest_requestedAt";`,
      `ALTER TABLE orders DROP COLUMN IF EXISTS "cancellationRequest_decision";`
    ];

    for (const q of queries) {
      await client.query(q);
      console.log("Executed: ", q);
    }
    console.log("Bad columns dropped successfully.");
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

fix();
