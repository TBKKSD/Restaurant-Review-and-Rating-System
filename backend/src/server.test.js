import request from "supertest";
import express from "express";

test("health check", async () => {
  const app = express();
  app.get("/health", (req, res) => res.json({ ok: true }));

  const res = await request(app).get("/health");
  expect(res.statusCode).toBe(200);
});