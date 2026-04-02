import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";
import bcrypt from "bcryptjs";
import { createAuthRouter } from "./authRoutes.js";

const mockFindUserByEmail = jest.fn();
const mockCreateUser = jest.fn();

const buildApp = () => {
  const authRoutes = createAuthRouter({
    findUserByEmailFn: mockFindUserByEmail,
    createUserFn: mockCreateUser,
    bcryptLib: bcrypt,
  });

  const app = express();
  app.use(express.json());
  app.use("/api/auth", authRoutes);
  return app;
};

describe("Auth routes", () => {
  beforeEach(() => {
    mockFindUserByEmail.mockReset();
    mockCreateUser.mockReset();
  });

  test("POST /api/auth/register creates a new user", async () => {
    mockFindUserByEmail.mockResolvedValue(undefined);
    mockCreateUser.mockResolvedValue({ id: 1, email: "test@example.com" });

    const response = await request(buildApp())
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "password" });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      message: "User registered successfully",
      user: { id: 1, email: "test@example.com" },
    });
  });

  test("POST /api/auth/login returns a token on valid credentials", async () => {
    const hashedPassword = await bcrypt.hash("password", 10);
    mockFindUserByEmail.mockResolvedValue({
      id: 1,
      email: "test@example.com",
      password: hashedPassword,
    });

    const response = await request(buildApp())
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password" });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(typeof response.body.token).toBe("string");
  });
});
