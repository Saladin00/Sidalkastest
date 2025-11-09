// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { LogIn, RefreshCcw, UserPlus } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [generatedCaptcha, setGeneratedCaptcha] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Generate captcha
  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let text = "";
    for (let i = 0; i < 5; i++)
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    setGeneratedCaptcha(text);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (captcha.toUpperCase() !== generatedCaptcha) {
      setErrorMsg("Captcha tidak sesuai, silakan coba lagi!");
      generateCaptcha();
      return;
    }

    try {
      const response = await API.post("/login", { email, password });
      const { access_token, role, user, message } = response.data;

      if (!access_token) {
        setErrorMsg(message || "Login gagal. Token tidak diterima dari server.");
        return;
      }

      localStorage.setItem("token", access_token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect sesuai role
      if (role === "admin") navigate("/admin");
      else if (role === "operator") navigate("/operator");
      else if (role === "petugas") navigate("/petugas");
      else if (role === "lks") navigate("/lks");
      else setErrorMsg("Role tidak dikenali, login gagal.");
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);

      if (error.response?.status === 403) {
        setErrorMsg("Akun Anda belum disetujui oleh Admin Dinsos.");
      } else if (error.response?.status === 401) {
        setErrorMsg("Email atau password salah.");
      } else {
        setErrorMsg(error.response?.data?.message || "Login gagal, coba lagi nanti.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-100 relative overflow-hidden">
      <div className="absolute w-72 h-72 bg-blue-400 rounded-full blur-3xl opacity-20 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-80 h-80 bg-indigo-400 rounded-full blur-3xl opacity-20 bottom-10 right-10 animate-pulse"></div>

      <div className="relative z-10 backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="h-28 w-auto drop-shadow-md object-contain" />
        </div>

        <h1 className="text-3xl font-bold text-center text-blue-700 tracking-wider">
          SIDALEKAS
        </h1>
        <p className="text-center text-gray-600 text-sm mb-6">
          Sistem Informasi Data Lembaga Kesejahteraan Sosial
        </p>

        {errorMsg && (
          <p className="text-red-600 text-sm mb-4 text-center font-medium bg-red-50 py-2 rounded">
            {errorMsg}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/60"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/60"
              required
            />
            <div className="mt-1 flex items-center gap-2">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="w-4 h-4"
              />
              <label htmlFor="showPassword" className="text-sm text-gray-600">
                Lihat password
              </label>
            </div>
          </div>

          {/* Captcha */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Captcha</label>
            <div className="flex items-center gap-2">
              <div className="px-4 py-2 font-mono text-lg tracking-widest bg-gradient-to-r from-blue-200 to-blue-100 border border-blue-300 rounded-md shadow-inner select-none">
                {generatedCaptcha}
              </div>
              <input
                type="text"
                placeholder="Masukkan captcha"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/60"
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={generateCaptcha}
                className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 border border-blue-300 transition"
              >
                <RefreshCcw size={18} className="text-blue-500" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:opacity-90 transition font-semibold"
          >
            <LogIn size={18} /> Login
          </button>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-md hover:opacity-90 transition font-semibold"
          >
            <UserPlus size={18} /> Daftar Akun
          </button>
        </form>

        <div className="text-xs text-center text-gray-500 mt-6">
          © Dinas Sosial {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};

export default Login;
