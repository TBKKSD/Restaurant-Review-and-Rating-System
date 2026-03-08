import express from "express";
import db from "../db.js";

import {
  getAllRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
} from "../models/restaurantModel.js";

import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import processImage from "../middleware/processImage.js";

import fs from "fs";

const router = express.Router();

/* =========================
   PUBLIC ROUTES
========================= */

router.get("/", async (req, res) => {
  const restaurants = await getAllRestaurants();
  res.json(restaurants);
});

router.get("/:id", async (req, res) => {

  try {

    const [rows] = await db.query(
      "SELECT * FROM restaurants WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Restaurant not found"
      });
    }

    res.json(rows[0]);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server error"
    });

  }

});

router.get("/:id/menu", async (req, res) => {
  const restaurantId = req.params.id;

  const [rows] = await db.query(
    "SELECT * FROM menu_items WHERE restaurant_id = ?",
    [restaurantId]
  );

  res.json(rows);
});

/* =========================
   PROTECTED ROUTES
========================= */

router.post(
  "/",
  protect,
  upload.single("image"),
  processImage,
  async (req, res) => {

    const { name, description, cuisine } = req.body;

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    const restaurant = await createRestaurant(
      name,
      description,
      image,
      cuisine,
      req.user.id
    );

    res.status(201).json(restaurant);

  }
);

router.post( "/:id/menu", upload.single("image"), processImage, async (req, res) => {
  try {
    const restaurantId = req.params.id;

    const { name, description, price } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await db.query(
      "INSERT INTO menu_items (restaurant_id, name, description, price, image_url) VALUES (?, ?, ?, ?, ?)",
      [restaurantId, name, description, price, imageUrl]
    );

    res.json({
      id: result.insertId,
      restaurant_id: restaurantId,
      name,
      description,
      price,
      image_url: imageUrl
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put(
  "/:id",
  protect,
  upload.single("image"),
  processImage,
  async (req, res) => {

    const [rows] = await db.query(
      "SELECT * FROM restaurants WHERE id = ?",
      [req.params.id]
    );

    const restaurant = rows[0];

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found"
      });
    }

    if (restaurant.user_id !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    let image = restaurant.image;

    if (req.file) {

      image = `/uploads/${req.file.filename}`;

      if (restaurant.image) {

        const oldImagePath =
          restaurant.image.replace("/uploads/", "uploads/");

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

    res.json({
      message: "Updated"
    });

  }
);

router.delete("/:id", protect, async (req, res) => {

  const [rows] = await db.query(
    "SELECT * FROM restaurants WHERE id = ?",
    [req.params.id]
  );

  const restaurant = rows[0];

  if (!restaurant) {
    return res.status(404).json({
      message: "Restaurant not found"
    });
  }

  if (Number(restaurant.user_id) !== Number(req.user.id)) {
    return res.status(403).json({
      message: "Not authorized"
    });
  }

  if (restaurant.image) {

    const imagePath =
      restaurant.image.replace("/uploads/", "uploads/");

    try {

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

    } catch (error) {
      console.error("Error deleting image:", error);
    }

  }

  await deleteRestaurant(req.params.id);

  res.json({
    message: "Deleted"
  });

});

export default router;