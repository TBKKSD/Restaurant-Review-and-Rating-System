import { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";
import StarRating from "../components/StarRating";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "../components/ConfirmModal";
import { decodeToken } from "../utils/jwt";

export default function Restaurants() {
  const { token } = useAuth();
  const [currentUserId, setCurrentUserId] = useState(null);

  const [restaurants, setRestaurants] = useState([]);
  const [reviews, setReviews] = useState({});
  const [showReviews, setShowReviews] = useState({});
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [restaurantToEdit, setRestaurantToEdit] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState(null);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState({ reviewId: null, restaurantId: null });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setCurrentUserId(decoded.id);
      }
    }
  }, [token]);

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
      console.log("Fetched reviews for restaurant", restaurantId, ":", res.data);

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

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    await API.post("/restaurants", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setName("");
    setDescription("");
    setImage(null);

    fetchRestaurants();
  };

  // Triggers the Custom UI Modal
  const openDeleteModal = (id) => {
    setRestaurantToDelete(id);
    setIsModalOpen(true);
  };

  // Executes the actual deletion after confirmation
  const confirmDelete = async () => {
    setIsModalOpen(false); // Close modal first
    try {
      await API.delete(`/restaurants/${restaurantToDelete}`);
      fetchRestaurants();
      // Optional: You can replace this alert with a toast notification later
      alert("Restaurant deleted successfully.");
    } catch (err) {
      if (err.response && err.response.status === 403) {
        alert("Access Denied: You are not the owner of this restaurant.");
      } else {
        console.error(err);
        alert("An error occurred while trying to delete.");
      }
    } finally {
      setRestaurantToDelete(null);
    }
  };

  // Triggers the Edit Modal
  const openEditModal = (restaurant) => {
    setRestaurantToEdit(restaurant);
    setEditName(restaurant.name);
    setEditDescription(restaurant.description);
    setEditImage(null);
    setIsEditModalOpen(true);
  };

  // Executes the actual edit after confirmation
  const confirmEdit = async () => {
    setIsEditModalOpen(false); // Close modal first
    try {
      const formData = new FormData();
      formData.append("name", editName);
      formData.append("description", editDescription);
      if (editImage) {
        formData.append("image", editImage);
      } else {
        formData.append("image", restaurantToEdit.image || "");
      }

      await API.put(`/restaurants/${restaurantToEdit.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchRestaurants();
      alert("Restaurant updated successfully.");
    } catch (err) {
      if (err.response && err.response.status === 403) {
        alert("Access Denied: You are not the owner of this restaurant.");
      } else {
        console.error(err);
        alert("An error occurred while trying to update.");
      }
    } finally {
      setRestaurantToEdit(null);
      setEditName("");
      setEditDescription("");
      setEditImage(null);
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

  const openDeleteReviewModal = (reviewId, restaurantId) => {
    console.log("Opening delete modal for review:", reviewId, "restaurant:", restaurantId);
    setReviewToDelete({ reviewId, restaurantId });
    setIsReviewModalOpen(true);
  };

  const confirmDeleteReview = async () => {
    setIsReviewModalOpen(false);
    try {
      const reviewId = reviewToDelete.reviewId;
      console.log("Deleting review with ID:", reviewId);
      
      if (!reviewId) {
        alert("Review ID is missing");
        return;
      }
      
      await API.delete(`/reviews/${encodeURIComponent(reviewId)}`);
      fetchRestaurants();
      fetchReviews(reviewToDelete.restaurantId);
      alert("Review deleted successfully.");
    } catch (err) {
      console.error("Delete review error:", err);
      if (err.response && err.response.status === 403) {
        alert("Access Denied: You are not the owner of this review.");
      } else if (err.response && err.response.status === 404) {
        alert("Review not found.");
      } else {
        alert("An error occurred while trying to delete the review: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setReviewToDelete({ reviewId: null, restaurantId: null });
    }
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

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
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
          className="border p-4 rounded mb-4 bg-white shadow hover:shadow-lg transition-shadow"
        >
          {restaurant.image && (
            <div className="w-full bg-gray-100 rounded mb-4 flex items-center justify-center overflow-hidden" style={{ aspectRatio: '800/600' }}>
              <img
                src={`http://localhost:5000${restaurant.image}`}
                alt={restaurant.name}
                className="w-full h-full object-contain"
              />
            </div>
          )}

          <Link
            to={`/restaurants/${restaurant.id}`}
            className="text-xl font-bold text-indigo-600 hover:text-indigo-700"
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
            
            {/* EDIT */}
            {token && (
              <button
                onClick={() => openEditModal(restaurant)}
                className="text-green-600"
              >
                Edit
              </button>
            )}

            {/* DELETE */}
            {token && (
              <button
                onClick={() => openDeleteModal(restaurant.id)}
                className="text-red-600"
              >
                Delete
              </button>
            )}

            <ConfirmModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onConfirm={confirmDelete}
              title="Delete Restaurant?"
              message="This action is permanent and cannot be undone. Are you sure you want to proceed?"
            />

            <ConfirmModal
              isOpen={isReviewModalOpen}
              onClose={() => setIsReviewModalOpen(false)}
              onConfirm={confirmDeleteReview}
              title="Delete Review?"
              message="Are you sure you want to delete your review? This action cannot be undone."
            />

            {/* EDIT MODAL */}
            {isEditModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
                <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Edit Restaurant</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Restaurant Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="border p-2 rounded w-full"
                      placeholder="Enter restaurant name"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="border p-2 rounded w-full"
                      rows="3"
                      placeholder="Enter restaurant description"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setEditImage(e.target.files[0])}
                      className="border p-2 rounded w-full"
                    />
                    {restaurantToEdit?.image && (
                      <p className="text-sm text-gray-500 mt-1">Leave empty to keep current image</p>
                    )}
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setIsEditModalOpen(false);
                        setRestaurantToEdit(null);
                        setEditName("");
                        setEditDescription("");
                        setEditImage(null);
                      }}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmEdit}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                      Update Restaurant
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* REVIEWS */}
          {showReviews[restaurant.id] && (
            <div className="mt-4 border-t pt-3">

              {(reviews[restaurant.id] || []).map((r, i) => (
                <div key={i} className="border p-3 rounded mb-2 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {r.email || "User"}
                      </p>
                      <p className="text-yellow-500 font-medium">⭐ {r.rating}</p>
                      <p className="text-gray-700 mt-1">{r.comment}</p>
                    </div>
                    
                    {/* DELETE BUTTON - Only show if current user owns this review */}
                    {currentUserId && r.userId === currentUserId && (
                      <button
                        onClick={() => {
                          console.log("Review object:", r);
                          console.log("Review _id:", r._id);
                          openDeleteReviewModal(r._id, restaurant.id);
                        }}
                        className="ml-3 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition whitespace-nowrap"
                      >
                        Delete
                      </button>
                    )}
                  </div>
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