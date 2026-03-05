import pool from "../db.js";

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return rows[0];
};

export const createUser = async (email, hashedPassword) => {
  const [result] = await pool.query(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hashedPassword]
  );

  return {
    id: result.insertId,
    email,
  };
};

export const findUserById = async (id) => {
  const [rows] = await pool.query(
    "SELECT id, email FROM users WHERE id = ?",
    [id]
  );
  return rows[0];
};