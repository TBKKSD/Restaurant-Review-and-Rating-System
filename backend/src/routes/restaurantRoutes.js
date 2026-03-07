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
import sharp from "sharp";
import fs from "fs";

const router = express.Router();

// Configure multer for image uploads (use memory storage for processing)
const upload = multer({
  storage: multer.memoryStorage(),
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

// Middleware to process and compress image
const processImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const filename = `${uniqueSuffix}.webp`;
    const filepath = path.join("uploads", filename);

    // Resize and compress image to webp format
    await sharp(req.file.buffer)
      .resize(800, 600, {
        fit: "cover",
        position: "center"
      })
      .webp({ quality: 80 })
      .toFile(filepath);

    req.file.filename = filename;
    req.file.filepath = filepath;
    next();
  } catch (error) {
    console.error("Image processing error:", error);
    res.status(400).json({ message: "Error processing image", error: error.message });
  }
};

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
router.post("/", protect, upload.single("image"), processImage, async (req, res) => {
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
router.put("/:id", protect, upload.single("image"), processImage, async (req, res) => {
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

  let image = restaurant.image;
  if (req.file) {
    image = `/uploads/${req.file.filename}`;
    
    // Delete old image if it exists
    if (restaurant.image) {
      const oldImagePath = restaurant.image.replace("/uploads/", "uploads/");
      try {
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      } catch (error) {
        console.error("Error deleting old image:", error);
      }
    }
  }

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

  // Delete image file if it exists
  if (restaurant.image) {
    const imagePath = restaurant.image.replace("/uploads/", "uploads/");
    try {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  }

  await deleteRestaurant(req.params.id);

  res.json({ message: "Deleted" });
});

export default router;