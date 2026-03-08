import { useNavigate } from "react-router-dom";

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();

  const imageUrl = restaurant.image
    ? `http://localhost:5000${restaurant.image}`
    : null;

  const rating = restaurant.average_rating
    ? Number(restaurant.average_rating).toFixed(1)
    : null;

  const cuisineIcons = {
    Japanese: "🍣",
    Italian: "🍝",
    Thai: "🍜",
    Chinese: "🥡",
    American: "🍔",
    Mexican: "🌮",
    Indian: "🍛",
    Korean: "🥢",
    Vietnamese: "🍲",
    Other: "🍽"
  };

  const cuisineStyles = {
    Japanese: "bg-red-100 text-red-700",
    Italian: "bg-green-100 text-green-700",
    Thai: "bg-yellow-100 text-yellow-700",
    Chinese: "bg-orange-100 text-orange-700",
    American: "bg-blue-100 text-blue-700",
    Mexican: "bg-lime-100 text-lime-700",
    Indian: "bg-purple-100 text-purple-700",
    Korean: "bg-pink-100 text-pink-700",
    Vietnamese: "bg-teal-100 text-teal-700",
    Other: "bg-gray-100 text-gray-700"
  };

  return (
    <div
      onClick={() => navigate(`/restaurants/${restaurant.id}`)}
      className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer transition transform hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden">

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={restaurant.name}
            onError={(e) => (e.target.style.display = "none")}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
            No Image
          </div>
        )}

        {/* Rating badge */}
        {rating && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-gray-800 text-sm font-semibold px-2 py-1 rounded-lg shadow">
            ⭐ {rating}
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

        {/* Restaurant name */}
        <h2 className="absolute bottom-3 left-3 text-white text-lg font-semibold">
          {restaurant.name}
        </h2>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <p className="text-gray-600 text-sm">
          {restaurant.description || "No description available"}
        </p>
        <span
          className={`mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${cuisineStyles[restaurant.cuisine] || cuisineStyles.Other}`}
        >
          {cuisineIcons[restaurant.cuisine] || "🍽"} {restaurant.cuisine || "Other"}
        </span>
      </div>
    </div>
  );
};

export default RestaurantCard;