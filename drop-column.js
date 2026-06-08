const { Client } = require('pg');
async function run() {
  const client = new Client({ connectionString: "postgresql://neondb_owner:npg_auNltnkeR8m4@ep-aged-shadow-a2o0300e-pooler.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require&uselibpqcompat=true" });
  await client.connect();
  try {
    await client.query(`ALTER TABLE "orders" DROP COLUMN IF EXISTS "customer_info_name";`);
    console.log("Dropped customer_info_name");
  } catch(e) { console.error(e); }
  await client.end();
}
run();
