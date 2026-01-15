import dotenv from 'dotenv';
dotenv.config();
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test database connection
pool.getConnection()
  .then((connection) => {
    console.log('Database Connected Successfully');
    connection.release();
  })
  .catch((error) => {
    console.error('Database Connection Failed:', error.message);
  });

export default pool;
