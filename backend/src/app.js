import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Parse JSON body
app.use(express.json());

// Allow frontend (Vite) to access backend
app.use(
  cors({
    origin: ["http://localhost:5173", "https://restaurant-review-and-rating-system.vercel.app/restaurant-review-and-rating-system.vercel.app"],
    credentials: true,
  })
);

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.json({ message: "RRRS API is running 🚀" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

export default app;
