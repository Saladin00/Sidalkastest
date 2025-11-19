// src/pages/petugas/verifikasi/PetugasVerifikasiDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Check, X, FileImage } from "lucide-react";
import api from "../../../utils/api";

const PetugasVerifikasiDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [penilaian, setPenilaian] = useState("");
  const [catatan, setCatatan] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const res = await api.get(`/petugas/verifikasi/${id}`);
      const result = res.data?.data;

      // pastikan foto_bukti terbaca baik dari string maupun array
      if (typeof result.foto_bukti === "string") {
        try {
          result.foto_bukti = JSON.parse(result.foto_bukti);
        } catch {
          result.foto_bukti = [];
        }
      }
      if (!Array.isArray(result.foto_bukti)) result.foto_bukti = [];

      setData(result);
      setPenilaian(result?.penilaian || "");
      setCatatan(result?.catatan || "");
    } catch (err) {
      console.error("❌ Gagal ambil detail:", err);
      alert("Gagal memuat data verifikasi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (status) => {
    if (!window.confirm(`Kirim hasil survei dan tandai sebagai ${status}?`))
      return;
    try {
      setSubmitting(true);
      await api.put(`/petugas/verifikasi/${id}`, {
        status,
        penilaian,
        catatan,
      });
      alert("✅ Hasil survei berhasil dikirim ke admin!");
      navigate("/petugas/verifikasi");
    } catch (err) {
      console.error("❌ Gagal kirim hasil survei:", err);
      alert("Gagal mengirim hasil survei.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "menunggu":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      case "proses_survei":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "valid":
        return "bg-green-100 text-green-700 border border-green-300";
      case "tidak_valid":
        return "bg-red-100 text-red-700 border border-red-300";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-300";
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Memuat detail verifikasi...
      </div>
    );

  if (!data)
    return (
      <div className="text-center text-gray-400 py-20">
        Data verifikasi tidak ditemukan.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="bg-white shadow-xl rounded-2xl border border-slate-200 p-8 relative overflow-hidden">
        {/* Accent background */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-sky-100/40 rounded-full blur-3xl -z-10 translate-x-16 -translate-y-10"></div>

        {/* Header */}
        <h2 className="text-2xl font-semibold text-sky-900 mb-6">
          Detail & Hasil Survei Verifikasi
        </h2>

        {/* Detail Table */}
        <div className="overflow-hidden border border-slate-200 rounded-xl">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-200">
              <tr className="bg-slate-50/60">
                <td className="p-4 font-semibold text-slate-700 w-1/3">
                  1. Nama LKS
                </td>
                <td className="p-4 text-slate-800">{data.lks?.nama || "-"}</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-700">
                  2. Tanggal Verifikasi
                </td>
                <td className="p-4 text-slate-800">
                  {data.tanggal_verifikasi
                    ? new Date(data.tanggal_verifikasi).toLocaleString("id-ID")
                    : "-"}
                </td>
              </tr>
              <tr className="bg-slate-50/60">
                <td className="p-4 font-semibold text-slate-700">
                  3. Petugas Verifikasi
                </td>
                <td className="p-4 text-slate-800">
                  {data.petugas?.name || "-"}
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-700">4. Status</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusStyle(
                      data.status
                    )}`}
                  >
                    {data.status?.toUpperCase() || "MENUNGGU"}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Hasil Survei Lapangan */}
        <div className="mt-8">
          <h3 className="text-base font-semibold text-slate-800 mb-3 border-b border-slate-200 pb-2">
            Hasil Survei Lapangan
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">
                Penilaian
              </label>
              <textarea
                rows={4}
                value={penilaian}
                onChange={(e) => setPenilaian(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                placeholder="Tuliskan hasil penilaian survei..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">
                Catatan
              </label>
              <textarea
                rows={3}
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                placeholder="Tulis catatan tambahan (opsional)..."
              />
            </div>
          </div>
        </div>

        {/* Dokumen / Foto Bukti */}
        <div className="mt-8">
          <h3 className="text-base font-semibold text-slate-700 mb-3">
            Dokumen / Foto Bukti
          </h3>
          {data.foto_bukti?.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {data.foto_bukti.map((foto, i) => {
                const src = foto.url || foto;
                return (
                  <a
                    key={i}
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
                  >
                    <img
                      src={src}
                      alt={`Foto ${i + 1}`}
                      className="object-cover w-full h-36"
                    />
                  </a>
                );
              })}
            </div>
          ) : (
            <p className="text-slate-500 text-sm italic flex items-center gap-2">
              <FileImage size={16} /> Tidak ada foto atau dokumen bukti.
            </p>
          )}
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-between items-center mt-8 pt-5 border-t border-slate-200">
          <button
            onClick={() => navigate("/petugas/verifikasi")}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-5 py-2.5 rounded-md shadow transition"
          >
            <ArrowLeft size={16} /> Kembali
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => handleSubmit("tidak_valid")}
              disabled={submitting}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-5 py-2.5 rounded-md shadow transition"
            >
              <X size={16} />
              Tandai Tidak Valid
            </button>
            <button
              onClick={() => handleSubmit("valid")}
              disabled={submitting}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-2.5 rounded-md shadow transition"
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Check size={16} />
              )}
              Kirim ke Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetugasVerifikasiDetail;
