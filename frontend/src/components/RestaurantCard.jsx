import React from "react";
import { useNavigate } from "react-router-dom";

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();

  const imageUrl = restaurant.image
    ? `http://localhost:5000${restaurant.image}`
    : null;

  return (
    <div
      onClick={() => navigate(`/restaurants/${restaurant.id}`)}
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
        background: "white",
        cursor: "pointer",
        transition: "transform 0.15s ease, box-shadow 0.15s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.02)";
        e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.08)";
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={restaurant.name}
          onError={(e) => {
            e.target.style.display = "none";
          }}
          style={{
            width: "100%",
            height: "180px",
            objectFit: "cover"
          }}
        />
      ) : (
        <div
          style={{
            height: "180px",
            background: "#eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#777",
            fontSize: "14px"
          }}
        >
          No Image
        </div>
      )}

      <div style={{ padding: "15px" }}>
        <h2 style={{ marginBottom: "8px" }}>
          {restaurant.name}
        </h2>

        <p style={{ color: "#666", fontSize: "14px" }}>
          {restaurant.description || "No description available"}
        </p>

        <p style={{ marginTop: "10px", fontWeight: "bold" }}>
          ⭐ {restaurant.average_rating || "No ratings yet"}
        </p>
      </div>
    </div>
  );
};

export default RestaurantCard;