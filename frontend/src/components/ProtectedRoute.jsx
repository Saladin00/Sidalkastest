// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // ⛔ Belum login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // ✅ Kalau allowedRoles dikosongkan: artinya cukup login saja
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Role tidak diizinkan
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-2">
            Akses Ditolak
          </h1>
          <p className="text-gray-600">
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  // ✅ Lolos semua pengecekan → render konten
  return children || <Outlet />;
};

export default ProtectedRoute;
