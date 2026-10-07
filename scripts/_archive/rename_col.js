const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URI || process.env.POSTGRES_URL || 'postgres://localhost:5432/dilim'
});
async function run() {
  try {
    await pool.query('ALTER TABLE "orders" RENAME COLUMN "customer_info_name" TO "customer_info_first_name";');
    console.log('Renamed name to firstName successfully');
  } catch (err) { console.error(err.message); }
  
  try {
    await pool.query('ALTER TABLE "orders" ADD COLUMN "customer_info_last_name" varchar;');
    console.log('Added lastName successfully');
  } catch (err) { console.error(err.message); }

  try {
    await pool.query('ALTER TABLE "orders" ADD COLUMN "customer_info_district" varchar;');
    console.log('Added district successfully');
  } catch (err) { console.error(err.message); }

  try {
    await pool.query('ALTER TABLE "orders" ADD COLUMN "customer_info_is_corporate" boolean;');
  } catch (err) {}

  try {
    await pool.query('ALTER TABLE "orders" ADD COLUMN "customer_info_company_name" varchar;');
  } catch (err) {}

  try {
    await pool.query('ALTER TABLE "orders" ADD COLUMN "customer_info_tax_office" varchar;');
  } catch (err) {}

  try {
    await pool.query('ALTER TABLE "orders" ADD COLUMN "customer_info_tax_number" varchar;');
  } catch (err) {}

  process.exit(0);
}
run();
