import db from "../db.js";

// GET ALL
export const getAllRestaurants = async () => {
  const [rows] = await db.query("SELECT * FROM restaurants");
  return rows;
};

// CREATE
export const createRestaurant = async (name, description, image, cuisine, userId) => {
  const [result] = await db.query(
    "INSERT INTO restaurants (name, description, image, cuisine, user_id) VALUES (?, ?, ?, ?, ?)",
    [name, description, image, cuisine, userId]
  );

  return {
    id: result.insertId,
    name,
    description,
    image,
    cuisine,
    user_id: userId,
  };
};

// UPDATE
export const updateRestaurant = async (id, name, description, image) => {
  await db.query(
    "UPDATE restaurants SET name = ?, description = ?, image = ? WHERE id = ?",
    [name, description, image, id]
  );
};

// DELETE
export const deleteRestaurant = async (id) => {
  await db.query("DELETE FROM restaurants WHERE id = ?", [id]);
};