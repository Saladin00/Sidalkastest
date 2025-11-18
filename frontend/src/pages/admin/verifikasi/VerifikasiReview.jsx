import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { Loader2, ArrowLeft, CheckCircle, XCircle } from "lucide-react";

const VerifikasiReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("menunggu");
  const [catatan, setCatatan] = useState("");

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
    if (!window.confirm("Yakin ingin menyimpan hasil review ini?")) return;
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
    <div className="max-w-3xl mx-auto bg-white shadow-md border border-slate-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Review Verifikasi LKS
        </h2>
        <Link
          to={`/admin/verifikasi/detail/${id}`}
          className="flex items-center text-slate-600 hover:text-sky-600 text-sm"
        >
          <ArrowLeft size={16} className="mr-1" /> Kembali
        </Link>
      </div>

      <div className="bg-slate-50 border rounded-md p-4 mb-6 text-sm text-slate-700">
        <p><strong>Nama LKS:</strong> {data.lks?.nama || "-"}</p>
        <p><strong>Petugas:</strong> {data.petugas?.name || "-"}</p>
        <p><strong>Status Saat Ini:</strong> {data.status?.toUpperCase() || "-"}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Ubah Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded-md px-3 py-2 w-full text-sm"
          >
            <option value="menunggu">⏳ Menunggu</option>
            <option value="valid">✅ Valid</option>
            <option value="tidak_valid">❌ Tidak Valid</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Catatan Admin</label>
          <textarea
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Tuliskan catatan hasil review..."
            className="border rounded-md px-3 py-2 w-full text-sm"
            rows="4"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Link
            to={`/admin/verifikasi/detail/${id}`}
            className="border border-slate-300 text-slate-600 px-4 py-2 rounded-md text-sm hover:bg-slate-100"
          >
            Batal
          </Link>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className={`px-4 py-2 rounded-md text-sm text-white flex items-center gap-1 ${
              saving
                ? "bg-slate-400 cursor-not-allowed"
                : status === "valid"
                ? "bg-green-600 hover:bg-green-700"
                : status === "tidak_valid"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-slate-600 hover:bg-slate-700"
            }`}
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : status === "valid" ? (
              <CheckCircle size={16} />
            ) : status === "tidak_valid" ? (
              <XCircle size={16} />
            ) : null}
            {saving ? "Menyimpan..." : "Simpan Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifikasiReview;
