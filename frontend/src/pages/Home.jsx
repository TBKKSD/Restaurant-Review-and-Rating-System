import { Link } from "react-router-dom";

export default function Home() {
  const token = localStorage.getItem("token");
  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Discover & Review Restaurants
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          Share your dining experiences, rate restaurants, and help others
          discover the best places to eat.
        </p>
        <div className="flex justify-center gap-6">
          <Link
            to="/restaurants"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Browse Restaurants
          </Link>

          {!token && (
            <Link
              to="/register"
              className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition"
            >
              Join Now
            </Link>
          )}
        </div>
      </section>


      {/* FEATURES */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">

          <div className="text-center">
            <div className="text-4xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold mb-2">
              Explore Restaurants
            </h3>
            <p className="text-gray-600">
              Discover restaurants shared by the community.
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold mb-2">
              Rate & Review
            </h3>
            <p className="text-gray-600">
              Leave ratings and comments to share your experience.
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-semibold mb-2">
              Community Driven
            </h3>
            <p className="text-gray-600">
              Help others find the best places to eat.
            </p>
          </div>

        </div>
      </section>


      {/* CALL TO ACTION */}
      <section className="bg-indigo-600 text-white py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Start reviewing restaurants today
        </h2>

        {!token ? (
          <Link
            to="/register"
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Create Account
          </Link>
        ) : (
          <Link
            to="/restaurants"
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            View Restaurants
          </Link>
        )}
      </section>

    </div>
  );
}