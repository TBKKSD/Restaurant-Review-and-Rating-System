import dotenv from "dotenv";
import connectMongo from "./config/mongo.js";
import app from "./app.js";

import authRoutes from "./routes/authRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

try {
  connectMongo();
} catch (error) {
  console.log("MongoDB connection failed, continuing without it:", error.message);
}


if (process.env.NODE_ENV !== "test") {
  app.use("/api/auth", authRoutes);
  app.use("/api/restaurants", restaurantRoutes);
  app.use("/api/reviews", reviewRoutes);
}

app.use((req, res) => {
  res.status(404).json({ message: "Route not found from server.js" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});