const { mysqlPool } = require('../db');

const User = {
    // 1. สร้าง User ใหม่ (Register)
    create: async (username, hashedPassword) => {
        const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
        const [result] = await mysqlPool.execute(sql, [username, hashedPassword]);
        return result;
    },

    // 2. ค้นหา User 
    findByUsername: async (username) => {
        const sql = `SELECT * FROM users WHERE username = ?`;
        const [rows] = await mysqlPool.execute(sql, [username]);
        return rows[0]; // ส่งคืน User คนแรกที่เจอ
    },

    findByID: async (id) => {
        const sql = `SELECT * FROM users WHERE id = ?`;
        const [rows] = await mysqlPool.execute(sql, [id]);
        return rows[0]; // ส่งคืน User คนแรกที่เจอ
     }
};

module.exports = User;