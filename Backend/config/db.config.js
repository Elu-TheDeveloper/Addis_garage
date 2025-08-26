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
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release()
  } catch (err) {
    console.error('Failed to connect to the database:', err.message);
  }
})();

async function query(sql, params) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

module.exports = {
  query,
  pool 
};
