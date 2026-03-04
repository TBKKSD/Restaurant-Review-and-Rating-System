import express from "express";
import cors from "cors";
import { db } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

/* HEALTH CHECK */
app.get("/api/health", (req, res) => {
  res.json({ message: "RRRS API running" });
});

/* GET ALL RESTAURANTS */
app.get("/api/restaurants", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM restaurants");
  res.json(rows);
});

/* CREATE RESTAURANT */
app.post("/api/restaurants", async (req, res) => {
  const { name, description } = req.body;
  await db.query(
    "INSERT INTO restaurants (name, description) VALUES (?, ?)",
    [name, description]
  );
  res.json({ message: "Restaurant created" });
});

/* ADD REVIEW */
app.post("/api/reviews", async (req, res) => {
  const { restaurant_id, rating, comment } = req.body;
  await db.query(
    "INSERT INTO reviews (restaurant_id, rating, comment) VALUES (?, ?, ?)",
    [restaurant_id, rating, comment]
  );
  res.json({ message: "Review added" });
});

/* GET REVIEWS BY RESTAURANT */
app.get("/api/restaurants/:id/reviews", async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM reviews WHERE restaurant_id = ?",
    [req.params.id]
  );
  res.json(rows);
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});