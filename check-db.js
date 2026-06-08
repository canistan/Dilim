const { Client } = require('pg');

async function run() {
  const client = new Client({ 
    connectionString: "postgresql://neondb_owner:npg_vn8te4UdqCGD@ep-aged-shadow-a2o0300e-pooler.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require&uselibpqcompat=true" 
  });
  try {
    await client.connect();
    const res = await client.query("SELECT data_type FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'id'");
    console.log("Customers ID type:", res.rows[0].data_type);
  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }
}

run();
