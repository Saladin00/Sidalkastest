import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
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
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../utils/api";

const PetugasLayout = ({ children }) => {
  const location = useLocation();
  const current = location.pathname;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [userInfo, setUserInfo] = useState({
    name: "",
    role: "",
    kecamatan: "-",
  });

  const dropdownRef = useRef(null);

  // ==== AMBIL DATA PROFIL PETUGAS + KECAMATAN ====
  useEffect(() => {
    loadAccount();
  }, []);

 const loadAccount = async () => {
  try {
    const userRes = await API.get("/account");
    const kecRes = await API.get("/kecamatan");

    const u = userRes.data.user;

    // Gunakan fallback aman untuk semua bentuk response
    const list =
      kecRes.data?.kecamatan ||
      kecRes.data?.data ||
      kecRes.data ||
      [];

    const kecamatanNama =
      list.find((k) => k.id === u.kecamatan_id)?.nama ?? "-";

    setUserInfo({
      name: u.name,
      role: u.roles?.[0]?.name || "petugas",
      kecamatan: kecamatanNama,
    });

  } catch (err) {
    console.error("Gagal load data kecamatan:", err);
  }
};

  // ==== LOGOUT ====
  const logout = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    }, 1800);
  };

  // Tutup dropdown klik luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { label: "Dashboard", to: "/petugas", icon: LayoutDashboard },
    { label: "Verifikasi Data", to: "/petugas/verifikasi", icon: ClipboardCheck },
    { label: "Pengaduan", to: "/petugas/pengaduan", icon: MessageCircle },
  ];

  const isActive = (path) =>
    path === "/petugas" ? current === "/petugas" : current.startsWith(path);

  const getInitials = (name = "") => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0]?.substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* SIDEBAR ================================================= */}
      <aside
        className={`relative flex flex-col bg-sky-900 text-sky-50 border-r border-sky-800 shadow-lg transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute right-0 top-8 z-30 w-7 h-7 translate-x-1/2 rounded-full bg-white/95 border border-sky-300 flex items-center justify-center text-sky-700 shadow-md hover:bg-sky-50 transition"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 px-7 py-5 border-b border-sky-800">
          <img src="/logo.png" alt="Logo" className="h-10 w-10" />
          {!isCollapsed && (
            <div>
              <span className="text-[11px] tracking-[0.25em] text-emerald-200 uppercase">
                SIDALEKAS
              </span>
              <p className="text-sm font-semibold">Panel Petugas</p>
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
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2 transition ${
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

        {/* Logout */}
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

      {/* MAIN ================================================= */}
      <div className="flex-1 flex flex-col">

        {/* Top Navbar */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
          <div className="flex justify-between items-center px-8 py-3">
            <h1 className="text-lg md:text-xl font-semibold text-sky-900">
              Halaman Petugas
            </h1>

            {/* Profile Dropdown */}
            <div ref={dropdownRef} className="relative">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-4 bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl px-5 py-2.5 shadow-inner border cursor-pointer hover:shadow-lg transition"
              >
                <div className="text-right">
                  <p className="text-[12px] text-slate-600 font-medium truncate max-w-[150px]">
                    {userInfo.name}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {userInfo.role}
                  </p>

                  {/* ==== KECAMATAN DITAMPILKAN DI SINI ==== */}
                  <p className="text-[11px] text-emerald-600 font-semibold">
                    {userInfo.kecamatan}
                  </p>
                </div>

                <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-white flex items-center justify-center text-sm font-bold shadow-md">
                  <span>{getInitials(userInfo.name)}</span>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
                </div>
              </motion.div>

              {/* Dropdown */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute right-0 mt-3 w-48 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl border overflow-hidden z-50"
                  >
                    <Link
                      to="/petugas/account"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-100 transition"
                    >
                      <User size={18} />
                      Pengaturan Akun
                    </Link>

                    <button
                      onClick={() => {
                        setShowLogoutConfirm(true);
                        setDropdownOpen(false);
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
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

        {/* Main Content */}
        <main className="p-6 bg-slate-50 flex-1 overflow-y-auto">
          {children || <Outlet />}
        </main>
      </div>

      {/* Modal Logout */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm z-[999]">
          <div className="bg-white p-8 rounded-2xl shadow-xl border max-w-sm text-center relative">
            <X
              size={20}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute top-4 right-4 cursor-pointer text-slate-400 hover:text-slate-600"
            />

            <UserCircle2 size={50} className="mx-auto text-sky-500 mb-3" />

            <h3 className="text-lg font-semibold mb-2">
              Konfirmasi Keluar
            </h3>

            <p className="text-sm text-slate-500 mb-6">
              Yakin ingin keluar dari akun petugas?
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 border rounded-lg text-sm text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Logout */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-white/90 px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2 text-slate-700">
          <CheckCircle2 size={22} className="text-emerald-500" />
          <span className="text-sm">Anda telah keluar dari sistem.</span>
        </div>
      )}
    </div>
  );
};

export default PetugasLayout;
