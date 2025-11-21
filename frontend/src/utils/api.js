// src/utils/api.js
import axios from "axios";
import { showError } from "./toast";

const API = axios.create({
  // 🔹 Gunakan environment variable agar fleksibel antara dev dan production
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ penting untuk Sanctum dan cookie-based auth
});

// ✅ Interceptor untuk otomatis kirim Bearer token dari sessionStorage
API.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token"); // 🔹 ambil token dari sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor untuk menangani token expired secara global
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Terjadi kesalahan server.";
    showError(message);
    return Promise.reject(error);
  }
);

export default API;
