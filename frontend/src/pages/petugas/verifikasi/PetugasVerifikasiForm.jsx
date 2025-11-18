// src/pages/petugas/verifikasi/PetugasVerifikasiForm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import api from "../../../utils/api";

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
      alert("Gagal memuat daftar LKS.");
    }
  };

  const handleFileChange = (e) => {
    setFoto([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLks) {
      alert("Pilih LKS terlebih dahulu!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("lks_id", selectedLks);
      formData.append("status", "menunggu"); // ✅ default status
      formData.append("penilaian", penilaian);
      formData.append("catatan", catatan);
      foto.forEach((file, i) => formData.append(`foto_bukti[${i}]`, file));

      await api.post("/petugas/verifikasi", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Verifikasi berhasil dikirim!");
      navigate("/petugas/verifikasi");
    } catch (err) {
      console.error("❌ Gagal kirim verifikasi:", err.response?.data || err);
      alert(
        `Gagal menyimpan verifikasi: ${
          err.response?.data?.message || "Terjadi kesalahan."
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLKS();
  }, []);

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md p-6 border border-slate-200">
      <h2 className="text-lg font-semibold mb-4 text-slate-800">
        Tambah Verifikasi Lapangan
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Pilih LKS</label>
          <select
            value={selectedLks}
            onChange={(e) => setSelectedLks(e.target.value)}
            className="border rounded-md px-3 py-2 w-full text-sm"
          >
            <option value="">-- Pilih LKS --</option>
            {lksList.map((lks) => (
              <option key={lks.id} value={lks.id}>
                {lks.nama}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Penilaian</label>
          <textarea
            value={penilaian}
            onChange={(e) => setPenilaian(e.target.value)}
            rows="3"
            className="border rounded-md px-3 py-2 w-full text-sm"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Catatan</label>
          <textarea
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            rows="3"
            className="border rounded-md px-3 py-2 w-full text-sm"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Upload Foto Bukti
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="border rounded-md px-3 py-2 w-full text-sm"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate("/petugas/verifikasi")}
            className="border border-slate-300 text-slate-600 px-4 py-2 rounded-md text-sm hover:bg-slate-100"
          >
            <ArrowLeft size={16} className="inline mr-1" /> Batal
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md text-sm"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin inline mr-2" />
            ) : (
              <Save size={16} className="inline mr-2" />
            )}
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
};

export default PetugasVerifikasiForm;
