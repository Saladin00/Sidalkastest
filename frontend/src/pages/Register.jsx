import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { Link } from "react-router-dom";

import {
  UserPlus,
  ArrowLeft,
  ShieldCheck,
  FileText,
  ClipboardCheck,
  Database,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = "6LdJBw8sAAAAAE2C2A5Gywdf4L5N2HB7VwgIKVm5";
import.meta.env.VITE_RECAPTCHA_SITE_KEY || "YOUR_RECAPTCHA_SITE_KEY";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    jenis_layanan: "",
    kecamatan_id: "",
  });

  const [daftarKecamatan, setDaftarKecamatan] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    API.get("/kecamatan")
      .then((res) => setDaftarKecamatan(res.data?.data || []))
      .catch((err) => console.error("Gagal ambil daftar kecamatan:", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (pass) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(pass);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!recaptchaToken) {
      setError("Silakan selesaikan verifikasi reCAPTCHA terlebih dahulu.");
      return;
    }

    if (!agreePrivacy) {
      setError("Anda harus menyetujui kebijakan privasi terlebih dahulu.");
      return;
    }

    if (!validateEmail(form.email)) {
      setError("Format email tidak valid. Gunakan format seperti nama@domain.com.");
      return;
    }

    if (!validatePassword(form.password)) {
      setError(
        "Password harus minimal 8 karakter, memiliki huruf besar, huruf kecil, angka, dan simbol."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Konfirmasi password tidak sesuai.");
      return;
    }

    try {
      await API.post("/register", {
        username: form.username,
        name: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.confirmPassword,
        jenis_layanan: form.jenis_layanan,
        kecamatan_id: form.kecamatan_id,
      });

      setSuccess(
        "Pendaftaran berhasil! Akun Anda sedang menunggu persetujuan dari Admin Dinsos."
      );
      setTimeout(() => navigate("/"), 2500);
    } catch (err) {
      console.error("Register error:", err.response?.data || err);
      setError(err.response?.data?.message || "Pendaftaran gagal.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-100 relative overflow-hidden">
      {/* bubble background */}
      <div className="absolute w-72 h-72 bg-blue-400 rounded-full blur-3xl opacity-20 top-10 left-10 animate-pulse" />
      <div className="absolute w-80 h-80 bg-indigo-400 rounded-full blur-3xl opacity-20 bottom-10 right-10 animate-pulse" />

      <div className="relative z-10 w-full max-w-6xl px-4 py-14 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* PANEL KIRI */}
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
              <p className="text-center text-gray-600 text-xs mt-1">
                Sistem Informasi Data Lembaga Kesejahteraan Sosial
              </p>
              <p className="text-center text-[11px] text-gray-600 mt-2 mb-5">
                Formulir pendaftaran akun LKS. Akun akan diverifikasi terlebih
                dahulu oleh Admin Dinas Sosial sebelum dapat digunakan untuk login.
              </p>

              {error && (
                <p className="text-red-600 text-xs mb-3 text-center font-medium bg-red-50/90 py-2 px-3 rounded-lg border border-red-100">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-emerald-600 text-xs mb-3 text-center font-medium bg-emerald-50/90 py-2 px-3 rounded-lg border border-emerald-100">
                  {success}
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Username */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/85 text-sm"
                    required
                  />
                </div>

                {/* Nama LKS */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Nama LKS
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/85 text-sm"
                    required
                  />
                </div>

                {/* Jenis Layanan */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Jenis Layanan
                  </label>
                  <select
                    name="jenis_layanan"
                    value={form.jenis_layanan}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/85 text-sm"
                    required
                  >
                    <option value="">Pilih Jenis Layanan</option>
                    <option value="Anak">Anak</option>
                    <option value="Disabilitas">Disabilitas</option>
                    <option value="Lansia">Lansia</option>
                    <option value="Fakir Miskin">Fakir Miskin</option>
                    <option value="Kesejahteraan Sosial">Kesejahteraan Sosial</option>
                    <option value="Rehabilitasi Sosial">Rehabilitasi Sosial</option>
                  </select>
                </div>

                {/* Kecamatan */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Kecamatan
                  </label>
                  <select
                    name="kecamatan_id"
                    value={form.kecamatan_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/85 text-sm"
                    required
                  >
                    <option value="">Pilih Kecamatan</option>
                    {daftarKecamatan.map((kec) => (
                      <option key={kec.id} value={kec.id}>
                        {kec.nama}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    E-mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      form.email && !validateEmail(form.email)
                        ? "border-red-400"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/85 text-sm`}
                    required
                  />
                  {form.email && !validateEmail(form.email) && (
                    <p className="text-[11px] text-red-500 mt-1">
                      Format email tidak valid (contoh: nama@domain.com)
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5 relative">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        form.password && !validatePassword(form.password)
                          ? "border-red-400"
                          : "border-gray-300"
                      } focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/85 text-sm`}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {form.password && !validatePassword(form.password) && (
                    <p className="text-[11px] text-red-500 mt-1">
                      Minimal 8 karakter, wajib ada huruf besar, kecil, angka, dan simbol.
                    </p>
                  )}
                </div>

                {/* Konfirmasi Password */}
                <div className="space-y-1.5 relative">
                  <label className="block text-xs font-semibold text-slate-700">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        form.confirmPassword &&
                        form.confirmPassword !== form.password
                          ? "border-red-400"
                          : "border-gray-300"
                      } focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/85 text-sm`}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                  {form.confirmPassword &&
                    form.confirmPassword !== form.password && (
                      <p className="text-[11px] text-red-500 mt-1">
                        Konfirmasi password harus sama dengan password.
                      </p>
                    )}
                </div>

                {/* reCAPTCHA */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Verifikasi Keamanan
                  </label>
                  <div className="bg-white border border-gray-300 rounded-lg shadow-sm inline-block px-3 py-2">
                    <ReCAPTCHA
                      sitekey={RECAPTCHA_SITE_KEY}
                      onChange={(token) => setRecaptchaToken(token)}
                      className="scale-[0.98] origin-left"
                    />
                  </div>
                </div>

                {/* Checkbox */}
                <div className="flex items-start gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setAgreePrivacy((v) => !v)}
                    className="mt-0.5 h-5 w-5 flex items-center justify-center"
                  >
                    <div
                      className={`h-full w-full rounded-sm border-2 flex items-center justify-center transition ${
                        agreePrivacy ? "border-blue-500" : "border-gray-400"
                      }`}
                    >
                      {agreePrivacy && (
                        <Check className="h-3 w-3 text-blue-500" />
                      )}
                    </div>
                  </button>
                  <p className="text-[11px] md:text-xs text-gray-700 leading-snug">
                    Saya menyetujui{" "}
                    <span className="font-semibold text-blue-600">
                      kebijakan privasi
                    </span>{" "}
                    dan penggunaan data dalam aplikasi{" "}
                    <span className="font-semibold">SIDALEKAS</span>.
                  </p>
                </div>

                {/* Tombol daftar */}
                <button
                  type="submit"
                  className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-md hover:opacity-95 transition font-semibold text-sm"
                >
                  <UserPlus size={18} />
                  Daftar Akun
                </button>

                {/* Tombol masuk */}
               <Link
                to="/login"
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} /> Masuk
              </Link>
              </form>
            </div>

            <div className="mt-6 text-[11px] text-center text-gray-500">
              © Dinas Sosial Kabupaten Indramayu {new Date().getFullYear()}
            </div>
          </div>

          {/* PANEL KANAN – dikembalikan */}
          <div className="flex h-full order-last lg:order-none mt-6 lg:mt-0">
            <div className="flex flex-col justify-start py-7 pl-2 pr-2 md:pl-8 md:pr-4 text-left text-gray-800 w-full">
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
                <div className="flex gap-3 rounded-xl bg-white/40 border border-white/60 shadow-sm px-3 py-3">
                  <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      Registrasi Akun Sidalekas
                    </h3>
                    <p className="text-[13px] md:text-sm text-gray-600">
                      Akun lembaga didaftarkan dan diverifikasi oleh Dinas Sosial
                      Kabupaten/Kota sebelum dapat mengakses SIDALEKAS.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-xl bg-white/40 border border-white/60 shadow-sm px-3 py-3">
                  <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      Pendaftaran Lembaga
                    </h3>
                    <p className="text-[13px] md:text-sm text-gray-600">
                      Pengurus mengisi biodata lengkap lembaga sebagai dasar pengajuan
                      verifikasi dan penetapan status LKS.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-xl bg-white/40 border border-white/60 shadow-sm px-3 py-3">
                  <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                    <ClipboardCheck size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      Verifikasi oleh Dinas Sosial
                    </h3>
                    <p className="text-[13px] md:text-sm text-gray-600">
                      Dinas Sosial melakukan validasi data dan kunjungan lapangan sebelum
                      menetapkan status verifikasi lembaga.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-xl bg-white/40 border border-white/60 shadow-sm px-3 py-3">
                  <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                    <Database size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      Lembaga Mengelola Data
                    </h3>
                    <p className="text-[13px] md:text-sm text-gray-600">
                      Setelah disetujui, lembaga dapat memperbarui data, pelaporan, dan
                      monitoring program sosial secara berkala.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* PANEL KANAN END */}
        </div>
      </div>
    </div>
  );
};

export default Register;
