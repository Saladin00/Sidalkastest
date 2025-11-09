// src/utils/api.js
import axios from "axios";

const API = axios.create({
  // 🔹 Gunakan environment variable agar fleksibel antara dev dan production
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: {
    Accept: "application/json",
  },
});

// ✅ Interceptor untuk otomatis kirim token ke semua request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
