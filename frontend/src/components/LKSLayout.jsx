import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  UserCircle2,
  X,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../utils/api";

const LKSLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const current = location.pathname;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    role: "",
    kecamatan: "-",
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const dropdownRef = useRef(null);

  // ===================================================
  // 🔥 Load Profil + Kecamatan + Status Verifikasi
  // ===================================================
  useEffect(() => {
    const loadAccount = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user") || "{}");
        const role = sessionStorage.getItem("role") || "lks";

        // Ambil profil LKS → status_verifikasi terbaru ikut terbawa
        const res = await API.get("/lks/profile-view");
        const lks = res.data.data;

        // Update session → penting agar sidebar bisa update
        sessionStorage.setItem("status_verifikasi", lks?.status_verifikasi);

        // Ambil daftar kecamatan
        const kecRes = await API.get("/kecamatan");
        const kecList =
          kecRes.data?.kecamatan || kecRes.data?.data || kecRes.data || [];

        const kecamatanNama =
          kecList.find((k) => k?.id === lks?.kecamatan_id)?.nama || "-";

        setUserInfo({
          name: user.name || "Pengguna LKS",
          role,
          kecamatan: kecamatanNama,
        });
      } catch (err) {
        console.error("Gagal memuat profil:", err);
      }
    };

    loadAccount();
  }, []);

  // Logout
  const logout = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    }, 1800);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ===================================================
  // 🔥 Sidebar Menu Berdasarkan STATUS VERIFIKASI
  // ===================================================
  const statusVerifikasi = sessionStorage.getItem("status_verifikasi");
  const hanyaBasicMenu = statusVerifikasi !== "valid";

  let navItems = [
    { label: "Status Verifikasi", to: "/lks/verifikasi", icon: ShieldCheck },
    { label: "Profil Saya", to: "/lks/profile", icon: User },
  ];

  if (!hanyaBasicMenu) {
    navItems = [
      { label: "Dashboard", to: "/lks", icon: LayoutDashboard, exact: true },
      { label: "Data Klien", to: "/lks/klien", icon: Users },
      { label: "Status Verifikasi", to: "/lks/verifikasi", icon: ShieldCheck },
      { label: "Profil Saya", to: "/lks/profile", icon: User },
    ];
  }

  const isActive = (path, exact = false) =>
    exact ? current === path : current.startsWith(path);

  const getPageMeta = (path) => {
    if (path === "/lks") return { title: "Dashboard LKS" };
    if (path.startsWith("/lks/klien")) return { title: "Data Klien" };
    if (path.startsWith("/lks/verifikasi"))
      return { title: "Status Verifikasi LKS" };
    if (path.startsWith("/lks/profile")) return { title: "Profil Akun" };
    return { title: "Dashboard LKS" };
  };

  const pageMeta = getPageMeta(current);

  const getInitials = (name = "") => {
    const parts = name.split(" ");
    if (parts.length === 1)
      return parts[0]?.substring(0, 2).toUpperCase() || "LK";
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* ========== SIDEBAR ========== */}
      <aside
        className={`relative flex flex-col bg-[#0a4e75] text-sky-50 shadow-lg transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute right-0 top-8 z-30 w-7 h-7 translate-x-1/2 rounded-full bg-white/90 border border-sky-300 flex items-center justify-center text-sky-700 shadow-md hover:bg-sky-50 transition"
        >
          {isCollapsed ? (
            <ChevronRight size={14} />
          ) : (
            <ChevronLeft size={14} />
          )}
        </button>

        {/* LOGO */}
        <div className="flex items-center gap-3 px-7 py-5 border-b border-sky-800">
          <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
          {!isCollapsed && (
            <div>
              <span className="text-[11px] tracking-[0.25em] text-emerald-200 uppercase">
                SIDALEKAS
              </span>
              <p className="text-sm font-semibold text-sky-50 tracking-wide">
                Panel LKS
              </p>
            </div>
          )}
        </div>

        {/* MENU */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-4">
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
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2 transition-all ${
                      active
                        ? "bg-sky-800 text-white"
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
        <div className="border-t border-sky-800 px-3 py-4">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-500 hover:bg-red-600 transition text-sm font-semibold text-white py-2.5 shadow-md"
          >
            <LogOut size={16} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <div className="flex-1 flex flex-col">
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

            {/* USER DROPDOWN */}
            <div ref={dropdownRef} className="relative">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-4 bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl px-5 py-2.5 shadow-inner border border-blue-100 cursor-pointer hover:shadow-lg transition-all"
              >
                <div className="flex flex-col text-right leading-tight">
                  <p className="text-[11px] text-slate-400 font-medium">
                    Peran aktif
                  </p>
                  <p className="text-sm font-semibold text-sky-700 capitalize">
                    {userInfo.role}
                  </p>
                  <p className="text-[12px] text-slate-600 font-medium truncate max-w-[140px]">
                    {userInfo.name} — {userInfo.kecamatan}
                  </p>
                </div>

                <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-white flex items-center justify-center text-sm font-bold shadow-md">
                  <span>{getInitials(userInfo.name)}</span>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
                </div>
              </motion.div>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="absolute right-0 mt-3 w-52 bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50"
                  >
                    <button
                      onClick={() => {
                        navigate("/lks/profile");
                        setDropdownOpen(false);
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-sky-50 transition font-medium"
                    >
                      <UserCircle2 size={18} className="text-sky-600" />
                      Lihat Profil
                    </button>

                    <button
                      onClick={() => {
                        navigate("/lks/account");
                        setDropdownOpen(false);
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-sky-50 transition font-medium"
                    >
                      <UserCircle2 size={18} className="text-sky-600" />
                      Pengaturan Akun
                    </button>

                    <hr className="border-slate-100" />

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
          {children}
        </main>
      </div>

      {/* ========== MODAL LOGOUT ========== */}
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
                Apakah Anda yakin ingin keluar dari akun Anda?
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

export default LKSLayout;
