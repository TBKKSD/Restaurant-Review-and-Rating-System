import { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";
import StarRating from "../components/StarRating";
import { useAuth } from "../context/AuthContext";

export default function Restaurants() {
  const { token } = useAuth();

  const [restaurants, setRestaurants] = useState([]);
  const [reviews, setReviews] = useState({});
  const [showReviews, setShowReviews] = useState({});
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await API.get("/restaurants");
      setRestaurants(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReviews = async (restaurantId) => {
    try {
      const res = await API.get(`/reviews/${restaurantId}`);

      setReviews((prev) => ({
        ...prev,
        [restaurantId]: res.data,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleReviews = (restaurantId) => {
    setShowReviews((prev) => ({
      ...prev,
      [restaurantId]: !prev[restaurantId],
    }));

    if (!reviews[restaurantId]) {
      fetchReviews(restaurantId);
    }
  };

  const handleCreate = async () => {
    if (!name) return;

    await API.post("/restaurants", { name, description });

    setName("");
    setDescription("");

    fetchRestaurants();
  };

  const handleDelete = async (id) => {
    // 1. Browser confirmation pop-up
    const confirmBox = window.confirm(
      "Are you sure you want to delete this restaurant?"
    );

    if (confirmBox === true) {
      try {
        await API.delete(`/restaurants/${id}`);
      
        // Refresh the list if successful
        fetchRestaurants();
        alert("Restaurant deleted successfully.");
      } catch (err) {
        // 2. Handle 'Access Denied' (403) from the backend
        if (err.response && err.response.status === 403) {
          alert("Access Denied: You are not the owner of this restaurant.");
        } else {
          console.error(err);
          alert("An error occurred while trying to delete.");
        }
     }
    }
  };


  const handleReview = async (restaurantId) => {
    await API.post("/reviews", {
      restaurantId,
      rating,
      comment,
    });

    setRating(5);
    setComment("");

    fetchRestaurants();
    fetchReviews(restaurantId);
  };

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">

      <h1 className="text-3xl font-bold mb-6">
        Restaurants
      </h1>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search restaurants..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-6"
      />

      {/* ADD RESTAURANT */}
      {token && (
        <div className="border p-4 rounded mb-8">
          <h2 className="font-semibold mb-2">
            Add Restaurant
          </h2>

          <input
            type="text"
            placeholder="Restaurant name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />

          <button
            onClick={handleCreate}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Add Restaurant
          </button>
        </div>
      )}

      {/* RESTAURANT LIST */}
      {filteredRestaurants.map((restaurant) => (
        <div
          key={restaurant.id}
          className="border p-4 rounded mb-4"
        >
          <Link
            to={`/restaurants/${restaurant.id}`}
            className="text-xl font-bold text-indigo-600"
          >
            {restaurant.name}
          </Link>

          <p className="text-gray-600">
            {restaurant.description}
          </p>

          <p className="mt-1 font-semibold">
            ⭐ {restaurant.average_rating ? restaurant.average_rating.toFixed(1) : "No rating"}
          </p>

          {/* ACTIONS */}
          <div className="flex gap-4 mt-2">

            <button
              onClick={() => toggleReviews(restaurant.id)}
              className="text-blue-600"
            >
              {showReviews[restaurant.id] ? "Hide Reviews" : "View Reviews"}
            </button>

            {token && (
              <button
                onClick={() => handleDelete(restaurant.id)}
                className="text-red-600"
              >
                Delete
              </button>
            )}
          </div>

          {/* REVIEWS */}
          {showReviews[restaurant.id] && (
            <div className="mt-4 border-t pt-3">

              {(reviews[restaurant.id] || []).map((r, i) => (
                <div key={i} className="border p-2 rounded mb-2">
                  <p className="font-semibold">
                    {r.email || "User"}
                  </p>
                  <p>⭐ {r.rating}</p>
                  <p>{r.comment}</p>
                </div>
              ))}

              {/* ADD REVIEW */}
              {token && (
                <div className="mt-3">

                  <StarRating
                    rating={rating}
                    setRating={setRating}
                  />

                  <textarea
                    placeholder="Write a review..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="border p-2 rounded w-full mt-2"
                  />

                  <button
                    onClick={() => handleReview(restaurant.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded mt-2 hover:bg-green-700"
                  >
                    Submit Review
                  </button>

                </div>
              )}

            </div>
          )}

        </div>
      ))}

    </div>
  );
}