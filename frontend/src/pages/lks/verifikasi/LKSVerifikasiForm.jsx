// src/pages/lks/verifikasi/LKSVerifikasiForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Upload, AlertTriangle, Trash2 } from "lucide-react";
import api from "../../../utils/api";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { showSuccess, showError, showInfo } from "../../../utils/toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LKSVerifikasiForm = () => {
  const [catatan, setCatatan] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lksData, setLksData] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [fileError, setFileError] = useState("");

  const navigate = useNavigate();

  // 🔹 Ambil data LKS login
  const loadLKSData = async () => {
    try {
      const res = await api.get("/lks/me");
      setLksData(res.data.data);
    } catch {
      showError("Gagal mengambil data LKS. Pastikan profil sudah dilengkapi.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadLKSData();
  }, []);

  // 🔹 Tambah file (append), validasi 5 file & 5MB
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    const combined = [...files, ...selected];

    if (combined.length > 5) {
      setFileError("Maksimal 5 file yang dapat diupload.");
      showError("Maksimal 5 file yang dapat diupload.");
      return;
    }

    const oversized = combined.filter((f) => f.size > 5 * 1024 * 1024);
    if (oversized.length > 0) {
      setFileError("Ukuran file tidak boleh melebihi 5MB per file.");
      showError("Ukuran file tidak boleh melebihi 5MB per file.");
      return;
    }

    setFileError("");
    setFiles(combined);
  };

  // 🔹 Hapus file
  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    showInfo("File bukti dihapus.");
  };

  // 🔹 Kirim form dengan konfirmasi SweetAlert
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || fileError) return;

    const result = await Swal.fire({
      title: "Kirim Pengajuan Verifikasi?",
      text: "Pastikan semua data dan dokumen sudah benar sebelum dikirim.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Kirim",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      showInfo("Pengajuan dibatalkan.");
      return;
    }

    const formData = new FormData();
    formData.append("catatan", catatan);
    files.forEach((file, i) => formData.append(`foto_bukti[${i}]`, file));

    try {
      setLoading(true);
      await api.post("/lks/verifikasi/pengajuan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        title: "Berhasil!",
        text: "Pengajuan berhasil dikirim.",
        icon: "success",
        confirmButtonColor: "#16a34a",
        confirmButtonText: "OK",
      }).then(() => navigate("/lks/verifikasi"));
    } catch {
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat mengirim pengajuan.",
        icon: "error",
        confirmButtonColor: "#e02424",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="flex justify-center items-center py-20 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Memuat data...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-lg rounded-xl p-6">
      {/* ======== JUDUL ======== */}
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">
        Form Pengajuan Verifikasi
      </h2>

      {/* ======== INFORMASI LKS ======== */}
      <div className="border border-gray-200 rounded-lg shadow-sm mb-6 overflow-hidden">
        <div className="bg-gray-50 p-3 border-b text-sm font-semibold text-gray-700">
          Informasi Pengajuan
        </div>

        <div className="divide-y divide-gray-200">
          {[
            ["Nama LKS", lksData?.nama],
            ["Jenis Layanan", lksData?.jenis_layanan],
            ["Petugas Verifikasi", "Belum ditugaskan"],
            ["Tanggal Pengajuan", new Date().toLocaleString("id-ID")],
            ["Status", "MENUNGGU"],
          ].map((row, index) => (
            <div key={index} className="flex p-3 text-sm">
              <div className="w-56 font-semibold text-gray-700">
                {index + 1}. {row[0]}
              </div>
              <div className="flex-1">
                {row[0] === "Status" ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-300">
                    MENUNGGU
                  </span>
                ) : (
                  row[1] || "-"
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======== FORM ======== */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* CATATAN */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catatan Tambahan
          </label>
          <textarea
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
            placeholder="Tambahkan catatan (opsional)..."
          />
        </div>

        {/* FILE UPLOAD */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dokumen / Foto Bukti
          </label>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg p-2
            file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0
            file:bg-sky-600 file:text-white hover:file:bg-sky-700"
          />

          <p className="text-xs text-gray-500 mt-1">
            Maksimal 5 file, ukuran maksimal <strong>5MB</strong> per file.
          </p>

          {fileError && (
            <p className="text-red-600 text-xs flex items-center gap-1 mt-2">
              <AlertTriangle size={14} /> {fileError}
            </p>
          )}

          {/* PREVIEW FILE + NAMA FILE */}
          {files.length > 0 && (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="relative group border border-slate-300 rounded-lg overflow-hidden bg-gray-50"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${i}`}
                    className="object-cover w-full h-32"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(i)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="p-1.5 text-xs text-center text-gray-600 border-t truncate bg-white">
                    {file.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ======== BUTTON AREA ======== */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={() => navigate("/lks/verifikasi")}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-base font-semibold px-6 py-3 rounded-lg shadow-lg transition"
          >
            <ArrowLeft size={18} /> Kembali
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-base font-semibold px-6 py-3 rounded-lg shadow-lg transition"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Mengirim...
              </>
            ) : (
              <>
                <Upload size={18} /> Kirim Pengajuan
              </>
            )}
          </button>
        </div>
      </form>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar
        newestOnTop
        theme="light"
      />
    </div>
  );
};

export default LKSVerifikasiForm;
