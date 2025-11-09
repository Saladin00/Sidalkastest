import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  ShieldCheck,
  BarChart3,
  UserCog,
  FolderKanban,
  FileText,
  LogOut,
  Folder,
  ChevronDown,
} from "lucide-react";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const current = location.pathname;

  // 🟩 State buka/tutup sub-menu
  const [openModules, setOpenModules] = useState({
    lks: true,
    petugas: true,
    operator: true,
    klien: true, // ✅ Modul Klien aktif default
  });

  const toggleModule = (mod) => {
    setOpenModules((prev) => ({ ...prev, [mod]: !prev[mod] }));
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white shadow-md border-r border-gray-200">
        {/* 🟩 Header Sidebar */}
        <div className="p-4 border-b text-center">
          <img src="/logo.png" alt="Logo" className="h-10 mx-auto" />
        </div>

        {/* 🟩 Menu Navigasi */}
        <nav className="p-4 text-sm text-gray-700">
          <ul className="space-y-1">
            {/* ===== Dashboard ===== */}
            <li>
              <Link
                to="/admin"
                className={`flex items-center gap-2 p-2 rounded hover:bg-blue-100 ${
                  current === "/admin" ? "bg-blue-100 font-semibold" : ""
                }`}
              >
                <LayoutDashboard size={18} /> Dashboard
              </Link>
            </li>

            {/* ===== Manajemen LKS ===== */}
            <li>
              <Link
                to="/admin/lks"
                className={`flex items-center gap-2 p-2 rounded hover:bg-blue-100 ${
                  current.includes("/admin/lks")
                    ? "bg-blue-100 font-semibold"
                    : ""
                }`}
              >
                <Building2 size={18} /> Manajemen LKS
              </Link>
            </li>

            {/* ================= Modul LKS ================= */}
            <li>
              <button
                onClick={() => toggleModule("lks")}
                className="flex items-center gap-2 p-2 w-full rounded hover:bg-gray-100"
              >
                <Folder size={18} /> Modul LKS
                <ChevronDown
                  size={14}
                  className={`ml-auto transform transition ${
                    openModules.lks ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {openModules.lks && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li>
                    <Link
                      to="/lks/dokumen"
                      className={`flex items-center gap-2 p-2 rounded hover:bg-blue-100 ${
                        current.includes("/lks/dokumen")
                          ? "bg-blue-100 font-semibold"
                          : ""
                      }`}
                    >
                      <FolderKanban size={16} /> Dokumen Pendukung
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/lks/laporan"
                      className={`flex items-center gap-2 p-2 rounded hover:bg-blue-100 ${
                        current.includes("/lks/laporan")
                          ? "bg-blue-100 font-semibold"
                          : ""
                      }`}
                    >
                      <FileText size={16} /> Laporan Kegiatan
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* ================= Modul Klien (BARU) ================= */}
            <li>
              <button
                onClick={() => toggleModule("klien")}
                className="flex items-center gap-2 p-2 w-full rounded hover:bg-gray-100"
              >
                <Folder size={18} /> Modul Klien
                <ChevronDown
                  size={14}
                  className={`ml-auto transform transition ${
                    openModules.klien ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {openModules.klien && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li>
                    <Link
                      to="/admin/klien" // ✅ arahkan ke route klien list
                      className={`flex items-center gap-2 p-2 rounded hover:bg-blue-100 ${
                        current.includes("/admin/klien")
                          ? "bg-blue-100 font-semibold"
                          : ""
                      }`}
                    >
                      <Users size={16} /> Data Klien
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* ================= Modul Petugas ================= */}
            <li>
              <button
                onClick={() => toggleModule("petugas")}
                className="flex items-center gap-2 p-2 w-full rounded hover:bg-gray-100"
              >
                <Folder size={18} /> Modul Petugas
                <ChevronDown
                  size={14}
                  className={`ml-auto transform transition ${
                    openModules.petugas ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {openModules.petugas && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li>
                    <Link
                      to="/admin/verifikasi"
                      className={`flex items-center gap-2 p-2 rounded hover:bg-blue-100 ${
                        current.includes("/admin/verifikasi")
                          ? "bg-blue-100 font-semibold"
                          : ""
                      }`}
                    >
                      <ShieldCheck size={16} /> Verifikasi Data
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* ================= Modul Operator ================= */}
            <li>
              <button
                onClick={() => toggleModule("operator")}
                className="flex items-center gap-2 p-2 w-full rounded hover:bg-gray-100"
              >
                <Folder size={18} /> Modul Operator
                <ChevronDown
                  size={14}
                  className={`ml-auto transform transition ${
                    openModules.operator ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {openModules.operator && (
                <ul className="ml-4 space-y-1 mt-1">
                  <li>
                    <Link
                      to="/operator/sebaran"
                      className={`flex items-center gap-2 p-2 rounded hover:bg-blue-100 ${
                        current.includes("/operator/sebaran")
                          ? "bg-blue-100 font-semibold"
                          : ""
                      }`}
                    >
                      <BarChart3 size={16} /> Sebaran Sosial
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* ================= Manajemen Pengguna ================= */}
            <li className="pt-2 border-t border-gray-200 mt-2">
              <Link
                to="/admin/users"
                className={`flex items-center gap-2 p-2 rounded hover:bg-blue-100 ${
                  current.includes("/admin/users")
                    ? "bg-blue-100 font-semibold"
                    : ""
                }`}
              >
                <UserCog size={18} /> Manajemen Pengguna
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col">
        {/* 🟩 Header Atas */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-700">
            Dashboard Admin
          </h1>

          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            <LogOut size={16} /> Logout
          </button>
        </header>

        {/* 🟩 Konten halaman dinamis */}
        <main className="p-6 bg-gray-50 flex-1 overflow-y-auto">
          
          {/* ✅ FIX: Outlet agar route admin/verifikasi tampil */}
          {children || <Outlet />}
        
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
