import { useEffect, useState } from "react";
import axios from "axios";
import RestaurantCard from "../components/RestaurantCard";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [sortOption, setSortOption] = useState("rating");

  const { token } = useAuth();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/restaurants"
        );

        setRestaurants(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-40 bg-gray-200"></div>
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );

  const cuisines = [
    "All",
    "Japanese",
    "Italian",
    "Thai",
    "Chinese",
    "American",
    "Mexican",
    "Indian",
    "Korean",
    "Vietnamese",
    "Other"
  ];

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchesCuisine =
      selectedCuisine === "All" || r.cuisine === selectedCuisine;

    return matchesSearch && matchesCuisine;
  });

  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    if (sortOption === "rating") {
      return (b.rating || 0) - (a.rating || 0);
    }

    if (sortOption === "name") {
      return a.name.localeCompare(b.name);
    }

    if (sortOption === "newest") {
      return b.id - a.id; // assumes higher id = newer
    }

    return 0;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold text-gray-800">
          Restaurants List 📖
        </h1>

        {token && (
          <Link
            to="/add-restaurant"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            + Add Restaurant
          </Link>
        )}

      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search restaurants..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="flex flex-wrap gap-2 mb-6 border-b pb-4">
        {cuisines.map((cuisine) => (
          <button
            key={cuisine}
            onClick={() => setSelectedCuisine(cuisine)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition
              ${
                selectedCuisine === cuisine
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
          >
            {cuisine}
          </button>
        ))}
      </div>

      <div className="flex justify-end mb-4">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border rounded-md px-3 py-1 text-sm bg-white shadow-sm"
        >
          <option value="rating">⭐ Top Rated</option>
          <option value="name">🔤 Name (A-Z)</option>
          <option value="newest">🆕 Newest</option>
        </select>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredRestaurants.length === 0 && (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold text-gray-700">
            No restaurants found 🍽
          </h2>

          <p className="text-gray-500 mt-2">
            Try a different search or add a new restaurant.
          </p>
        </div>
      )}

      {/* Restaurant Grid */}
      {!loading && filteredRestaurants.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6">
          {sortedRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
            />
          ))}
        </div>
      )}

    </div>
  );
}