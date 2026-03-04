const mysql = require('mysql2')
const mongoose = require('mongoose');
const e = require('express');
require('dotenv').config()

const db = mysql.createPool({
  host: process.env.MYSQL_HOST || 'mysql',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  database: process.env.MYSQL_NAME || 'rrrs_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const connectMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://mongo_db:27017/rrrs_reviews';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
  }catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = {
    mysqlPool,
    connectMongoDB
}