import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { UserPlus, ArrowLeft } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin", // default role
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Konfirmasi password tidak sesuai.");
      return;
    }

    try {
      // kirim data sesuai validasi Laravel
      const res = await API.post("/register", {
        username: form.username,
        name: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.confirmPassword,
        role: form.role,
      });

      setSuccess("Pendaftaran berhasil! Silakan login.");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error("Register error:", err.response?.data || err);
      setError(err.response?.data?.message || "Pendaftaran gagal.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-emerald-200 to-green-100 relative overflow-hidden">
      {/* Background efek */}
      <div className="absolute w-72 h-72 bg-green-400 rounded-full blur-3xl opacity-20 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-80 h-80 bg-emerald-400 rounded-full blur-3xl opacity-20 bottom-10 right-10 animate-pulse"></div>

      <div className="relative z-10 backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="h-28 w-auto drop-shadow-md object-contain" />
        </div>

        <h1 className="text-3xl font-bold text-center text-emerald-700 tracking-wider">Daftar Akun</h1>
        <p className="text-center text-gray-600 text-sm mb-6">
          Buat akun untuk mengakses sistem SIDALEKAS
        </p>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center font-medium bg-red-50 py-2 rounded">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 text-sm mb-4 text-center font-medium bg-green-50 py-2 rounded">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:outline-none bg-white/60"
              required
            />
          </div>

          {/* Nama Lengkap */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:outline-none bg-white/60"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">E-mail</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:outline-none bg-white/60"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:outline-none bg-white/60"
              required
            />
          </div>

          {/* Konfirmasi Password */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Konfirmasi Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:outline-none bg-white/60"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Pilih Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:outline-none bg-white/60"
              required
            >
              <option value="lks">Admin</option>
              <option value="lks">LKS</option>
              <option value="operator">Operator</option>
              <option value="petugas">Petugas</option>
            </select>
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg shadow-md hover:opacity-90 transition font-semibold"
          >
            <UserPlus size={18} /> Daftar
          </button>

          {/* Tombol kembali ke login */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-2 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition font-semibold"
          >
            <ArrowLeft size={18} /> Kembali ke Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
