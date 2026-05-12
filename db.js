const { Pool } = require("pg");
require("dotenv").config(); // Loads variables from .env

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.DB_HOST === "localhost" || process.env.DB_HOST === "127.0.0.1" 
    ? false 
    : { rejectUnauthorized: false }
});

// Test the connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Connection error", err.stack);
  } else {
    console.log("PostgreSQL Connected Successfully at:", res.rows[0].now);
  }
});

module.exports = pool;
