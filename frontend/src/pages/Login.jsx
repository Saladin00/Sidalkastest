// src/pages/Login.jsx

import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      await api.get("/sanctum/csrf-cookie");
      const response = await api.post("/api/login", { email, password });
      const { access_token, role } = response.data;
      localStorage.setItem("token", access_token);
      localStorage.setItem("role", role);

      switch (role) {
        case "admin":
          navigate("/admin");
          break;
        case "operator":
          navigate("/operator");
          break;
        case "petugas":
          navigate("/petugas");
          break;
        case "lks":
          navigate("/lks");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("Login gagal. Cek email/password kamu!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-white to-blue-100">
      <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md border border-gray-200">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="SIDALEKAS" className="h-14" />
        </div>
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Login ke SIDALEKAS</h2>

        {errorMsg && (
          <p className="text-red-500 text-sm mb-4 text-center font-medium bg-red-50 py-2 rounded">
            {errorMsg}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="admin@sidalekas.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="******"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all text-sm font-semibold"
          >
            <LogIn size={16} /> Masuk
          </button>
        </form>

        <div className="text-xs text-center text-gray-400 mt-6">
          &copy; {new Date().getFullYear()} Sistem Informasi Data Lembaga Kesejahteraan Sosial
        </div>
      </div>
    </div>
  );
};

export default Login;
