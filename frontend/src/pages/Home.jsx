import { useEffect, useState } from "react";
import API from "../api";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await API.get("/restaurants");

        if (Array.isArray(res.data)) {
          setRestaurants(res.data);
        } else {
          setRestaurants([]);
        }
      } catch (err) {
        console.error(err);
        setError("Please login to view restaurants.");
        setRestaurants([]); // prevent crash
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div>
      <h2>Home</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {restaurants.length > 0 && (
        <ul>
          {restaurants.map((r) => (
            <li key={r.id}>{r.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}