const { Client } = require('pg');
async function run() {
  const client = new Client({ connectionString: "postgresql://neondb_owner:npg_auNltnkeR8m4@ep-aged-shadow-a2o0300e-pooler.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require&uselibpqcompat=true" });
  await client.connect();
  const res = await client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`);
  console.log(res.rows.map(r => r.table_name).join('\n'));
  await client.end();
}
run();
