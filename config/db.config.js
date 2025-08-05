const mysql = require('mysql2/promise');

const dbConfig = {
  connectionLimit: 10,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT
};

const pool = mysql.createPool(dbConfig);


async function query(sql, params) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

module.exports = {
  query,
  pool 
};
