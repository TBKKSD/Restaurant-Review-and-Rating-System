import { useEffect, useState } from "react";
import {
  getRestaurants,
  createRestaurant,
  getReviews,
  addReview
} from "./services/api";

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    const data = await getRestaurants();
    setRestaurants(data);
  };

  const handleCreate = async () => {
    await createRestaurant({
      name: "Test Restaurant",
      description: "Demo description"
    });
    loadRestaurants();
  };

  const loadReviews = async (id) => {
    setSelected(id);
    const data = await getReviews(id);
    setReviews(data);
  };

  const handleReview = async () => {
    await addReview({
      restaurant_id: selected,
      rating: 5,
      comment: "Great!"
    });
    loadReviews(selected);
  };

  return (
    <div>
      <h1>RRRS</h1>

      <button onClick={handleCreate}>Add Test Restaurant</button>

      <ul>
        {restaurants.map((r) => (
          <li key={r.id}>
            {r.name}
            <button onClick={() => loadReviews(r.id)}>View Reviews</button>
          </li>
        ))}
      </ul>

      {selected && (
        <div>
          <h2>Reviews</h2>
          <button onClick={handleReview}>Add 5★ Review</button>
          <ul>
            {reviews.map((rev) => (
              <li key={rev.id}>
                {rev.rating}★ - {rev.comment}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;