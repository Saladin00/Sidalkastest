import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import {
  Loader2,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ClipboardList,
  AlertCircle,
} from "lucide-react";

const VerifikasiReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("menunggu");
  const [catatan, setCatatan] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const res = await api.get(`/admin/verifikasi/${id}`);
      const detail = res.data?.data;
      setData(detail);
      setStatus(detail?.status || "menunggu");
      setCatatan(detail?.catatan || "");
    } catch (err) {
      console.error("❌ Gagal ambil detail verifikasi:", err);
      alert("Gagal memuat data verifikasi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!status) {
      setError("Silakan pilih status verifikasi terlebih dahulu.");
      return;
    }
    if (!catatan.trim()) {
      setError("Catatan tidak boleh kosong. Mohon isi alasan atau penjelasan review.");
      return;
    }

    const confirmSave = window.confirm(
      "Apakah Anda yakin ingin menyimpan hasil review ini?"
    );
    if (!confirmSave) return;

    setError("");
    setSaving(true);
    try {
      await api.put(`/admin/verifikasi/${id}/status`, { status, catatan });
      alert("✅ Status verifikasi berhasil diperbarui!");
      navigate("/admin/verifikasi");
    } catch (err) {
      console.error("❌ Gagal update status:", err);
      alert("Terjadi kesalahan saat menyimpan hasil review.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-20 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Memuat form review...
      </div>
    );

  if (!data)
    return (
      <div className="text-center py-20 text-gray-500">
        Data verifikasi tidak ditemukan.
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-2xl border border-slate-200 rounded-2xl p-8 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-sky-100/50 rounded-full blur-3xl -z-10 translate-x-20 -translate-y-10"></div>

      {/* Header */}
      <div className="mb-8 border-b pb-4">
        <h2 className="text-2xl font-semibold text-sky-900 flex items-center gap-2">
          <ClipboardList className="text-sky-600" size={24} />
          Review Verifikasi LKS
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Pastikan hasil verifikasi dan catatan admin sudah akurat sebelum disimpan.
        </p>
      </div>

      {/* Info LKS */}
      <div className="bg-gradient-to-r from-slate-50 to-sky-50 border border-slate-200 rounded-xl p-5 mb-8">
        <div className="grid sm:grid-cols-2 gap-y-3 text-[15px] text-slate-700">
          <div>
            <p className="font-semibold text-slate-600 mb-1">Nama LKS</p>
            <p className="bg-white border border-slate-200 rounded-md px-3 py-2 shadow-inner">
              {data.lks?.nama || "-"}
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-600 mb-1">Petugas</p>
            <p className="bg-white border border-slate-200 rounded-md px-3 py-2 shadow-inner">
              {data.petugas?.name || "Belum Ditugaskan"}
            </p>
          </div>

          <div className="col-span-2 mt-3">
            <p className="font-semibold text-slate-600 mb-1">Status Saat Ini</p>
            <span
              className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase ${
                data.status === "valid"
                  ? "bg-green-100 text-green-700"
                  : data.status === "tidak_valid"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {data.status || "MENUNGGU"}
            </span>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="space-y-6">
        {/* Ubah Status */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Ubah Status
          </label>
          <div className="relative w-full">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full appearance-none bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-700 shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all duration-200
              hover:border-sky-300 hover:shadow-md"
            >
              <option value="">-- Pilih Status --</option>
              <option value="menunggu">Menunggu</option>
              <option value="valid">Valid</option>
              <option value="tidak_valid">Tidak Valid</option>
            </select>

            {/* Custom Arrow */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Catatan Admin */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Catatan Admin
          </label>
          <textarea
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Tuliskan catatan hasil review dengan lengkap dan jelas..."
            className="border border-slate-300 rounded-lg px-4 py-2.5 w-full text-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition min-h-[120px] resize-none bg-white shadow-sm"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}
      </div>

      {/* Tombol */}
      <div className="mt-10 flex justify-between items-center flex-wrap gap-3">
        <Link
          to={`/admin/verifikasi/detail/${id}`}
          className="flex items-center gap-2 bg-slate-100 text-slate-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-200 transition shadow-sm"
        >
          <ArrowLeft size={16} /> Kembali
        </Link>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/verifikasi")}
            className="border border-slate-300 text-slate-600 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-100 transition shadow-sm"
          >
            Batal
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold text-white shadow-md transition flex items-center gap-2 ${
              saving
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
            }`}
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ClipboardList size={16} />
            )}
            {saving ? "Menyimpan..." : "Simpan Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifikasiReview;
