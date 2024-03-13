const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'chin123',
  host: 'localhost',
  port: 5432, // default Postgres port
  database: 'exercise7'
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};