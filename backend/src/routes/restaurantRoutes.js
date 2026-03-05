import express from "express";
import db from "../db.js";
import {
  getAllRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "../models/restaurantModel.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   PUBLIC ROUTE
========================= */

// View restaurants (no login required)
router.get("/", async (req, res) => {
  const restaurants = await getAllRestaurants();
  res.json(restaurants);
});

/* =========================
   PROTECTED ROUTES
========================= */

// CREATE restaurant
router.post("/", protect, async (req, res) => {
  const { name, description } = req.body;

  const restaurant = await createRestaurant(
    name,
    description,
    req.user.id
  );

  res.status(201).json(restaurant);
});

// UPDATE (owner only)
router.put("/:id", protect, async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM restaurants WHERE id = ?",
    [req.params.id]
  );

  const restaurant = rows[0];

  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }

  if (restaurant.user_id !== req.user.id) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await updateRestaurant(
    req.params.id,
    req.body.name,
    req.body.description
  );

  res.json({ message: "Updated" });
});

// DELETE (owner only)
router.delete("/:id", protect, async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM restaurants WHERE id = ?",
    [req.params.id]
  );

  const restaurant = rows[0];

  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }

  if (restaurant.user_id !== req.user.id) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await deleteRestaurant(req.params.id);

  res.json({ message: "Deleted" });
});

export default router;