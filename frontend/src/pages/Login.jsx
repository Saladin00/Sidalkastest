// src/pages/Login.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import {
  LogIn,
  RefreshCcw,
  UserPlus,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  FileText,
  ClipboardCheck,
  Database,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [generatedCaptcha, setGeneratedCaptcha] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ref untuk canvas captcha
  const captchaCanvasRef = useRef(null);

  // fungsi gambar captcha di canvas (mirip contoh yang kamu kirim)
  const drawCaptcha = (text) => {
    const canvas = captchaCanvasRef.current;
    if (!canvas) return;

    const width = 130;
    const height = 40;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    // background putih
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // garis-garis acak
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = `rgba(0,0,0,${0.3 + Math.random() * 0.4})`;
      ctx.lineWidth = 1 + Math.random();
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }

    // tulisan captcha
    ctx.font = "bold 24px Arial";
    ctx.fillStyle = "#111827"; // hampir hitam
    ctx.textBaseline = "middle";

    // kasih sedikit distort / miring
    const skewX = (Math.random() - 0.5) * 0.6;
    const skewY = (Math.random() - 0.5) * 0.6;
    ctx.setTransform(1, skewY, skewX, 1, 0, 0);

    const x = 12;
    const y = height / 2 + 2;
    ctx.fillText(text, x, y);

    // reset transform
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let text = "";
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedCaptcha(text);
    setCaptcha("");
    drawCaptcha(text);
  };

  useEffect(() => {
    generateCaptcha();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setErrorMsg("");

    if (captcha.toUpperCase() !== generatedCaptcha) {
      setErrorMsg("Captcha tidak sesuai, silakan coba lagi!");
      generateCaptcha();
      return;
    }

    try {
      setIsLoading(true);

      const response = await API.post("/login", {
        email: email.trim(),
        password,
      });

      const { access_token, role, user, message } = response.data;

      if (!access_token) {
        setErrorMsg(
          message || "Login gagal. Token tidak diterima dari server."
        );
        return;
      }

      sessionStorage.setItem("token", access_token);
      sessionStorage.setItem("role", role);
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("lks_id", user.lks_id);

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
          setErrorMsg("Role tidak dikenali, login gagal.");
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);

      if (error.response?.status === 403) {
        setErrorMsg("Akun Anda belum disetujui oleh Admin Dinsos.");
      } else if (error.response?.status === 401) {
        setErrorMsg("Email atau password salah.");
      } else if (error.response?.status === 422) {
        const validationErrors = error.response?.data?.errors;
        const message = validationErrors
          ? Object.values(validationErrors).flat().join(", ")
          : "Format data tidak valid.";
        setErrorMsg(message);
      } else {
        setErrorMsg(
          error.response?.data?.message || "Login gagal, coba lagi nanti."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-100 relative overflow-hidden">
      {/* efek background bulat-bulat */}
      <div className="absolute w-72 h-72 bg-blue-400 rounded-full blur-3xl opacity-20 top-10 left-10 animate-pulse" />
      <div className="absolute w-80 h-80 bg-indigo-400 rounded-full blur-3xl opacity-20 bottom-10 right-10 animate-pulse" />

      <div className="relative z-10 w-full max-w-6xl px-4 py-10 md:py-12 lg:py-14">
        {/* grid responsif: 1 kolom di mobile, 2 kolom di lg ke atas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* PANEL KIRI – CARD LOGIN */}
          <div className="backdrop-blur-xl bg-gradient-to-b from-sky-100/95 via-sky-50/95 to-blue-50/95 border border-white/70 shadow-2xl rounded-2xl px-7 py-7 flex flex-col justify-between">
            <div>
              <div className="flex justify-center mb-4">
                <img
                  src="/logo.png"
                  alt="Logo SIDALEKAS"
                  className="h-20 w-auto drop-shadow-md object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-center text-blue-700 tracking-wide">
                SIDALEKAS
              </h1>
              <p className="text-center text-gray-600 text-xs mt-1 mb-6">
                Sistem Informasi Data Lembaga Kesejahteraan Sosial
              </p>

              {errorMsg && (
                <p className="text-red-600 text-xs mb-4 text-center font-medium bg-red-50/90 py-2 px-3 rounded-lg border border-red-100">
                  {errorMsg}
                </p>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contoh@email.com"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/85 text-sm"
                    required
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi"
                      className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/85 text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Captcha */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Kode Captcha
                  </label>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    {/* gambar captcha */}
                    <canvas
                      ref={captchaCanvasRef}
                      className="h-12 w-32 border border-gray-300 rounded bg-white"
                    />

                    {/* input + refresh */}
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        placeholder="Masukkan kode Captcha"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/85 text-sm"
                        value={captcha}
                        onChange={(e) => setCaptcha(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={generateCaptcha}
                        className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 border border-blue-300 transition shrink-0"
                        title="Muat ulang captcha"
                      >
                        <RefreshCcw size={18} className="text-blue-500" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tombol login */}
                <button
                  type="submit"
                  className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-md hover:opacity-95 transition font-semibold text-sm"
                >
                  <LogIn size={18} />
                  {isLoading ? "Memproses..." : "Login"}
                </button>

                {/* Tombol daftar */}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-md hover:opacity-95 transition font-semibold text-sm"
                >
                  <UserPlus size={18} />
                  Daftar Akun
                </button>
              </form>
            </div>

            <div className="mt-6 text-[11px] text-center text-gray-500">
              © Dinas Sosial Kabupaten Indramayu {new Date().getFullYear()}
            </div>
          </div>

          {/* PANEL KANAN – ALUR PROSES */}
          {/* muncul di bawah login pada mobile, di kanan saat lg ke atas */}
          <div className="flex h-full order-last lg:order-none mt-6 lg:mt-0">
            <div className="flex flex-col justify-start py-7 pl-2 pr-2 md:pl-6 md:pr-2 text-left text-gray-800 w-full">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold mb-3 leading-snug text-slate-900">
                  Alur Proses Pendaftaran Lembaga
                  <br />
                  Kesejahteraan Sosial
                </h2>

                <p className="text-sm text-gray-600 max-w-xl">
                  Pengurus lembaga sosial dapat melakukan registrasi akun,
                  pendaftaran lembaga, hingga pengelolaan data secara terpusat
                  melalui aplikasi <span className="font-semibold">SIDALEKAS</span>.
                </p>
              </div>

              <div className="mt-6 space-y-4 md:space-y-6 max-w-xl">
                {/* Langkah 1 */}
                <div className="flex gap-3 rounded-xl bg-white/40 border border-white/60 shadow-sm px-3 py-3">
                  <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      Registrasi Akun Sidalekas
                    </h3>
                    <p className="text-[13px] md:text-sm text-gray-600">
                      Akun lembaga didaftarkan dan diverifikasi oleh Dinas
                      Sosial Kabupaten/Kota sebelum dapat mengakses SIDALEKAS.
                    </p>
                  </div>
                </div>

                {/* Langkah 2 */}
                <div className="flex gap-3 rounded-xl bg-white/40 border border-white/60 shadow-sm px-3 py-3">
                  <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      Pendaftaran Lembaga
                    </h3>
                    <p className="text-[13px] md:text-sm text-gray-600">
                      Pengurus mengisi biodata lengkap lembaga sebagai dasar
                      pengajuan verifikasi dan penetapan status LKS.
                    </p>
                  </div>
                </div>

                {/* Langkah 3 */}
                <div className="flex gap-3 rounded-xl bg-white/40 border border-white/60 shadow-sm px-3 py-3">
                  <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                    <ClipboardCheck size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      Verifikasi oleh Dinas Sosial
                    </h3>
                    <p className="text-[13px] md:text-sm text-gray-600">
                      Dinas Sosial melakukan validasi data dan kunjungan
                      lapangan sebelum menetapkan status verifikasi lembaga.
                    </p>
                  </div>
                </div>

                {/* Langkah 4 */}
                <div className="flex gap-3 rounded-xl bg-white/40 border border-white/60 shadow-sm px-3 py-3">
                  <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                    <Database size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      Lembaga Mengelola Data
                    </h3>
                    <p className="text-[13px] md:text-sm text-gray-600">
                      Setelah disetujui, lembaga dapat memperbarui data,
                      pelaporan, dan monitoring program sosial secara berkala.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FULLSCREEN LOADING OVERLAY */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 px-6 py-4 bg-white rounded-xl shadow-lg">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm text-gray-700 font-medium">
              Memproses login...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
