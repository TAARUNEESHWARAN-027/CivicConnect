// ==============================
// Database Connection
// ==============================
// This file sets up the MySQL connection pool
// using environment variables for security.

const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool (better for production than single connections)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'civicconnect',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Export a promise-based version for async/await usage
const promisePool = pool.promise();

module.exports = promisePool;
