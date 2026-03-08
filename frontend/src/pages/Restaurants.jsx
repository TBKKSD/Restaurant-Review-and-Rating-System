import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RestaurantCard from "../components/RestaurantCard";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/restaurants");

      if (Array.isArray(res.data)) {
        setRestaurants(res.data);
      } else if (Array.isArray(res.data.restaurants)) {
        setRestaurants(res.data.restaurants);
      } else {
        setRestaurants([]);
      }

      setLoading(false);

    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  if (loading) {
    return <h2 style={{ padding: "30px" }}>Loading restaurants...</h2>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <div
        style={{
          marginBottom: "30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "32px" }}>
            🍽️ Discover Restaurants
          </h1>
          <p style={{ margin: "5px 0 0", color: "#666" }}>
            Browse and review great places to eat
          </p>
        </div>

        <button
          onClick={() => navigate("/add-restaurant")}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            background: "#4CAF50",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          + Add Restaurant
        </button>
      </div>

      {restaurants.length === 0 && (
        <p>No restaurants found.</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px"
        }}
      >
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
          />
        ))}
      </div>
    </div>
  );
};

export default Restaurants;