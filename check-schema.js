const { Client } = require('pg');

async function run() {
  const client = new Client({ 
    connectionString: "postgresql://neondb_owner:npg_auNltnkeR8m4@ep-aged-shadow-a2o0300e-pooler.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require&uselibpqcompat=true" 
  });
  
  try {
    await client.connect();
    
    console.log("Checking columns in orders table...");
    const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'orders';
    `);
    
    console.log("Orders table columns:");
    res.rows.forEach(row => {
      console.log(`- ${row.column_name} (${row.data_type})`);
    });

  } catch (error) {
    console.error("DB Error:", error);
  } finally {
    await client.end();
  }
}

run();
