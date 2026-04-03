import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";
import { createReviewRouter } from "./reviewRoutes.js";

const mockReviewFindOneAndUpdate = jest.fn();
const mockReviewFind = jest.fn();
const mockReviewFindById = jest.fn();
const mockReviewFindByIdAndDelete = jest.fn();
const mockDbQuery = jest.fn();
const mockFindUserById = jest.fn();

const fakeProtect = (req, res, next) => {
  req.user = { id: 1, email: "test@example.com" };
  next();
};

const buildApp = () => {
  const reviewRoutes = createReviewRouter({
    ReviewModel: {
      findOneAndUpdate: mockReviewFindOneAndUpdate,
      find: mockReviewFind,
      findById: mockReviewFindById,
      findByIdAndDelete: mockReviewFindByIdAndDelete,
    },
    dbClient: { query: mockDbQuery },
    protectMiddleware: fakeProtect,
    findUserByIdFn: mockFindUserById,
  });

  const app = express();
  app.use(express.json());
  app.use("/api/reviews", reviewRoutes);
  return app;
};

describe("Review routes", () => {
  beforeEach(() => {
    mockReviewFindOneAndUpdate.mockReset();
    mockReviewFind.mockReset();
    mockReviewFindById.mockReset();
    mockReviewFindByIdAndDelete.mockReset();
    mockDbQuery.mockReset();
    mockFindUserById.mockReset();
  });

  test("POST /api/reviews adds/updates a review", async () => {
    const mockReview = {
      _id: "reviewId",
      restaurantId: 1,
      userId: 1,
      comment: "Great food!",
      rating: 5,
    };

    mockReviewFindOneAndUpdate.mockResolvedValue(mockReview);
    mockReviewFind.mockResolvedValue([mockReview]);
    mockDbQuery.mockResolvedValue();

    const response = await request(buildApp())
      .post("/api/reviews")
      .send({
        restaurantId: 1,
        comment: "Great food!",
        rating: 5,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(mockReview);
    expect(mockReviewFindOneAndUpdate).toHaveBeenCalledWith(
      { restaurantId: 1, userId: 1 },
      {
        restaurantId: 1,
        userId: 1,
        comment: "Great food!",
        rating: 5,
      },
      { upsert: true, new: true }
    );
    expect(mockDbQuery).toHaveBeenCalledWith(
      "UPDATE restaurants SET average_rating = ? WHERE id = ?",
      [5, 1]
    );
  });

  test("DELETE /api/reviews/:reviewId deletes a review", async () => {
    const mockReview = {
      _id: "reviewId",
      restaurantId: 1,
      userId: 1,
      comment: "Great food!",
      rating: 5,
    };

    mockReviewFindById.mockResolvedValue(mockReview);
    mockReviewFindByIdAndDelete.mockResolvedValue();
    mockReviewFind.mockResolvedValue([]);
    mockDbQuery.mockResolvedValue();

    const response = await request(buildApp())
      .delete("/api/reviews/reviewId");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Review deleted successfully" });
    expect(mockReviewFindById).toHaveBeenCalledWith("reviewId");
    expect(mockReviewFindByIdAndDelete).toHaveBeenCalledWith("reviewId");
    expect(mockDbQuery).toHaveBeenCalledWith(
      "UPDATE restaurants SET average_rating = ? WHERE id = ?",
      [0, 1]
    );
  });
});