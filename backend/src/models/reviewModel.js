import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  restaurantId: {
    type: Number,
    required: true,
  },
  userId: {
    type: Number,
    required: true,
  },
  comment: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
});

// Prevent duplicate review
reviewSchema.index({ restaurantId: 1, userId: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);