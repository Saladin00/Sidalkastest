// src/components/LKSLayout.jsx

import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  LogOut,
  UploadCloud,
} from "lucide-react";

const LKSLayout = ({ children }) => {
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
                to="/lks"
                className={`flex items-center gap-2 p-2 rounded hover:bg-blue-100 ${
                  current === "/lks" ? "bg-blue-100 font-semibold" : ""
                }`}
              >
                <LayoutDashboard size={18} /> Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/lks/klien"
                className={`flex items-center gap-2 p-2 rounded hover:bg-blue-100 ${
                  current.includes("/lks/klien") ? "bg-blue-100 font-semibold" : ""
                }`}
              >
                <Users size={18} /> Data Klien
              </Link>
            </li>
            <li>
              <Link
                to="/lks/dokumen"
                className={`flex items-center gap-2 p-2 rounded hover:bg-blue-100 ${
                  current.includes("/lks/dokumen") ? "bg-blue-100 font-semibold" : ""
                }`}
              >
                <UploadCloud size={18} /> Dokumen Pendukung
              </Link>
            </li>
            <li>
              <Link
                to="/lks/laporan"
                className={`flex items-center gap-2 p-2 rounded hover:bg-blue-100 ${
                  current.includes("/lks/laporan") ? "bg-blue-100 font-semibold" : ""
                }`}
              >
                <FileText size={18} /> Laporan Kegiatan
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-700">Dashboard LKS</h1>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            <LogOut size={16} /> Logout
          </button>
        </header>

        {/* Content */}
        <main className="p-6 bg-gray-50 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default LKSLayout;
