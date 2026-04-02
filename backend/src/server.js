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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});