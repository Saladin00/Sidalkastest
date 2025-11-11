import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import API from "@/utils/api";

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const [isValid, setIsValid] = useState(true);
  const [loading, setLoading] = useState(true);

  // Gunakan sessionStorage supaya tidak berbagi antar-tab
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (!token) {
          setIsValid(false);
          return;
        }

        const res = await API.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res?.data?.user) throw new Error("Token invalid");
        setIsValid(true);
      } catch (err) {
        console.warn("⚠️ Token expired atau tidak valid:", err);
        setIsValid(false);
        sessionStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-600 animate-pulse">Memverifikasi sesi...</p>
      </div>
    );
  }

  if (!token || !isValid) return <Navigate to="/" replace />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
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
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
