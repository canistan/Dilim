const { Client } = require('pg');

async function run() {
  const client = new Client({ 
    connectionString: "postgresql://neondb_owner:npg_vn8te4UdqCGD@ep-aged-shadow-a2o0300e-pooler.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require&uselibpqcompat=true" 
  });
  
  try {
    await client.connect();
    
    console.log("Creating customers_addresses table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS "customers_addresses" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "id" varchar PRIMARY KEY NOT NULL,
        "title" varchar NOT NULL,
        "district" varchar NOT NULL,
        "address" varchar NOT NULL,
        "is_corporate" boolean,
        "company_name" varchar,
        "tax_office" varchar,
        "tax_number" varchar
      );
      CREATE INDEX IF NOT EXISTS "customers_addresses_order_idx" ON "customers_addresses" ("_order");
      CREATE INDEX IF NOT EXISTS "customers_addresses_parent_id_idx" ON "customers_addresses" ("_parent_id");
    `);

    try {
      await client.query(`ALTER TABLE "customers_addresses" ADD CONSTRAINT "customers_addresses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "customers" ("id") ON DELETE CASCADE;`);
    } catch(e) {
      if(!e.message.includes('already exists')) {
        console.warn("FK error addresses:", e.message);
      }
    }

    console.log("Creating customers_sessions table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS "customers_sessions" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "id" varchar PRIMARY KEY NOT NULL,
        "created_at" timestamp(3) with time zone NOT NULL DEFAULT now(),
        "updated_at" timestamp(3) with time zone NOT NULL DEFAULT now(),
        "expires_at" timestamp(3) with time zone NOT NULL
      );
      CREATE INDEX IF NOT EXISTS "customers_sessions_order_idx" ON "customers_sessions" ("_order");
      CREATE INDEX IF NOT EXISTS "customers_sessions_parent_id_idx" ON "customers_sessions" ("_parent_id");
    `);

    try {
      await client.query(`ALTER TABLE "customers_sessions" ADD CONSTRAINT "customers_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "customers" ("id") ON DELETE CASCADE;`);
    } catch(e) {
      if(!e.message.includes('already exists')) {
        console.warn("FK error sessions:", e.message);
      }
    }

    console.log("Database schema fixed successfully!");
  } catch (error) {
    console.error("DB Error:", error);
  } finally {
    await client.end();
  }
}

run();
