import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const isRestaurantsPage = location.pathname === "/restaurants";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="flex justify-between items-center">

        {/* Left Side */}
        <div className="flex items-center space-x-8">

          <Link
            to="/"
            className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition"
          >
            🍽 Restaurant App
          </Link>

          <Link
            to="/restaurants"
            className="text-gray-700 font-medium hover:text-indigo-600 transition"
          >
            Restaurants
          </Link>

          {token && !isRestaurantsPage && (
            <Link
              to="/add-restaurant"
              className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-indigo-100 transition"
            >
              + Add Restaurant
            </Link>
          )}

        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">

          {token ? (
            <button
              onClick={handleLogout}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 font-medium hover:text-indigo-600 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Register
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}