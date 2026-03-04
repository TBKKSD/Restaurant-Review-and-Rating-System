import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* ================================
   Attach Token Automatically
================================= */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ================================
   Auth API
================================= */

export const loginUser = async (data) => {
  const res = await API.post("/auth/login", data);

  // Save token to localStorage
  localStorage.setItem("token", res.data.token);

  return res.data;
};

export const registerUser = async (data) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};

/* ================================
   Example Protected Request
================================= */

export const getRestaurants = async () => {
  const res = await API.get("/restaurants");
  return res.data;
};

export default API;