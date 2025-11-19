// src/pages/lks/verifikasi/LKSVerifikasiDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, FileImage } from "lucide-react";
import api from "../../../utils/api";

const LKSVerifikasiDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await api.get(`/lks/verifikasi/${id}`);
      const result = res.data?.data;

      if (typeof result.foto_bukti === "string") {
        try {
          result.foto_bukti = JSON.parse(result.foto_bukti);
        } catch {
          result.foto_bukti = [];
        }
      }
      if (!Array.isArray(result.foto_bukti)) result.foto_bukti = [];
      setData(result);
    } catch (err) {
      console.error("❌ Gagal ambil detail verifikasi:", err);
      alert("Gagal memuat detail verifikasi.");
    } finally {
      setLoading(false);
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
      {/* Card utama */}
      <div className="bg-white shadow-xl rounded-2xl border border-slate-200 p-8 relative overflow-hidden">
        {/* Accent background */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-sky-100/40 rounded-full blur-3xl -z-10 translate-x-16 -translate-y-10"></div>

        {/* Header */}
        <h2 className="text-2xl font-semibold text-sky-900 mb-6">
          Detail Verifikasi
        </h2>

        {/* Detail Table */}
        <div className="overflow-hidden border border-slate-200 rounded-xl">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-200">
              <tr className="bg-slate-50/60">
                <td className="p-4 font-semibold text-slate-700 w-1/3">
                  1. Tanggal Verifikasi
                </td>
                <td className="p-4 text-slate-800">
                  {data.tanggal_verifikasi
                    ? new Date(data.tanggal_verifikasi).toLocaleString("id-ID")
                    : "-"}
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-700">
                  2. Petugas Verifikasi
                </td>
                <td className="p-4 text-slate-800">{data.petugas?.name || "-"}</td>
              </tr>
              <tr className="bg-slate-50/60">
                <td className="p-4 font-semibold text-slate-700">3. Status</td>
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
              <tr>
                <td className="p-4 font-semibold text-slate-700">4. Penilaian</td>
                <td className="p-4 text-slate-800">
                  {data.penilaian || (
                    <span className="italic text-slate-500">
                      Menunggu review dari operator kecamatan.
                    </span>
                  )}
                </td>
              </tr>
              <tr className="bg-slate-50/60">
                <td className="p-4 font-semibold text-slate-700">5. Catatan</td>
                <td className="p-4 text-slate-800">{data.catatan || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Foto Bukti */}
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

        {/* Tombol Kembali */}
        <div className="mt-10">
          <button
            onClick={() => navigate("/lks/verifikasi")}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-base font-semibold px-6 py-3 rounded-lg shadow-lg transition"
          >
            <ArrowLeft size={20} /> Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default LKSVerifikasiDetail;
