import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "database",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "rootpassword",
  database: process.env.DB_NAME || "rrrs_db",
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;