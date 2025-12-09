import React, { useEffect, useState, useRef } from "react";
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

  // AMBIL DATA USER + STATUS VERIFIKASI
  useEffect(() => {
    const loadAccount = async () => {
      try {
        const sessionUser = JSON.parse(sessionStorage.getItem("user") || "{}");
        const role = sessionStorage.getItem("role") || "lks";

        const res = await API.get("/lks/profile-view");
        const lks = res.data.data;

        sessionStorage.setItem("status_verifikasi", lks?.status_verifikasi);

        const kecRes = await API.get("/kecamatan");
        const kecList = kecRes.data?.kecamatan || kecRes.data?.data || [];

        const kecName =
          kecList.find((k) => k.id === lks?.kecamatan_id)?.nama || "-";

        setUserInfo({
          name: sessionUser.name || "Pengguna LKS",
          role,
          kecamatan: kecName,
        });
      } catch (err) {
        console.error("Gagal memuat profil:", err);
      }
    };
    loadAccount();
  }, []);

  // Klik luar → tutup dropdown
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // MENU TERGANTUNG STATUS VERIFIKASI
  const statusVerifikasi = sessionStorage.getItem("status_verifikasi");
  const verified = statusVerifikasi === "valid";

  const navItems = verified
    ? [
        { label: "Dashboard", to: "/lks", icon: LayoutDashboard, exact: true },
        { label: "Data Klien", to: "/lks/klien", icon: Users },
        { label: "Dokumen Pendukung", to: "/lks/dokumen", icon: UploadCloud },
        { label: "Laporan Kegiatan", to: "/lks/laporan", icon: FileText },
        {
          label: "Status Verifikasi",
          to: "/lks/verifikasi",
          icon: ShieldCheck,
        },
        { label: "Profil Saya", to: "/lks/profile", icon: User },
      ]
    : [
        {
          label: "Status Verifikasi",
          to: "/lks/verifikasi",
          icon: ShieldCheck,
        },
        { label: "Profil Saya", to: "/lks/profile", icon: User },
      ];

  const isActive = (path, exact = false) =>
    exact ? current === path : current.startsWith(path);

  const getInitials = (str = "") => {
    const p = str.split(" ");
    if (p.length === 1) return p[0]?.slice(0, 2).toUpperCase();
    return (p[0][0] + p[1][0]).toUpperCase();
  };

  const logout = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      sessionStorage.clear();
      localStorage.clear();
      navigate("/", { replace: true });
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* SIDEBAR */}
      <aside
        className={`relative bg-[#0a4e75] text-white shadow-xl transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-6 right-0 translate-x-1/2 bg-white text-sky-700 border border-sky-300 rounded-full w-7 h-7 flex items-center justify-center shadow hover:bg-sky-50"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* LOGO */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-sky-800">
          <img src="/logo.png" alt="Logo" className="w-10 h-10" />
          {!isCollapsed && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-200">
                SIDALEKAS
              </p>
              <span className="text-sm font-semibold">Panel LKS</span>
            </div>
          )}
        </div>

        {/* NAV MENU */}
        <nav className="px-3 py-4">
          {!isCollapsed && (
            <p className="px-2 text-[11px] uppercase tracking-wide text-sky-200 mb-2">
              Menu
            </p>
          )}

          <ul className="space-y-1">
            {navItems.map(({ label, to, icon: Icon, exact }) => {
              const active = isActive(to, exact);
              return (
                <li key={to}>
                  <Link
                    to={to}
                    className={`group flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                      active
                        ? "bg-sky-800 text-white"
                        : "text-sky-100 hover:bg-sky-800/80"
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
        {/* LOGOUT BUTTON */}
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

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200 px-8 py-4 flex justify-between items-center">
          <div>
            <p className="text-[11px] text-emerald-600 tracking-[0.18em] font-semibold uppercase">
              Sistem Informasi Data Lembaga Kesejahteraan Sosial
            </p>
          </div>

          {/* DROPDOWN USER — SAME STYLE AS ADMIN */}
          <div ref={dropdownRef} className="relative">
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 bg-gradient-to-r from-sky-50 to-blue-50 px-4 py-2.5 rounded-2xl shadow-inner border border-blue-100 cursor-pointer hover:shadow-lg transition"
            >
              <div className="text-right leading-tight">
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

              <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-sky-600 text-white flex items-center justify-center text-sm font-bold shadow">
                {getInitials(userInfo.name)}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
              </div>
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-50">
                <button
                  onClick={() => {
                    navigate("/lks/profile");
                    setDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left flex items-center gap-2 text-slate-700 hover:bg-slate-100"
                >
                  <UserCircle2 size={18} className="text-blue-600" />
                  Lihat Profil
                </button>

                <button
                  onClick={() => {
                    navigate("/lks/account");
                    setDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left flex items-center gap-2 text-slate-700 hover:bg-slate-100"
                >
                  <UserCircle2 size={18} className="text-blue-600" />
                  Pengaturan Akun
                </button>

                <hr className="border-slate-200" />

                <button
                  onClick={() => {
                    setShowLogoutConfirm(true);
                    setDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left flex items-center gap-2 text-red-600 hover:bg-red-50"
                >
                  <LogOut size={18} className="text-red-500" />
                  Keluar
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="p-6 bg-slate-50 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* LOGOUT CONFIRM MODAL */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white p-8 rounded-2xl shadow-xl w-[90%] max-w-sm">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">
                Konfirmasi Logout
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                Apakah Anda yakin ingin keluar?
              </p>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 rounded-lg bg-slate-200 font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold"
                >
                  Keluar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOAST */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            className="fixed bottom-6 right-6 bg-white border border-slate-200 rounded-xl shadow-xl px-4 py-3 flex items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <CheckCircle2 size={20} className="text-emerald-500" />
            <span className="text-sm text-slate-700">
              Anda telah keluar dari sistem.
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LKSLayout;
