import { useEffect, useState } from "react";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/restaurants")
      .then((res) => res.json())
      .then(setRestaurants);
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {restaurants.map((r) => (
        <div key={r.id} className="bg-white p-4 rounded shadow">
          <h2 className="font-bold text-lg">{r.name}</h2>
          <p>{r.description}</p>
        </div>
      ))}
    </div>
  );
}