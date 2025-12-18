const { Pool } = require('pg');
require('dotenv').config();

const poolConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
};

const pool = new Pool(poolConfig);

// pool.connect():
// We do NOT use this here. That would be like manually opening the door.
// Instead, we let the pool automatically open connections when needed (Lazy Loading).

// This is like installing a doorbell. It just waits and listens.
// It fires ONLY when the pool successfully creates a new connection for a query.
pool.on('connect', () => {
  console.log('✓ Connected to PostgreSQL database');
  console.log(`  📍 Host: ${process.env.DB_HOST}`);
  console.log(`  🗄️  Database: ${process.env.DB_NAME}`);
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
