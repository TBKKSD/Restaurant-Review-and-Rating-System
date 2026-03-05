import db from "../db.js";

// GET ALL
export const getAllRestaurants = async () => {
  const [rows] = await db.query("SELECT * FROM restaurants");
  return rows;
};

// CREATE
export const createRestaurant = async (name, description, userId) => {
  const [result] = await db.query(
    "INSERT INTO restaurants (name, description, user_id) VALUES (?, ?, ?)",
    [name, description, userId]
  );

  return {
    id: result.insertId,
    name,
    description,
    user_id: userId,
  };
};

// UPDATE
export const updateRestaurant = async (id, name, description) => {
  await db.query(
    "UPDATE restaurants SET name = ?, description = ? WHERE id = ?",
    [name, description, id]
  );
};

// DELETE
export const deleteRestaurant = async (id) => {
  await db.query("DELETE FROM restaurants WHERE id = ?", [id]);
};