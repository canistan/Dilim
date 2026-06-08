const { Client } = require('pg');
async function run() {
  const client = new Client({ connectionString: "postgresql://neondb_owner:npg_auNltnkeR8m4@ep-aged-shadow-a2o0300e-pooler.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require&uselibpqcompat=true" });
  await client.connect();
  try {
    const res = await client.query(`SELECT email, reset_password_token FROM "customers" WHERE reset_password_token IS NOT NULL ORDER BY updated_at DESC LIMIT 1;`);
    if(res.rows.length > 0) {
      console.log("Email:", res.rows[0].email);
      console.log("Token:", res.rows[0].reset_password_token);
    } else {
      console.log("No token found");
    }
  } catch(e) { console.error(e); }
  await client.end();
}
run();
