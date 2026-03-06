import express from "express";
import Review from "../models/reviewModel.js";
import db from "../db.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===========================
   ADD / UPDATE REVIEW
=========================== */
router.post("/", protect, async (req, res) => {
  const { restaurantId, comment, rating } = req.body;

  try {
    const review = await Review.findOneAndUpdate(
      { restaurantId, userId: req.user.id },
      {
        restaurantId,
        userId: req.user.id,
        comment,
        rating,
      },
      { upsert: true, new: true }
    );

    // recalculate average rating
    const reviews = await Review.find({ restaurantId });

    const avg =
      reviews.reduce((sum, r) => sum + r.rating, 0) /
      reviews.length;

    await db.query(
      "UPDATE restaurants SET average_rating = ? WHERE id = ?",
      [avg, restaurantId]
    );

    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===========================
   GET REVIEWS
=========================== */
router.get("/:restaurantId", async (req, res) => {
  try {
    const reviews = await Review.aggregate([
      {
        $match: {
          restaurantId: Number(req.params.restaurantId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          rating: 1,
          comment: 1,
          createdAt: 1,
          email: "$user.email",
        },
      },
    ]);

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;