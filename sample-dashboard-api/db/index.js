const Pool = require('pg').Pool

let pool = null;

function test() {
  pool
    .query('SELECT NOW()')
    .then(res => console.log(res.rows[0]))
    .catch(err => console.error('Error executing query', err.stack))
}

function init() {
  if (!pool) {
    pool = new Pool({
      user: process.env.DATA_SOURCE_PG_USER,
      host: process.env.DATA_SOURCE_PG_HOST,
      database: process.env.DATA_SOURCE_PG_DATABASE,
      password: process.env.DATA_SOURCE_PG_PASSWORD,
      port: process.env.DATA_SOURCE_PG_PORT,
      max: 10,
    })
  }
  test()
}

async function query(sql) {
  const res = await pool.query(sql)
  return res.rows;
}

module.exports = {
  pool,
  test,
  init,
  query,
}
