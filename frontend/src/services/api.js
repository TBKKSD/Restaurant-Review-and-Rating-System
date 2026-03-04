const API = "http://localhost:5000/api";

export const getRestaurants = async () => {
  const res = await fetch(`${API}/restaurants`);
  return res.json();
};

export const createRestaurant = async (data) => {
  await fetch(`${API}/restaurants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
};

export const getReviews = async (id) => {
  const res = await fetch(`${API}/restaurants/${id}/reviews`);
  return res.json();
};

export const addReview = async (data) => {
  await fetch(`${API}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
};