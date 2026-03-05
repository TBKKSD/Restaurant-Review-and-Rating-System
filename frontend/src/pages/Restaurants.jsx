import { useEffect, useState } from "react";
import API from "../api";

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [reviews, setReviews] = useState({});
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const token = localStorage.getItem("token");

  const fetchRestaurants = async () => {
    const res = await API.get("/restaurants");
    setRestaurants(res.data);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await API.put(`/restaurants/${editingId}`, {
        name,
        description,
      });
      setEditingId(null);
    } else {
      await API.post("/restaurants", { name, description });
    }

    setName("");
    setDescription("");
    fetchRestaurants();
  };

  const handleEdit = (restaurant) => {
    setEditingId(restaurant.id);
    setName(restaurant.name);
    setDescription(restaurant.description);
  };

  const handleDelete = async (id) => {
    await API.delete(`/restaurants/${id}`);
    fetchRestaurants();
  };

  const fetchReviews = async (restaurantId) => {
    // If already open → close it
    if (reviews[restaurantId]) {
      setReviews((prev) => {
        const updated = { ...prev };
        delete updated[restaurantId];
        return updated;
      });
      return;
    }

    // Otherwise fetch and show
    const res = await API.get(`/reviews/${restaurantId}`);
    setReviews((prev) => ({ ...prev, [restaurantId]: res.data }));
  };

  const handleReview = async (restaurantId) => {
    await API.post("/reviews", {
      restaurantId,
      rating,
      comment,
    });

    setComment("");
    setRating(5);
    fetchRestaurants();
    fetchReviews(restaurantId);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Restaurants</h2>

      <form onSubmit={handleSubmit} className="mb-8 space-y-3">
        <input
          className="w-full p-3 border rounded-lg"
          placeholder="Restaurant name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          className="w-full p-3 border rounded-lg"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {token && (
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
            {editingId ? "Update" : "Add"} Restaurant
          </button>
        )}
      </form>

      <div className="grid gap-6">
        {restaurants.map((r) => (
          <div key={r.id} className="p-6 bg-white shadow rounded-xl">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">{r.name}</h3>
                <p className="text-gray-600">{r.description}</p>
                <p className="text-yellow-500 mt-1">
                  ⭐ {r.average_rating?.toFixed(1) || "No ratings"}
                </p>
              </div>
              {userId === restaurant.user_id && (
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(r)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(r.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Review Section */}
            <div className="mt-4 border-t pt-4">
              <h4 className="font-semibold mb-2">Add Review</h4>

              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="border p-2 rounded mr-2"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    ⭐ {n}
                  </option>
                ))}
              </select>

              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="border p-2 rounded mr-2"
              />

              {token ? (
                <>
                  <input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />

                  <button onClick={() => handleReview(r.id)}>
                    Submit Review
                  </button>
                </>
              ) : (
                <p className="text-sm text-gray-500">
                  Login to leave a review
                </p>
              )}

              <button
                onClick={() => fetchReviews(r.id)}
                className="ml-2 text-sm text-indigo-600"
              >
                {reviews[r.id] ? "Hide Reviews" : "View Reviews"}
              </button>

              <div className="mt-3 space-y-2">
                {reviews[r.id]?.map((rev) => (
                  <div
                    key={rev._id}
                    className="bg-gray-100 p-3 rounded"
                  >
                    ⭐ {rev.rating}
                    <p>{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}