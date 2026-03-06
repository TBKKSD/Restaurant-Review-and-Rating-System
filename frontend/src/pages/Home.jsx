import { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await API.get("/restaurants");

      const sorted = res.data
        .sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
        .slice(0, 5);

      setRestaurants(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">

      <h1 className="text-4xl font-bold mb-6 text-center">
        🍽 Restaurant Review System
      </h1>

      <p className="text-gray-600 text-center mb-10">
        Discover restaurants and read reviews from the community
      </p>

      <h2 className="text-2xl font-semibold mb-4">
        🔥 Top Rated Restaurants
      </h2>

      {restaurants.length === 0 && (
        <p className="text-gray-500">No restaurants yet.</p>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {restaurants.map((r) => (
          <Link
            key={r.id}
            to={`/restaurants/${r.id}`}
            className="border p-4 rounded-lg hover:bg-gray-50 transition"
          >
            <h3 className="text-lg font-bold text-indigo-600">
              {r.name}
            </h3>

            <p className="text-gray-600 mt-1">
              {r.description}
            </p>

            <p className="mt-2 font-semibold">
              ⭐ {r.average_rating ? r.average_rating.toFixed(1) : "No rating"}
            </p>
          </Link>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link
          to="/restaurants"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Browse All Restaurants
        </Link>
      </div>

    </div>
  );
}