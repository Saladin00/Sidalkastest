import React, { useEffect, useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import API from "../../utils/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import {
  showSuccess,
  showError,
  showWarning,
  showInfo,
} from "../../utils/toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TambahUser() {
  const navigate = useNavigate();
  const [daftarKecamatan, setDaftarKecamatan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "operator",
    kecamatan_id: "",
  });

  // ================== GET KECAMATAN ==================
  useEffect(() => {
    const fetchKecamatan = async () => {
      try {
        const res = await API.get("/kecamatan");
        setDaftarKecamatan(res.data.data || []);
      } catch {
        showError("Gagal memuat daftar kecamatan!");
      }
    };
    fetchKecamatan();
  }, []);

  // ================== VALIDASI ==================
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const validateForm = () => {
    const { username, name, email, password, confirmPassword, kecamatan_id } =
      formData;

    if (
      !username ||
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !kecamatan_id
    ) {
      showWarning("Lengkapi semua field wajib.");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      showWarning("Format email tidak valid.");
      return false;
    }

    if (!validatePassword(password)) {
      showWarning(
        "Password minimal 8 karakter dan harus berisi huruf besar, huruf kecil, dan angka."
      );
      return false;
    }

    if (password !== confirmPassword) {
      showError("Konfirmasi password tidak cocok dengan password!");
      return false;
    }

    if (password.toLowerCase().includes(username.toLowerCase())) {
      showWarning("Password tidak boleh mengandung username.");
      return false;
    }

    return true;
  };

  // ================== SUBMIT ==================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Tampilkan konfirmasi SweetAlert2
    const result = await Swal.fire({
      title: "Simpan Data Pengguna?",
      text: "Pastikan data sudah benar sebelum disimpan.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb", // biru
      cancelButtonColor: "#6b7280", // abu
      confirmButtonText: "Ya, Simpan",
      cancelButtonText: "Batal",
      background: "#fff",
      color: "#374151",
      backdrop: `rgba(0,0,0,0.4)`,
    });

    if (!result.isConfirmed) {
      showInfo("Aksi dibatalkan.");
      return;
    }

    setLoading(true);
    showInfo("Menyimpan data pengguna...");

    try {
      const token = sessionStorage.getItem("token");
      await API.post(
        "/admin/users",
        {
          username: formData.username,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          kecamatan_id: formData.kecamatan_id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Akun pengguna berhasil dibuat.",
        confirmButtonColor: "#16a34a", // hijau
        confirmButtonText: "OK",
      });

      navigate("/admin/users");
    } catch (err) {
      console.error("Error:", err);
      const msg =
        err.response?.data?.message ||
        "Terjadi kesalahan saat membuat akun baru.";
      if (msg.toLowerCase().includes("password")) {
        showError("Password tidak memenuhi kriteria keamanan!");
      } else if (msg.toLowerCase().includes("username")) {
        showError("Username sudah digunakan, pilih username lain!");
      } else if (msg.toLowerCase().includes("email")) {
        showError("Email sudah terdaftar, gunakan email lain!");
      } else {
        showError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // ================== UI ==================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center px-6 py-10">
      <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl w-full max-w-2xl p-10 border border-slate-200 transition-all duration-300 hover:shadow-slate-400/30">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Tambah Pengguna
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <X size={26} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {["username", "name", "email"].map((key) => (
            <div key={key} className="space-y-2">
              <label className="block text-base font-medium text-slate-700 capitalize">
                {key}
              </label>
              <input
                type={key === "email" ? "email" : "text"}
                value={formData[key]}
                onChange={(e) =>
                  setFormData({ ...formData, [key]: e.target.value })
                }
                placeholder={`Masukkan ${key}`}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-base shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                required
              />
            </div>
          ))}

          {/* Password */}
          <div className="space-y-2 relative">
            <label className="block text-base font-medium text-slate-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Masukkan password"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-base shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-slate-500 hover:text-slate-700 transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <p className="text-sm text-slate-500 mt-1">
              Password minimal 8 karakter dan harus mengandung huruf besar,
              huruf kecil, dan angka.
            </p>
          </div>

          {/* Konfirmasi Password */}
          <div className="space-y-2 relative">
            <label className="block text-base font-medium text-slate-700">
              Konfirmasi Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              placeholder="Ulangi password"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-base shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none pr-10"
              required
            />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-10 text-slate-500 hover:text-slate-700 transition"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Role */}
          <div className="space-y-2">
            <label className="block text-base font-medium text-slate-700">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-base shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
            >
              <option value="operator">Operator</option>
              <option value="petugas">Petugas</option>
            </select>
          </div>

          {/* Kecamatan */}
          <div className="space-y-2">
            <label className="block text-base font-medium text-slate-700">
              Kecamatan
            </label>
            <select
              value={formData.kecamatan_id}
              onChange={(e) =>
                setFormData({ ...formData, kecamatan_id: e.target.value })
              }
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-base shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
            >
              <option value="">Pilih Kecamatan</option>
              {daftarKecamatan.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Tombol */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 text-base rounded-lg bg-sky-100 text-sky-700 font-medium hover:bg-sky-200 transition-all"
            >
              Kembali
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 text-base font-semibold text-white rounded-lg shadow-md transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-slate-900 hover:bg-black"
              }`}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar
        newestOnTop
        theme="colored"
      />
    </div>
  );
}
