import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardCheck,
  MessageCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  UserCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PetugasLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const current = location.pathname;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", role: "" });
  const dropdownRef = useRef(null);

  // Ambil data user dari sessionStorage
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    const role = sessionStorage.getItem("role") || "Petugas";
    const name = user.name || "Pengguna Petugas";
    setUserInfo({ name, role });
  }, []);

  // Logout animasi
  const logout = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    }, 1800);
  };

  // Tutup dropdown klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { label: "Dashboard", to: "/petugas", icon: LayoutDashboard },
    { label: "Verifikasi Data", to: "/petugas/verifikasi", icon: ClipboardCheck },
    { label: "Pengaduan", to: "/petugas/pengaduan", icon: MessageCircle },
  ];

  const isActive = (path) =>
    path === "/petugas" ? current === "/petugas" : current.startsWith(path);

  const getPageMeta = (path) => {
    if (path === "/petugas")
      return { breadcrumb: ["Dashboard"], title: "Dashboard Petugas" };
    if (path.startsWith("/petugas/verifikasi"))
      return { breadcrumb: ["Petugas", "Verifikasi Data"], title: "Verifikasi Data Lapangan" };
    if (path.startsWith("/petugas/pengaduan"))
      return { breadcrumb: ["Petugas", "Pengaduan"], title: "Pengaduan Masyarakat" };
    return { breadcrumb: ["Dashboard"], title: "Dashboard Petugas" };
  };

  const pageMeta = getPageMeta(current);

  const getInitials = (name = "") => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0]?.substring(0, 2).toUpperCase() || "PT";
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside
        className={`relative flex flex-col bg-sky-900 text-sky-50 border-r border-sky-800 shadow-lg transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Toggle */}
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="absolute right-0 top-8 z-30 w-7 h-7 translate-x-1/2 rounded-full bg-white/95 border border-sky-300 flex items-center justify-center text-sky-700 shadow-md hover:bg-sky-50 transition"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 px-7 py-5 border-b border-sky-800">
          <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
          {!isCollapsed && (
            <div>
              <span className="text-[11px] tracking-[0.25em] text-emerald-200 uppercase">
                SIDALEKAS
              </span>
              <p className="text-sm font-semibold text-sky-50 tracking-wide">
                Panel Petugas
              </p>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
          {!isCollapsed && (
            <p className="px-2 text-[11px] tracking-wide uppercase text-sky-200">
              Menu Petugas
            </p>
          )}
          <ul className="space-y-1 text-sm">
            {navItems.map(({ label, to, icon: Icon }) => {
              const active = isActive(to);
              return (
                <li key={to}>
                  <Link
                    to={to}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2 transition-all ${
                      active
                        ? "bg-sky-800 text-white shadow-sm"
                        : "text-sky-100 hover:bg-sky-800/80 hover:text-white"
                    }`}
                  >
                    {active && (
                      <span className="w-1 h-6 bg-emerald-400 rounded-full" />
                    )}
                    <Icon size={18} />
                    {!isCollapsed && <span>{label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Sidebar */}
        <div className="border-t border-sky-800 px-3 py-4 bg-sky-900/90">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-500 hover:bg-red-600 transition text-sm font-semibold text-white py-2.5 shadow-md"
          >
            <LogOut size={16} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
          <div className="flex justify-between items-center px-8 py-3">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-emerald-600 uppercase">
                Sistem Informasi Data Lembaga Kesejahteraan Sosial
              </p>
              <h1 className="text-lg md:text-xl font-semibold text-sky-900 mt-0.5">
                {pageMeta.title}
              </h1>
            </div>

            {/* Profil Dropdown */}
            <div ref={dropdownRef} className="relative">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-4 bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl px-5 py-2.5 shadow-inner border border-blue-100 cursor-pointer hover:shadow-lg transition-all"
              >
                <div className="flex flex-col text-right leading-tight">
                  <p className="text-[11px] text-slate-400 font-medium">Peran aktif</p>
                  <p className="text-sm font-semibold text-sky-700 capitalize">
                    {userInfo.role}
                  </p>
                  <p className="text-[12px] text-slate-600 font-medium truncate max-w-[140px]">
                    {userInfo.name}
                  </p>
                </div>
                <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-white flex items-center justify-center text-sm font-bold shadow-md">
                  <span>{getInitials(userInfo.name)}</span>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
                </div>
              </motion.div>

              {/* Dropdown cuma Keluar */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="absolute right-0 mt-3 w-48 bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50"
                  >
                    <button
                      onClick={() => {
                        setShowLogoutConfirm(true);
                        setDropdownOpen(false);
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition font-medium"
                    >
                      <LogOut size={18} className="text-red-500" />
                      Keluar
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="p-6 bg-slate-50 flex-1 overflow-y-auto">
          {children || <Outlet />}
        </main>
      </div>

      {/* Modal Konfirmasi Logout */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-[999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-sm text-center border border-slate-200 relative"
            >
              <X
                size={20}
                onClick={() => setShowLogoutConfirm(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition"
              />
              <UserCircle2 size={48} className="mx-auto mb-3 text-sky-500" />
              <h3 className="text-lg font-semibold text-slate-800 mb-1">
                Konfirmasi Keluar
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Apakah Anda yakin ingin keluar dari akun petugas?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-500 hover:bg-red-600 text-white shadow transition"
                >
                  Ya, Keluar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 flex items-center gap-3 bg-white/90 backdrop-blur-lg border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-slate-700 z-[1000]"
          >
            <CheckCircle2 className="text-emerald-500" size={22} />
            <span className="text-sm font-medium">
              Anda telah keluar dari sistem.
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PetugasLayout;
