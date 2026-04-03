import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";
import { createRestaurantRouter } from "./restaurantRoutes.js";

const mockCreateRestaurant = jest.fn();
const mockDeleteRestaurant = jest.fn();
const mockDbQuery = jest.fn();

const fakeProtect = (req, res, next) => {
  req.user = { id: 1, email: "test@example.com" };
  next();
};

const fakeUpload = { single: () => (req, res, next) => next() };
const fakeProcessImage = (req, res, next) => next();

const buildApp = () => {
  const restaurantRoutes = createRestaurantRouter({
    createRestaurantFn: mockCreateRestaurant,
    deleteRestaurantFn: mockDeleteRestaurant,
    dbClient: { query: mockDbQuery },
    protectMiddleware: fakeProtect,
    uploadMiddleware: fakeUpload,
    processImageMiddleware: fakeProcessImage,
  });

  const app = express();
  app.use(express.json());
  app.use("/api/restaurants", restaurantRoutes);
  return app;
};

describe("Restaurant routes", () => {
  beforeEach(() => {
    mockCreateRestaurant.mockReset();
    mockDeleteRestaurant.mockReset();
    mockDbQuery.mockReset();
  });

  test("POST /api/restaurants creates a restaurant", async () => {
    mockCreateRestaurant.mockResolvedValue({
      id: 1,
      name: "Test Restaurant",
      description: "A test restaurant",
      image: null,
      cuisine: "Thai",
      user_id: 1,
    });

    const response = await request(buildApp())
      .post("/api/restaurants")
      .send({
        name: "Test Restaurant",
        description: "A test restaurant",
        cuisine: "Thai",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      id: 1,
      name: "Test Restaurant",
      description: "A test restaurant",
      image: null,
      cuisine: "Thai",
      user_id: 1,
    });
  });

  test("DELETE /api/restaurants/:id deletes a restaurant", async () => {
    mockDbQuery.mockResolvedValue([[{ id: 1, user_id: 1, image: null }]]);
    mockDeleteRestaurant.mockResolvedValue();

    const response = await request(buildApp())
      .delete("/api/restaurants/1");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: "Deleted"
    });
    expect(mockDbQuery).toHaveBeenCalledWith(
      "SELECT * FROM restaurants WHERE id = ?",
      ["1"]
    );
    expect(mockDeleteRestaurant).toHaveBeenCalledWith("1");
  });
});
