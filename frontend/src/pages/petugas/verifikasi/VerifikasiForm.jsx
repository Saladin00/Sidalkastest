import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createVerifikasi } from "@/services/verifikasiApi";

export default function VerifikasiForm() {
  const { lks_id } = useParams(); // 📌 ambil ID LKS dari URL
  const navigate = useNavigate();

  const [catatan, setCatatan] = useState("");
  const [penilaian, setPenilaian] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    // ✅ Validasi sederhana
    if (!lks_id) return alert("ID LKS tidak ditemukan!");
    if (!penilaian.trim()) return alert("Penilaian wajib diisi.");

    const form = new FormData();
    form.append("lks_id", lks_id);
    form.append("catatan", catatan);
    form.append("penilaian", penilaian);
    for (let i = 0; i < files.length; i++) {
      form.append("foto_bukti[]", files[i]);
    }

    try {
      setLoading(true);
      const res = await createVerifikasi(form);
      alert("✅ Verifikasi berhasil dikirim!");
      navigate("/petugas/verifikasi"); // balik ke daftar
    } catch (err) {
      console.error(err);
      if (err.response?.status === 422) {
        alert("❌ Gagal validasi data! Pastikan semua isian sudah benar.");
      } else if (err.response?.status === 403) {
        alert("🚫 Anda tidak memiliki akses untuk membuat verifikasi ini.");
      } else {
        alert("⚠️ Terjadi kesalahan saat menyimpan verifikasi.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow p-6 rounded-lg">
      <h1 className="text-xl font-bold text-blue-700 mb-4">
        Form Verifikasi Lapangan
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Penilaian */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Penilaian
          </label>
          <textarea
            className="border rounded w-full p-2 text-sm"
            rows="3"
            value={penilaian}
            onChange={(e) => setPenilaian(e.target.value)}
            placeholder="Tuliskan hasil observasi di lapangan..."
            required
          />
        </div>

        {/* Catatan */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Catatan Tambahan
          </label>
          <textarea
            className="border rounded w-full p-2 text-sm"
            rows="3"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Catatan tambahan jika ada..."
          />
        </div>

        {/* Upload Foto */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Upload Foto Lapangan
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            className="block w-full text-sm border p-2 rounded"
            onChange={(e) => setFiles(e.target.files)}
          />
          <p className="text-xs text-gray-500 mt-1">
            * Bisa upload lebih dari satu foto
          </p>
        </div>

        {/* Tombol Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white py-2 rounded ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Menyimpan..." : "Simpan Verifikasi"}
        </button>
      </form>
    </div>
  );
}
