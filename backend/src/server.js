import dotenv from "dotenv";
import connectMongo from "./config/mongo.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

try {
  connectMongo();
} catch (error) {
  console.log("MongoDB connection failed, continuing without it:", error.message);
}

if (process.env.NODE_ENV !== "test") {
  const { default: authRoutes } = await import("./routes/authRoutes.js");
  const { default: restaurantRoutes } = await import("./routes/restaurantRoutes.js");
  const { default: reviewRoutes } = await import("./routes/reviewRoutes.js");

  app.use("/api/auth", authRoutes);
  app.use("/api/restaurants", restaurantRoutes);
  app.use("/api/reviews", reviewRoutes);
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});