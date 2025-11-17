// src/components/OperatorLayout.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  LogOut,
  MapPin,
  ChevronLeft,
  ChevronRight,
  UserCog,
  ChevronDown,
  ChevronUp,
  FolderOpen, // icon utama LKS
} from "lucide-react";

const OperatorLayout = ({ children }) => {
  const location = useLocation();
  const current = location.pathname;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(false); // untuk submenu LKS

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  };

  // ==================================================
  // 🔹 MENU NAVIGASI OPERATOR
  // ==================================================
  const navItems = [
    { label: "Dashboard", to: "/operator", icon: LayoutDashboard },
    {
      label: "LKS",
      icon: FolderOpen,
      submenu: [
        { label: "Manajemen LKS", to: "/operator/manajemen-lks", icon: UserCog },
        { label: "Daftar LKS", to: "/operator/lks-list", icon: ShieldCheck },
      ],
    },
    { label: "Data Klien", to: "/operator/klien", icon: Users },
    { label: "Sebaran Wilayah", to: "/operator/sebaran", icon: MapPin },
  ];

  const isActive = (path) =>
    path === "/operator" ? current === "/operator" : current.startsWith(path);

  // ==================================================
  // 🔹 BREADCRUMB + TITLE OTOMATIS
  // ==================================================
  const getPageMeta = (path) => {
    if (path === "/operator") {
      return { breadcrumb: ["Dashboard"], title: "Dashboard Operator" };
    }

    if (path.startsWith("/operator/manajemen-lks")) {
      return { breadcrumb: ["Operator", "LKS", "Manajemen LKS"], title: "Manajemen Akun LKS Kecamatan" };
    }

    if (path.startsWith("/operator/lks-list")) {
      return { breadcrumb: ["Operator", "LKS", "Daftar LKS"], title: "Daftar LKS di Kecamatan" };
    }

    if (path.startsWith("/operator/klien")) {
      return { breadcrumb: ["Operator", "Data Klien"], title: "Data Klien Kecamatan" };
    }

    if (path.startsWith("/operator/sebaran")) {
      return { breadcrumb: ["Operator", "Sebaran Wilayah"], title: "Sebaran Wilayah LKS & Klien" };
    }

    return { breadcrumb: ["Dashboard"], title: "Dashboard Operator" };
  };

  const pageMeta = getPageMeta(current);

  // ==================================================
  // 🔹 RENDER
  // ==================================================
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside
        className={`relative flex flex-col bg-sky-900 text-sky-50 border-r border-sky-800 shadow-lg transition-all duration-300
        ${isCollapsed ? "w-20" : "w-64"}`}
      >
        {/* Tombol collapse */}
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="absolute right-0 top-8 z-30 w-7 h-7 translate-x-1/2
            rounded-full bg-white/95 border border-sky-300 flex items-center justify-center
            text-sky-700 shadow-md hover:bg-sky-50 hover:border-sky-400 transition"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Logo + Title */}
        <div className="flex items-center gap-3 px-7 py-5 border-b border-sky-800">
          <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-[11px] tracking-[0.25em] text-emerald-200 uppercase">
                SIDALEKAS
              </span>
              <span className="text-sm tracking-[0.20em] font-semibold text-sky-50">
                Panel Operator
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
          {!isCollapsed && (
            <p className="px-2 text-[11px] tracking-wide uppercase text-sky-200">
              Menu Operator
            </p>
          )}

          <ul className="space-y-1">
            {navItems.map(({ label, to, icon: Icon, submenu }) => {
              if (!submenu) {
                const active = isActive(to);
                return (
                  <li key={to}>
                    <Link
                      to={to}
                      className={`group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all
                        ${
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
                        className={`shrink-0 ${
                          active
                            ? "text-white"
                            : "text-sky-200 group-hover:text-white"
                        }`}
                      />
                      {!isCollapsed && <span>{label}</span>}
                    </Link>
                  </li>
                );
              } else {
                // 🔹 MENU DENGAN SUBMENU
                const isSubActive = submenu.some((s) =>
                  current.startsWith(s.to)
                );
                return (
                  <li key={label}>
                    <button
                      onClick={() => setOpenSubmenu((prev) => !prev)}
                      className={`flex items-center justify-between w-full rounded-xl px-3 py-2 text-sm transition-all ${
                        isSubActive
                          ? "bg-sky-800 text-white"
                          : "text-sky-100 hover:bg-sky-800/80 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          size={18}
                          className={`shrink-0 ${
                            isSubActive ? "text-white" : "text-sky-200"
                          }`}
                        />
                        {!isCollapsed && <span>{label}</span>}
                      </div>
                      {!isCollapsed && (
                        openSubmenu ? (
                          <ChevronUp size={14} className="text-sky-200" />
                        ) : (
                          <ChevronDown size={14} className="text-sky-200" />
                        )
                      )}
                    </button>

                    {/* Submenu list */}
                    {openSubmenu && !isCollapsed && (
                      <ul className="mt-1 ml-5 space-y-1 border-l border-sky-800/60 pl-3">
                        {submenu.map(({ label: subLabel, to: subTo, icon: SubIcon }) => {
                          const subActive = isActive(subTo);
                          return (
                            <li key={subTo}>
                              <Link
                                to={subTo}
                                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition ${
                                  subActive
                                    ? "bg-sky-800 text-white"
                                    : "text-sky-100 hover:bg-sky-800/60 hover:text-white"
                                }`}
                              >
                                <SubIcon size={16} />
                                <span>{subLabel}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              }
            })}
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

      {/* Konten utama */}
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-100">
          <div className="pr-3 py-2 pl-10 flex items-center justify-between">
            <div className="space-y-1">
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

              <h1 className="text-lg md:text-xl font-semibold text-sky-900">
                {pageMeta.title}
              </h1>
            </div>

            {/* Info user kanan */}
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-[11px] text-slate-400">Peran aktif</p>
                <p className="text-sm font-medium text-slate-700">Operator</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 text-xs font-semibold">
                OP
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 bg-slate-50 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default OperatorLayout;
