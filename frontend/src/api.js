import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:5000/api" : "/api");

const API = axios.create({
<<<<<<< HEAD
  baseURL: import.meta.env.VITE_API_URL
=======
  baseURL,
>>>>>>> f258994a7aa05217888521794377778e6777de47
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Optional: auto logout if token expired
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;