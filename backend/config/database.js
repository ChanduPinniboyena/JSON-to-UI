const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// pool.connect():
// We do NOT use this here. That would be like manually opening the door.
// Instead, we let the pool automatically open connections when needed (Lazy Loading).

// This is like installing a doorbell. It just waits and listens.
// It fires ONLY when the pool successfully creates a new connection for a query.
pool.on('connect', () => {
  console.log("Get req from api")
  console.log('✓ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
