import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "database",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "rootpassword",
  database: process.env.DB_NAME || "rrrs_db",
  port: process.env.DB_PORT || 4000,
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true // TiDB works with default Node.js certs
  },
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;