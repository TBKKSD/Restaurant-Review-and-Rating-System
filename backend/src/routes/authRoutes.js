import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  findUserByEmail,
  createUser,
} from "../models/userModel.js";

export const createAuthRouter = ({
  findUserByEmailFn = findUserByEmail,
  createUserFn = createUser,
  bcryptLib = bcrypt,
  jwtLib = jwt,
} = {}) => {
  const router = express.Router();

  /* ===========================
     REGISTER
  =========================== */
  router.post("/register", async (req, res) => {
    try {
      const { email, password } = req.body;

      const existingUser = await findUserByEmailFn(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcryptLib.hash(password, 10);

      const newUser = await createUserFn(email, hashedPassword);

      res.status(201).json({
        message: "User registered successfully",
        user: newUser,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  /* ===========================
     LOGIN
  =========================== */
  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await findUserByEmailFn(email);
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcryptLib.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Wrong password" });
      }

      const token = jwtLib.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || "supersecret",
        { expiresIn: "1h" }
      );

      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  return router;
};

export default createAuthRouter();