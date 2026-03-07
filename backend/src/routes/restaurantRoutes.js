import express from "express";
import db from "../db.js";
import {
  getAllRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "../models/restaurantModel.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  }
});

/* =========================
   PUBLIC ROUTE
========================= */

// View restaurants (no login required)
router.get("/", async (req, res) => {
  const restaurants = await getAllRestaurants();
  res.json(restaurants);
});

/* =========================
   PROTECTED ROUTES
========================= */

// CREATE restaurant
router.post("/", protect, upload.single("image"), async (req, res) => {
  const { name, description } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const restaurant = await createRestaurant(
    name,
    description,
    image,
    req.user.id
  );

  res.status(201).json(restaurant);
});

// UPDATE (owner only)
router.put("/:id", protect, upload.single("image"), async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM restaurants WHERE id = ?",
    [req.params.id]
  );

  const restaurant = rows[0];

  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }

  if (restaurant.user_id !== req.user.id) {
    return res.status(403).json({ message: "Not authorized" });
  }

  const image = req.file ? `/uploads/${req.file.filename}` : req.body.image || restaurant.image;

  await updateRestaurant(
    req.params.id,
    req.body.name,
    req.body.description,
    image
  );

  res.json({ message: "Updated" });
});

// DELETE (owner only)
router.delete("/:id", protect, async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM restaurants WHERE id = ?",
    [req.params.id]
  );

  const restaurant = rows[0];

  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }

  if (Number(restaurant.user_id) !== Number(req.user.id)) {
      return res.status(403).json({ message: "Not authorized" });
  }

  await deleteRestaurant(req.params.id);

  res.json({ message: "Deleted" });
});

export default router;