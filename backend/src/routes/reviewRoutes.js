import express from "express";
import Review from "../models/reviewModel.js";
import db from "../db.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ADD REVIEW
router.post("/", protect, async (req, res) => {
  const { restaurantId, comment, rating } = req.body;

  const review = await Review.create({
    restaurantId,
    userId: req.user.id,
    comment,
    rating,
  });

  // Recalculate average rating
  const reviews = await Review.find({ restaurantId });
  const avg =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await db.query(
    "UPDATE restaurants SET average_rating = ? WHERE id = ?",
    [avg, restaurantId]
  );

  res.status(201).json(review);
});

// GET REVIEWS BY RESTAURANT
router.get("/:restaurantId", async (req, res) => {
  const reviews = await Review.find({
    restaurantId: req.params.restaurantId,
  });

  res.json(reviews);
});

export default router;