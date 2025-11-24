// src/pages/petugas/verifikasi/PetugasVerifikasiForm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import api from "../../../utils/api";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "sweetalert2/dist/sweetalert2.min.css";
import "react-toastify/dist/ReactToastify.css";

const PetugasVerifikasiForm = () => {
  const [lksList, setLksList] = useState([]);
  const [selectedLks, setSelectedLks] = useState("");
  const [penilaian, setPenilaian] = useState("");
  const [catatan, setCatatan] = useState("");
  const [foto, setFoto] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadLKS = async () => {
    try {
      const res = await api.get("/lks");
      setLksList(res.data?.data ?? []);
    } catch {
      toast.error("Gagal memuat daftar LKS.", { autoClose: 2500 });
    }
  };

  const handleFileChange = (e) => {
    setFoto([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLks) {
      toast.warning("Pilih LKS terlebih dahulu!", { autoClose: 2500 });
      return;
    }

    const confirm = await Swal.fire({
      title: "Kirim Verifikasi?",
      text: "Pastikan data dan foto bukti sudah benar sebelum dikirim.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Kirim",
      cancelButtonText: "Batal",
      confirmButtonColor: "#0284c7",
      cancelButtonColor: "#6b7280",
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("lks_id", selectedLks);
      formData.append("status", "menunggu");
      formData.append("penilaian", penilaian);
      formData.append("catatan", catatan);
      foto.forEach((file, i) => formData.append(`foto_bukti[${i}]`, file));

      await api.post("/petugas/verifikasi", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Verifikasi berhasil dikirim!", { autoClose: 2500 });
      setTimeout(() => navigate("/petugas/verifikasi"), 2000);
    } catch (err) {
      console.error("❌ Gagal kirim verifikasi:", err.response?.data || err);
      toast.error(
        `Gagal menyimpan verifikasi: ${
          err.response?.data?.message || "Terjadi kesalahan."
        }`,
        { autoClose: 3000 }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLKS();
  }, []);

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-slate-200">
      <h2 className="text-2xl font-semibold mb-6 text-sky-800 border-b pb-2">
        Tambah Verifikasi Lapangan
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Pilih LKS */}
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700">
            Pilih LKS
          </label>
          <select
            value={selectedLks}
            onChange={(e) => setSelectedLks(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="">-- Pilih LKS --</option>
            {lksList.map((lks) => (
              <option key={lks.id} value={lks.id}>
                {lks.nama}
              </option>
            ))}
          </select>
        </div>

        {/* Penilaian */}
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700">
            Penilaian
          </label>
          <textarea
            value={penilaian}
            onChange={(e) => setPenilaian(e.target.value)}
            rows="3"
            placeholder="Tuliskan hasil survei lapangan..."
            className="border border-slate-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
          ></textarea>
        </div>

        {/* Catatan */}
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700">
            Catatan (Opsional)
          </label>
          <textarea
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            rows="3"
            placeholder="Tambahkan catatan tambahan..."
            className="border border-slate-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
          ></textarea>
        </div>

        {/* Upload Foto */}
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700">
            Upload Foto Bukti
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="border border-slate-300 rounded-lg px-3 py-2 w-full text-sm file:mr-4 file:py-1.5 file:px-3 file:border-0 file:rounded-md file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 transition"
          />
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => navigate("/petugas/verifikasi")}
            className="flex items-center gap-2 border border-slate-300 text-slate-600 px-4 py-2 rounded-md text-sm hover:bg-slate-100 transition"
          >
            <ArrowLeft size={16} /> Batal
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-md text-sm shadow transition disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Simpan
          </button>
        </div>
      </form>

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

export default PetugasVerifikasiForm;
