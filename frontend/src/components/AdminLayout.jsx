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
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const current = location.pathname;

  const [isCollapsed, setIsCollapsed] = useState(false);

  const [openModules, setOpenModules] = useState({
    lks: true,
    petugas: true,
    operator: true,
    klien: true,
  });

  // === HELPER PAGE META (ditambahkan di sini) ===
  const getPageMeta = (path) => {
    if (path === "/admin") {
      return {
        breadcrumb: ["Dashboard"],
        title: "Dashboard Admin",
      };
    }

    if (path.startsWith("/admin/lks")) {
      return {
        breadcrumb: ["LKS", "Manajemen LKS"],
        title: "Manajemen LKS",
      };
    }

    if (path.startsWith("/lks/dokumen")) {
      return {
        breadcrumb: ["LKS", "Dokumen Pendukung"],
        title: "Dokumen Pendukung",
      };
    }

    if (path.startsWith("/lks/laporan")) {
      return {
        breadcrumb: ["LKS", "Laporan Kegiatan"],
        title: "Laporan Kegiatan",
      };
    }

    if (path.startsWith("/admin/klien")) {
      return {
        breadcrumb: ["Klien", "Data Klien"],
        title: "Data Klien",
      };
    }

    if (path.startsWith("/admin/verifikasi")) {
      return {
        breadcrumb: ["Petugas", "Verifikasi Data"],
        title: "Verifikasi Data",
      };
    }

    if (path.startsWith("/operator/sebaran")) {
      return {
        breadcrumb: ["Operator", "Sebaran Sosial"],
        title: "Sebaran Sosial",
      };
    }

    if (path.startsWith("/admin/users")) {
      return {
        breadcrumb: ["Manajemen Pengguna", "Daftar Pengguna"],
        title: "Manajemen Pengguna",
      };
    }

    // fallback
    return {
      breadcrumb: ["Dashboard"],
      title: "Dashboard Admin",
    };
  };

  const pageMeta = getPageMeta(current);
  // === END HELPER PAGE META ===

  const toggleModule = (mod) => {
    setOpenModules((prev) => ({ ...prev, [mod]: !prev[mod] }));
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* SIDEBAR */}
      <aside
        className={`relative flex flex-col bg-sky-900 text-sky-50 border-r border-sky-800 shadow-lg transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-72"
        }`}
      >
        {/* Toggle sidebar */}
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="
            absolute right-0 top-8
            z-30
            w-7 h-7
            translate-x-1/2
            rounded-full
            bg-white/95
            border border-sky-300
            flex items-center justify-center
            text-sky-700
            shadow-md
            hover:bg-sky-50 hover:border-sky-400
            transition
          "
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Logo + title */}
        <div className="flex items-center gap-3 px-7 py-5 border-b border-sky-800">
          <div className="flex items-center justify-center w-15 h-11 rounded-full">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-20 w-10 object-contain"
            />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-semibold tracking-[0.2em] text-emerald-200 uppercase">
                SIDALEKAS
              </span>
              <span className="text-[13px] font-semibold tracking-[0.1em] text-sky-50/90 mt-1">
                Panel Admin
              </span>
            </div>
          )}
        </div>

        {/* MENU */}
        <nav className="flex-1 px-3 py-4 text-sm overflow-y-auto">
          {!isCollapsed && (
            <p className="px-2 mb-2 text-[11px] tracking-wide uppercase text-sky-200">
              Menu Utama
            </p>
          )}

          <ul className="space-y-1">
            {/* Dashboard */}
            <li>
              <Link
                to="/admin"
                className={`group relative flex items-center gap-3 rounded-xl py-2 transition-all ${
                  isCollapsed ? "justify-center px-0" : "px-3"
                } ${
                  current === "/admin"
                    ? "bg-sky-800 text-white shadow-sm"
                    : "text-sky-100 hover:bg-sky-800/80 hover:text-white"
                }`}
              >
                {current === "/admin" && !isCollapsed && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-full bg-emerald-400" />
                )}
                <LayoutDashboard
                  size={18}
                  className={
                    current === "/admin"
                      ? "text-white"
                      : "text-sky-200 group-hover:text-white"
                  }
                />
                {!isCollapsed && <span>Dashboard</span>}
              </Link>
            </li>

            {/* ==== LKS (sekarang berisi juga Manajemen LKS) ==== */}
            <li>
              {/* Header LKS */}
              <button
                onClick={() => toggleModule("lks")}
                className={`flex items-center gap-3 rounded-xl py-2 w-full transition-all ${
                  isCollapsed
                    ? "justify-center px-0"
                    : "px-3 text-sky-100 hover:bg-sky-800/40"
                }`}
              >
                <Building2 size={18} className="text-sky-200" />
                {!isCollapsed && (
                  <>
                    <span>LKS</span>
                    {openModules.lks ? (
                      <Minus size={14} className="ml-auto text-sky-200" />
                    ) : (
                      <Plus size={14} className="ml-auto text-sky-200" />
                    )}
                  </>
                )}
              </button>

              {/* Submenu LKS */}
              {!isCollapsed && openModules.lks && (
                <ul className="ml-7 mt-1 space-y-1 border-l border-sky-700/60 pl-3">
                  {/* Manajemen LKS dipindah ke sini */}
                  <li>
                    <Link
                      to="/admin/lks"
                      className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${
                        current.includes("/admin/lks")
                          ? "bg-sky-800 text-white"
                          : "text-sky-100 hover:bg-sky-800/70 hover:text-white"
                      }`}
                    >
                      {current.includes("/admin/lks") && (
                        <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-400" />
                      )}
                      <Building2 size={17} /> Manajemen LKS
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/lks/dokumen"
                      className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${
                        current.includes("/lks/dokumen")
                          ? "bg-sky-800 text-white"
                          : "text-sky-100 hover:bg-sky-800/70 hover:text-white"
                      }`}
                    >
                      {current.includes("/lks/dokumen") && (
                        <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-400" />
                      )}
                      <FolderKanban size={17} /> Dokumen Pendukung
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/lks/laporan"
                      className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${
                        current.includes("/lks/laporan")
                          ? "bg-sky-800 text-white"
                          : "text-sky-100 hover:bg-sky-800/70 hover:text-white"
                      }`}
                    >
                      {current.includes("/lks/laporan") && (
                        <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-400" />
                      )}
                      <FileText size={17} /> Laporan Kegiatan
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* ==== Klien ==== */}
            <li>
              <button
                onClick={() => toggleModule("klien")}
                className={`flex items-center gap-3 rounded-xl py-2 w-full transition-all ${
                  isCollapsed
                    ? "justify-center px-0"
                    : "px-3 text-sky-100 hover:bg-sky-800/40"
                }`}
              >
                <Users size={18} className="text-sky-200" />
                {!isCollapsed && (
                  <>
                    <span>Klien</span>
                    {openModules.klien ? (
                      <Minus size={14} className="ml-auto text-sky-200" />
                    ) : (
                      <Plus size={14} className="ml-auto text-sky-200" />
                    )}
                  </>
                )}
              </button>

              {!isCollapsed && openModules.klien && (
                <ul className="ml-7 mt-1 space-y-1 border-l border-sky-700/60 pl-3">
                  <li>
                    <Link
                      to="/admin/klien"
                      className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${
                        current.includes("/admin/klien")
                          ? "bg-sky-800 text-white"
                          : "text-sky-100 hover:bg-sky-800/70 hover:text-white"
                      }`}
                    >
                      {current.includes("/admin/klien") && (
                        <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-400" />
                      )}
                      <Users size={17} /> Data Klien
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* ==== Petugas ==== */}
            <li>
              <button
                onClick={() => toggleModule("petugas")}
                className={`flex items-center gap-3 rounded-xl py-2 w-full transition-all ${
                  isCollapsed
                    ? "justify-center px-0"
                    : "px-3 text-sky-100 hover:bg-sky-800/40"
                }`}
              >
                <ShieldCheck size={18} className="text-sky-200" />
                {!isCollapsed && (
                  <>
                    <span>Petugas</span>
                    {openModules.petugas ? (
                      <Minus size={14} className="ml-auto text-sky-200" />
                    ) : (
                      <Plus size={14} className="ml-auto text-sky-200" />
                    )}
                  </>
                )}
              </button>

              {!isCollapsed && openModules.petugas && (
                <ul className="ml-7 mt-1 space-y-1 border-l border-sky-700/60 pl-3">
                  {/* Submenu Verifikasi Data */}
                  <li>
                    <Link
                      to="/admin/verifikasi"
                      className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${
                        current.startsWith("/admin/verifikasi")
                          ? "bg-sky-800 text-white"
                          : "text-sky-100 hover:bg-sky-800/70 hover:text-white"
                      }`}
                    >
                      {current.startsWith("/admin/verifikasi") && (
                        <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-400" />
                      )}
                      <ShieldCheck size={17} /> Verifikasi Data
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* ==== Operator ==== */}
            <li>
              <button
                onClick={() => toggleModule("operator")}
                className={`flex items-center gap-3 rounded-xl py-2 w-full transition-all ${
                  isCollapsed
                    ? "justify-center px-0"
                    : "px-3 text-sky-100 hover:bg-sky-800/40"
                }`}
              >
                <BarChart3 size={18} className="text-sky-200" />
                {!isCollapsed && (
                  <>
                    <span>Operator</span>
                    {openModules.operator ? (
                      <Minus size={14} className="ml-auto text-sky-200" />
                    ) : (
                      <Plus size={14} className="ml-auto text-sky-200" />
                    )}
                  </>
                )}
              </button>

              {!isCollapsed && openModules.operator && (
                <ul className="ml-7 mt-1 space-y-1 border-l border-sky-700/60 pl-3">
                  <li>
                    <Link
                      to="/operator/sebaran"
                      className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${
                        current.includes("/operator/sebaran")
                          ? "bg-sky-800 text-white"
                          : "text-sky-100 hover:bg-sky-800/70 hover:text-white"
                      }`}
                    >
                      {current.includes("/operator/sebaran") && (
                        <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-400" />
                      )}
                      <BarChart3 size={17} /> Sebaran Sosial
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Manajemen Pengguna */}
            <li className="pt-3 mt-3 border-t border-sky-800/60">
              <Link
                to="/admin/users"
                className={`group relative flex items-center gap-3 rounded-xl py-2 transition-all ${
                  isCollapsed ? "justify-center px-0" : "px-3"
                } ${
                  current.includes("/admin/users")
                    ? "bg-sky-800 text-white shadow-sm"
                    : "text-sky-100 hover:bg-sky-800/80 hover:text-white"
                }`}
              >
                {current.includes("/admin/users") && !isCollapsed && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-full bg-emerald-400" />
                )}
                <UserCog
                  size={18}
                  className={
                    current.includes("/admin/users")
                      ? "text-white"
                      : "text-sky-200 group-hover:text-white"
                  }
                />
                {!isCollapsed && <span>Manajemen Pengguna</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout */}
        <div className="border-t border-sky-800 px-3 py-3 bg-sky-900/90">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-500 px-3 py-2 text-xs font-medium text-white shadow hover:bg-red-600 transition-colors"
          >
            <LogOut size={16} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* Top bar / navbar */}
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-100">
          <div className="pr-3 py-2 pl-10 flex items-center justify-between">
            {/* Kiri: judul sistem + breadcrumb + title halaman */}
            <div className="space-y-1">
              {/* Judul sistem */}
              <p className="text-[11px] font-semibold tracking-[0.18em] text-emerald-600 uppercase">
                Sistem Informasi Data Lembaga Kesejahteraan Sosial
              </p>

              {/* Breadcrumb */}
              <div className="mt-1 flex items-center gap-1 text-xs md:text-sm text-slate-500">
                {pageMeta.breadcrumb.map((item, idx) => (
                  <span key={idx} className="flex items-center gap-1">
                    {idx > 0 && <span className="text-slate-400">›</span>}
                    <span
                      className={
                        idx === pageMeta.breadcrumb.length - 1
                          ? "font-semibold text-sky-800"
                          : "text-slate-500"
                      }
                    >
                      {item}
                    </span>
                  </span>
                ))}
              </div>

              {/* Title halaman saja (tanpa subtitle) */}
              <h1 className="text-lg md:text-xl font-semibold text-sky-900 mt-0.5">
                {pageMeta.title}
              </h1>
            </div>

            {/* Kanan: info role / user (tanpa logout) */}
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-[11px] text-slate-400">Peran aktif</p>
                <p className="text-sm font-medium text-slate-700">
                  Administrator
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 text-xs font-semibold">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Konten */}
        <main className="p-6 bg-slate-50 flex-1 overflow-y-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
