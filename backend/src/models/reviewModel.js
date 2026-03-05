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

export default mongoose.model("Review", reviewSchema);