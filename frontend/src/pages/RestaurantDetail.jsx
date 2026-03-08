import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "../components/ConfirmModal";
import StarRating from "../components/StarRating";
import ImageUploader from "../components/ImageUploader";
import { decodeToken } from "../utils/jwt";

export default function RestaurantDetail() {

  const { id } = useParams();
  const { token } = useAuth();

  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [menu, setMenu] = useState([]);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const [menuForm, setMenuForm] = useState({
    name: "",
    description: "",
    price: "",
    image: null
  });

  const [currentUserId, setCurrentUserId] = useState(null);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [isDeleteRestaurantModal, setIsDeleteRestaurantModal] = useState(false);
  const [isDeleteReviewModal, setIsDeleteReviewModal] = useState(false);

  const [reviewToDelete, setReviewToDelete] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState(null);

  useEffect(() => {
    fetchRestaurant();
    fetchReviews();
    fetchMenu();
  }, []);

  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) setCurrentUserId(decoded.id);
    }
  }, [token]);

  const fetchRestaurant = async () => {
    const res = await API.get(`/restaurants/${id}`);
    setRestaurant(res.data);
  };

  const fetchReviews = async () => {
    const res = await API.get(`/reviews/${id}`);
    setReviews(res.data);
  };

  const handleReview = async () => {

    await API.post("/reviews", {
      restaurantId: id,
      rating,
      comment,
    });

    setRating(5);
    setComment("");

    fetchRestaurant();
    fetchReviews();
  };

  const fetchMenu = async () => {
    const res = await API.get(`/restaurants/${id}/menu`);
    setMenu(res.data);
  };

  const openDeleteReviewModal = (reviewId) => {
    setReviewToDelete(reviewId);
    setIsDeleteReviewModal(true);
  };

  const confirmDeleteReview = async () => {

    try {

      await API.delete(`/reviews/${reviewToDelete}`);

      fetchRestaurant();
      fetchReviews();

      alert("Review deleted successfully.");

    } catch (err) {

      if (err.response?.status === 403) {
        alert("Access Denied: You are not the owner of this review.");
      } else {
        console.error(err);
        alert("Error deleting review.");
      }

    } finally {

      setIsDeleteReviewModal(false);
      setReviewToDelete(null);

    }
  };

  const confirmDeleteRestaurant = async () => {

    try {

      await API.delete(`/restaurants/${id}`);

      alert("Restaurant deleted successfully.");
      window.location.href = "/restaurants";

    } catch (err) {

      if (err.response?.status === 403) {
        alert("Access Denied: You are not the owner.");
      } else {
        console.error(err);
        alert("Error deleting restaurant.");
      }

    }
  };

  const openEditModal = () => {

    setEditName(restaurant.name);
    setEditDescription(restaurant.description);
    setEditImage(null);

    setIsEditModalOpen(true);
  };

  const confirmEdit = async () => {

    try {

      const formData = new FormData();

      formData.append("name", editName);
      formData.append("description", editDescription);

      if (editImage) {
        formData.append("image", editImage);
      } else {
        formData.append("image", restaurant.image || "");
      }

      await API.put(`/restaurants/${restaurant.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchRestaurant();

      alert("Restaurant updated successfully.");

    } catch (err) {

      if (err.response?.status === 403) {
        alert("Access Denied: You are not the owner.");
      } else {
        console.error(err);
        alert("Error updating restaurant.");
      }

    } finally {

      setIsEditModalOpen(false);

    }
  };

  const handleAddMenu = async () => {

    const formData = new FormData();

    formData.append("name", menuForm.name);
    formData.append("description", menuForm.description);
    formData.append("price", menuForm.price);

    if (menuForm.image) {
      formData.append("image", menuForm.image);
    }

    const res = await API.post(
      `/restaurants/${id}/menu`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" }
      }
    );

    setMenu([...menu, res.data]);

    setMenuForm({
      name: "",
      description: "",
      price: "",
      image: null
    });

    setShowAddMenu(false);
  };

  if (!restaurant) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">

      {/* IMAGE */}
      {restaurant.image && (
        <img
          src={`http://localhost:5000${restaurant.image}`}
          onError={(e) => (e.target.style.display = "none")}
          alt={restaurant.name}
          className="w-full h-80 object-cover rounded-lg mb-6"
        />
      )}

      {/* HEADER */}
      <div className="flex justify-between items-start">

        <div>
          <h1 className="text-3xl font-bold">
            {restaurant.name}
          </h1>

          <p className="text-yellow-500 font-semibold mt-1">
            ⭐ {restaurant.average_rating
              ? restaurant.average_rating.toFixed(1)
              : "No rating"}
          </p>

          <p className="text-gray-600 mt-3">
            {restaurant.description}
          </p>
        </div>

        {token && (
          <div className="flex gap-3">

            <button
              onClick={openEditModal}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Edit
            </button>

            <button
              onClick={() => setIsDeleteRestaurantModal(true)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>

          </div>
        )}

      </div>

      {/* MENU */}

      <div className="mt-10">

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-xl font-bold">
            Menu
          </h2>

          {token && (
            <button
              onClick={() => setShowAddMenu(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + Add Item
            </button>
          )}

        </div>

        <div className="space-y-4">

          {menu.map((item) => (

            <div
              key={item.id}
              className="flex justify-between items-center border rounded p-4 bg-white shadow-sm"
            >

              <div className="flex-1">

                <h3 className="font-semibold text-lg">
                  {item.name}
                </h3>

                {item.description && (
                  <p className="text-gray-600 text-sm">
                    {item.description}
                  </p>
                )}

                <p className="font-medium mt-1">
                  ${item.price}
                </p>

              </div>

              {item.image_url && (
                <img
                  src={`http://localhost:5000${item.image_url}`}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}

            </div>

          ))}

        </div>

      </div>

      {/* REVIEWS */}

      <div className="mt-10">

        <h2 className="text-xl font-bold mb-4">
          Reviews
        </h2>

        {reviews.map((r) => (

          <div
            key={r._id}
            className="border p-4 rounded mb-3 bg-gray-50"
          >

            <div className="flex justify-between">

              <div>
                <p className="font-semibold">
                  {r.email || "User"}
                </p>

                <p className="text-yellow-500">
                  ⭐ {r.rating}
                </p>

                <p className="text-gray-700">
                  {r.comment}
                </p>
              </div>

              {currentUserId === r.userId && (

                <button
                  onClick={() => openDeleteReviewModal(r._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>

              )}

            </div>

          </div>

        ))}

        {token && (

          <div className="mt-6">

            <StarRating
              rating={rating}
              setRating={setRating}
            />

            <textarea
              placeholder="Write a review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border p-2 rounded w-full mt-3"
            />

            <button
              onClick={handleReview}
              className="bg-indigo-600 text-white px-4 py-2 rounded mt-3 hover:bg-indigo-700"
            >
              {(reviews || []).some((r) => r.userId === currentUserId)
                ? "Edit Review"
                : "Submit Review"}
            </button>

          </div>

        )}

      </div>

      {/* DELETE RESTAURANT MODAL */}

      <ConfirmModal
        isOpen={isDeleteRestaurantModal}
        onClose={() => setIsDeleteRestaurantModal(false)}
        onConfirm={confirmDeleteRestaurant}
        title="Delete Restaurant?"
        message="This action is permanent and cannot be undone."
      />

      {/* DELETE REVIEW MODAL */}

      <ConfirmModal
        isOpen={isDeleteReviewModal}
        onClose={() => setIsDeleteReviewModal(false)}
        onConfirm={confirmDeleteReview}
        title="Delete Review?"
        message="Are you sure you want to delete this review?"
      />

      {/* EDIT RESTAURANT MODAL */}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">

          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">

            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Edit Restaurant
            </h3>

            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="border p-2 rounded w-full mb-3"
              placeholder="Restaurant name"
            />

            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="border p-2 rounded w-full mb-4"
              rows="3"
              placeholder="Description"
            />

            {/* DRAG DROP IMAGE UPLOADER */}

            <ImageUploader
              image={editImage}
              setImage={setEditImage}
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>

              <button
                onClick={confirmEdit}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Update Restaurant
              </button>

            </div>

          </div>

        </div>
      )}

      {showAddMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">

          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">

            <h3 className="text-xl font-bold mb-4">
              Add Menu Item
            </h3>

            <input
              type="text"
              placeholder="Food name"
              className="border p-2 w-full mb-3 rounded"
              value={menuForm.name}
              onChange={(e) =>
                setMenuForm({ ...menuForm, name: e.target.value })
              }
            />

            <textarea
              placeholder="Description"
              className="border p-2 w-full mb-3 rounded"
              value={menuForm.description}
              onChange={(e) =>
                setMenuForm({ ...menuForm, description: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Price"
              className="border p-2 w-full mb-3 rounded"
              value={menuForm.price}
              onChange={(e) =>
                setMenuForm({ ...menuForm, price: e.target.value })
              }
            />

            <ImageUploader
              image={menuForm.image}
              setImage={(file) =>
                setMenuForm({ ...menuForm, image: file })
              }
            />

            <div className="flex justify-end gap-3 mt-4">

              <button
                onClick={() => setShowAddMenu(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAddMenu}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Item
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}