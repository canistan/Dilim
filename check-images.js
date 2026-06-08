import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URI,
});

async function run() {
  try {
    const res = await pool.query(`
      SELECT p.id, p.title, m.url, m.filename 
      FROM products p 
      LEFT JOIN products_rels pr ON p.id = pr.parent_id AND pr.path = 'images'
      LEFT JOIN media m ON pr.media_id = m.id
      ORDER BY p.id DESC
      LIMIT 10
    `);
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
run();
