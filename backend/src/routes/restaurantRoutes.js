import express from "express";
import {
  getAllRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "../models/restaurantModel.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET
router.get("/", protect, async (req, res) => {
  const restaurants = await getAllRestaurants();
  res.json(restaurants);
});

// CREATE
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
  await updateRestaurant(
    req.params.id,
    req.body.name,
    req.body.description
  );

  res.json({ message: "Updated" });
});

// DELETE (owner only)
router.delete("/:id", protect, async (req, res) => {
  await deleteRestaurant(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;