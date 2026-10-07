import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URI,
});

async function run() {
  try {
    const res = await pool.query(`
      SELECT m.id, m.url, m.filename 
      FROM media m
      ORDER BY id DESC LIMIT 20
    `);
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
run();
