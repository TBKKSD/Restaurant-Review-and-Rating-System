import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";

export default function RestaurantDetail() {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchRestaurant();
    fetchReviews();
  }, []);

  const fetchRestaurant = async () => {
    const res = await API.get(`/restaurants`);
    const r = res.data.find((r) => r.id === Number(id));
    setRestaurant(r);
  };

  const fetchReviews = async () => {
    const res = await API.get(`/reviews/${id}`);
    setReviews(res.data);
  };

  if (!restaurant) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10">

      {restaurant.image && (
        <img
          src={`http://localhost:5000${restaurant.image}`}
          alt={restaurant.name}
          className="w-full h-64 object-cover rounded mb-4"
        />
      )}

      <h1 className="text-3xl font-bold">{restaurant.name}</h1>
      <p className="text-gray-600 mt-2">{restaurant.description}</p>

      <p className="mt-2 font-semibold">
        ⭐ {restaurant.average_rating?.toFixed(1) || "No rating"}
      </p>

      <h2 className="mt-8 text-xl font-bold">Reviews</h2>

      {reviews.map((r, i) => (
        <div key={i} className="border p-3 mt-2 rounded">
          <p className="font-semibold">{r.email}</p>
          <p>⭐ {r.rating}</p>
          <p>{r.comment}</p>
        </div>
      ))}

    </div>
  );
}