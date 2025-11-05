// src/components/PetugasLayout.jsx
import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardCheck,
  MessageCircle,
  LogOut,
} from "lucide-react";

const PetugasLayout = () => {
  const location = useLocation();
  const current = location.pathname;

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md border-r border-gray-200">
        <div className="p-4 border-b text-center">
          <img src="/logo.png" alt="Logo" className="h-10 mx-auto" />
        </div>
        <nav className="p-4">
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <Link
                to="/petugas"
                className={`flex items-center gap-2 p-2 rounded hover:bg-blue-100 ${
                  current === "/petugas" ? "bg-blue-100 font-semibold" : ""
                }`}
              >
                <LayoutDashboard size={18} /> Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/petugas/verifikasi"
                className={`flex items-center gap-2 p-2 rounded hover:bg-blue-100 ${
                  current.includes("/petugas/verifikasi")
                    ? "bg-blue-100 font-semibold"
                    : ""
                }`}
              >
                <ClipboardCheck size={18} /> Verifikasi Data
              </Link>
            </li>
            <li>
              <Link
                to="/petugas/pengaduan"
                className={`flex items-center gap-2 p-2 rounded hover:bg-blue-100 ${
                  current.includes("/petugas/pengaduan")
                    ? "bg-blue-100 font-semibold"
                    : ""
                }`}
              >
                <MessageCircle size={18} /> Pengaduan
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-700">
            Dashboard Petugas
          </h1>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            <LogOut size={16} /> Logout
          </button>
        </header>

        {/* Content */}
        <main className="p-6 bg-gray-50 flex-1 overflow-y-auto">
          {/* ⬇️ Outlet ini penting untuk render halaman anak */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PetugasLayout;
