import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  Users,
  ShieldCheck,
} from "lucide-react";

const LKSLayout = ({ children }) => {
  const location = useLocation();
  const current = location.pathname;
  const [isCollapsed, setIsCollapsed] = useState(false);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // ==== NAV ITEMS ====
  const navItems = [
    { label: "Dashboard", to: "/lks", icon: LayoutDashboard, exact: true },
    { label: "Data Klien", to: "/lks/klien", icon: Users },
    { label: "Dokumen Pendukung", to: "/lks/dokumen", icon: UploadCloud },
    { label: "Laporan Kegiatan", to: "/lks/laporan", icon: FileText },

    // 🆕 Tambahan baru:
    { label: "Status Verifikasi", to: "/lks/verifikasi", icon: ShieldCheck },

    { label: "Profil Saya", to: "/lks/profile", icon: User },
  ];

  const isActive = (path, exact = false) =>
    exact ? current === path : current.startsWith(path);

  // ==== HELPER PAGE META (khusus LKS) ====
  const getPageMeta = (path) => {
    if (path === "/lks") {
      return {
        breadcrumb: ["Dashboard"],
        title: "Dashboard LKS",
      };
    }

    if (path.startsWith("/lks/klien")) {
      return {
        breadcrumb: ["LKS", "Data Klien"],
        title: "Data Klien",
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

    if (path.startsWith("/lks/verifikasi")) {
      return {
        breadcrumb: ["LKS", "Status Verifikasi"],
        title: "Status Verifikasi LKS",
      };
    }

    if (path.startsWith("/lks/profile")) {
      return {
        breadcrumb: ["LKS", "Profil"],
        title: "Profil Akun",
      };
    }

    // fallback
    return {
      breadcrumb: ["Dashboard"],
      title: "Dashboard LKS",
    };
  };

  const pageMeta = getPageMeta(current);

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside
        className={`relative flex flex-col bg-sky-900 text-sky-50 border-r border-sky-800 shadow-lg transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Toggle (versi rapi, sama seperti admin) */}
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

        {/* Logo */}
        <div className="flex items-center gap-3 px-7 py-5 border-b border-sky-800">
          <div className="flex items-center justify-center w-15 h-11 rounded-full">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-10 w-10 object-contain"
            />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-[11px] tracking-[0.25em] text-emerald-200 uppercase">
                SIDALEKAS
              </span>
              <span className="text-sm tracking-[0.18em] font-semibold text-sky-50">
                Panel LKS
              </span>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
          {!isCollapsed && (
            <p className="px-2 text-[11px] tracking-wide uppercase text-sky-200">
              Menu LKS
            </p>
          )}
          <ul className="space-y-1 text-sm">
            {navItems.map(({ label, to, icon: Icon, exact }) => {
              const active = isActive(to, exact);
              return (
                <li key={to}>
                  <Link
                    to={to}
                    className={`group relative flex items-center gap-3 rounded-xl px-3 py-2 transition-all ${
                      active
                        ? "bg-sky-800 text-white shadow-sm"
                        : "text-sky-100 hover:bg-sky-800/80 hover:text-white"
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-full bg-emerald-400" />
                    )}
                    <Icon
                      size={18}
                      className={
                        active
                          ? "text-white"
                          : "text-sky-200 group-hover:text-white"
                      }
                    />
                    {!isCollapsed && <span>{label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout bawah */}
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
        {/* Top bar / navbar – sama gaya dengan Admin */}
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-100">
          <div className="pr-3 py-2 pl-10 flex items-center justify-between">
            {/* Kiri: judul sistem + breadcrumb + title halaman */}
            <div className="space-y-1">
              {/* Judul sistem */}
              <p className="text-[11px] font-semibold tracking-[0.18em] text-emerald-600 uppercase">
                Sistem Informasi Data Lembaga Kesejahteraan Sosial
              </p>

              {/* Breadcrumb */}
              <div className="flex items-center gap-1 text-xs md:text-sm text-slate-500">
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

              {/* Title halaman */}
              <h1 className="text-lg md:text-xl font-semibold text-sky-900">
                {pageMeta.title}
              </h1>
            </div>

            {/* Kanan: info role / user */}
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-[11px] text-slate-400">Peran aktif</p>
                <p className="text-sm font-medium text-slate-700">LKS</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 text-xs font-semibold">
                LK
              </div>
            </div>
          </div>
        </header>

        {/* Konten */}
        <main className="p-6 bg-slate-50 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default LKSLayout;
