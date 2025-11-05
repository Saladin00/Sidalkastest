// src/utils/api.js
import axios from "axios";

/**
 * Axios instance untuk komunikasi antara frontend (Vite React)
 * dengan backend Laravel.
 * Base URL diambil dari .env frontend (VITE_API_URL).
 */
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  withCredentials: true, // penting untuk Sanctum / sesi
});

// Tambahkan interceptor untuk otomatis kirim token Bearer
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
