const { Client } = require('pg');

async function run() {
  const client = new Client({ 
    connectionString: "postgresql://neondb_owner:npg_auNltnkeR8m4@ep-aged-shadow-a2o0300e-pooler.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require&uselibpqcompat=true" 
  });
  
  try {
    await client.connect();
    
    console.log("Adding remaining missing columns to orders table...");
    
    const columns = [
      { name: "customer_info_district", type: "varchar" },
      { name: "customer_info_address", type: "varchar" },
      { name: "customer_info_phone", type: "varchar" },
      { name: "customer_info_email", type: "varchar" },
      { name: "customer_info_is_corporate", type: "boolean" }
    ];

    for (const col of columns) {
      try {
        await client.query(`ALTER TABLE "orders" ADD COLUMN "${col.name}" ${col.type};`);
        console.log(`Added ${col.name}`);
      } catch (e) {
        if(!e.message.includes('already exists')) console.warn(e.message);
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
