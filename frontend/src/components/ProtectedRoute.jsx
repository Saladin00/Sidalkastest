// src/components/ProtectedRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Admin bisa akses SEMUA
  if (role === "admin") {
    return children;
  }

  // Jika bukan admin, cek allowedRoles
  if (!allowedRoles.includes(role)) {
    return (
      <div className="p-10 text-red-600 font-semibold">
        🚫 Akses ditolak: Anda tidak memiliki hak untuk mengakses halaman ini.
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
