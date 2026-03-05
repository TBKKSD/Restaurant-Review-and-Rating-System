import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import connectMongo from "./config/mongo.js";
import reviewRoutes from "./routes/reviewRoutes.js";

connectMongo();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* =====================================
   Middleware
===================================== */

// Parse JSON body
app.use(express.json());

// Allow frontend (Vite) to access backend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

/* =====================================
   Routes
===================================== */

app.get("/", (req, res) => {
  res.json({ message: "RRRS API is running 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/reviews", reviewRoutes);


/* =====================================
   404 Handler
===================================== */

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* =====================================
   Global Error Handler
===================================== */

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong",
  });
});

/* =====================================
   Start Server
===================================== */

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});