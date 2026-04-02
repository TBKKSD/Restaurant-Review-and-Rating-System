import request from "supertest";
import app from "./app.js";

test("GET / returns a running API message", async () => {
  const response = await request(app).get("/");

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({ message: "RRRS API is running 🚀" });
});

test("GET /unknown returns 404 route not found", async () => {
  const response = await request(app).get("/unknown-route");

  expect(response.statusCode).toBe(404);
  expect(response.body).toEqual({ message: "Route not found" });
});