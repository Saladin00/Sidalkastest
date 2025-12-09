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

  // ================== VALIDASI PASSWORD ==================
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  // ================== VALIDASI FORM ==================
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
        "Password minimal 8 karakter dan harus mengandung huruf besar, huruf kecil, dan angka."
      );
      return false;
    }

    if (password !== confirmPassword) {
      showError("Konfirmasi password tidak cocok!");
      return false;
    }

    return true;
  };

  // ================== SUBMIT FORM ==================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await Swal.fire({
      title: "Simpan Data Pengguna?",
      text: "Pastikan semua data sudah benar.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Simpan",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    setLoading(true);

    try {
      await API.post("/admin/users", {
        username: formData.username,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        kecamatan_id: formData.kecamatan_id,
      });

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Akun pengguna berhasil dibuat.",
        confirmButtonColor: "#16a34a",
      });

      navigate("/admin/users");
    } catch (err) {
      console.error("Error:", err);

      const msg =
        err.response?.data?.message ||
        "Terjadi kesalahan saat membuat akun baru.";

      if (msg.toLowerCase().includes("username")) {
        showError("Username sudah digunakan!");
      } else if (msg.toLowerCase().includes("email")) {
        showError("Email sudah terdaftar!");
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
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl p-10 border border-slate-200">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Tambah Pengguna</h2>
          <button onClick={() => navigate(-1)} className="text-slate-500">
            <X size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username, Nama, Email */}
          {["username", "name", "email"].map((key) => (
            <div key={key}>
              <label className="block text-base font-medium">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                type={key === "email" ? "email" : "text"}
                value={formData[key]}
                onChange={(e) =>
                  setFormData({ ...formData, [key]: e.target.value })
                }
                className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
          ))}

          {/* Password */}
          <div className="relative">
            <label className="block text-base font-medium">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full border rounded-xl px-4 py-3 shadow-sm pr-10 focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-slate-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-base font-medium">
              Konfirmasi Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full border rounded-xl px-4 py-3 shadow-sm pr-10 focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-10 text-slate-500"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Role */}
          <div>
            <label className="block text-base font-medium">Role</label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-sky-500"
            >
              <option value="operator">Operator</option>
              <option value="petugas">Petugas</option>
              <option value="lks">LKS</option>
            </select>
          </div>

          {/* Kecamatan */}
          <div>
            <label className="block text-base font-medium">Kecamatan</label>
            <select
              value={formData.kecamatan_id}
              onChange={(e) =>
                setFormData({ ...formData, kecamatan_id: e.target.value })
              }
              className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-sky-500"
            >
              <option value="">Pilih Kecamatan</option>
              {daftarKecamatan.map((k) => (
                <option value={k.id} key={k.id}>
                  {k.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Tombol */}
          <div className="flex justify-between border-t pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-sky-100 text-sky-700 rounded-lg"
            >
              Kembali
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-lg text-white font-semibold ${
                loading ? "bg-gray-400" : "bg-slate-900 hover:bg-black"
              }`}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>

      <ToastContainer position="top-right" theme="colored" />
    </div>
  );
}
