import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import API from "@/utils/api";

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const [isValid, setIsValid] = useState(true);
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  useEffect(() => {
    const verify = async () => {
      try {
        if (!token) {
          setIsValid(false);
          return;
        }

        // Ambil info user
        const res = await API.get("/profile");
        const user = res?.data?.user;
        if (!user) throw new Error("User not found");

        // Jika role LKS, ambil status terbaru langsung dari profil LKS
        if (role === "lks") {
          const res2 = await API.get("/lks/profile-view");
          const statusVer = res2?.data?.data?.status_verifikasi ?? "belum_verifikasi";

          // Simpan ke sessionStorage
          sessionStorage.setItem("status_verifikasi", statusVer);
        }

        setIsValid(true);
      } catch (err) {
        console.warn("Token invalid:", err);
        setIsValid(false);
        sessionStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    verify();
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
