import express from "express";
import Review from "../models/reviewModel.js";
import db from "../db.js";
import { protect } from "../middleware/authMiddleware.js";
import { findUserById } from "../models/userModel.js";

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
    // 1. Fetch reviews from MongoDB
    const reviews = await Review.find({ 
      restaurantId: Number(req.params.restaurantId) 
    }).lean();

    // 2. Manually fetch the email for each review from MySQL
    const reviewsWithEmail = await Promise.all(
      reviews.map(async (review) => {
        const user = await findUserById(review.userId);
        return {
          _id: review._id.toString(),
          restaurantId: review.restaurantId,
          userId: review.userId,
          comment: review.comment,
          rating: review.rating,
          email: user ? user.email : "Unknown User",
        };
      })
    );

    res.json(reviewsWithEmail);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===========================
   DELETE REVIEW
=========================== */
router.delete("/:reviewId", protect, async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    console.log("Attempting to delete review with ID:", reviewId);
    
    // Find the review
    const review = await Review.findById(reviewId);

    if (!review) {
      console.log("Review not found for ID:", reviewId);
      return res.status(404).json({ message: "Review not found" });
    }

    console.log("Found review:", review);

    // Check if the current user is the owner of the review
    if (review.userId !== req.user.id) {
      console.log("User", req.user.id, "not authorized to delete review owned by", review.userId);
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    // Delete the review
    await Review.findByIdAndDelete(reviewId);
    console.log("Review deleted successfully");

    // Recalculate average rating
    const reviews = await Review.find({ restaurantId: review.restaurantId });

    const avg = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    await db.query(
      "UPDATE restaurants SET average_rating = ? WHERE id = ?",
      [avg, review.restaurantId]
    );

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Delete review error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;