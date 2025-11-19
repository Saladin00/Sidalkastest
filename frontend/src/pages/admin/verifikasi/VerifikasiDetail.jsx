import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../utils/api";
import { Loader2, ArrowLeft, FileCheck2 } from "lucide-react";

const VerifikasiDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await api.get(`/admin/verifikasi/${id}`);
      const detail = res.data?.data || null;

      let fotoList = [];
      if (detail?.foto_bukti) {
        if (typeof detail.foto_bukti === "string") {
          try {
            fotoList = JSON.parse(detail.foto_bukti);
          } catch {
            fotoList = [detail.foto_bukti];
          }
        } else if (Array.isArray(detail.foto_bukti)) {
          fotoList = detail.foto_bukti;
        }
      }

      setData({ ...detail, foto_bukti: fotoList });
    } catch (err) {
      console.error("❌ Gagal ambil detail verifikasi:", err);
      alert("Gagal memuat data verifikasi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-20 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Memuat detail verifikasi...
      </div>
    );

  if (!data)
    return (
      <div className="text-center py-10 text-gray-500">
        Data verifikasi tidak ditemukan.
      </div>
    );

  const formatTanggal = (tgl) => {
    if (!tgl) return "-";
    const date = new Date(tgl);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }) + ` pukul ${date.toLocaleTimeString("id-ID")}`;
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 shadow-xl rounded-2xl p-10 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-100/40 rounded-full blur-3xl -z-10 translate-x-20 -translate-y-10"></div>

      {/* Header */}
      <div className="mb-8 border-b pb-5">
        <h2 className="text-2xl font-semibold text-sky-900 flex items-center gap-2">
          <FileCheck2 className="text-sky-600" size={24} />
          Detail Verifikasi – {data.lks?.nama || "LKS"}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Ringkasan hasil verifikasi dan catatan petugas terhadap lembaga.
        </p>
      </div>

      {/* Informasi Utama */}
      <div className="space-y-4 text-[15px] text-slate-700">
        {/* GRID INFORMASI */}
        <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-slate-50/30 shadow-sm">
          {/* Petugas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 sm:p-4">
            <p className="font-semibold text-slate-600">1. Petugas</p>
            <p className="text-slate-800">{data.petugas?.name || "-"}</p>
          </div>

          {/* Tanggal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 sm:p-4">
            <p className="font-semibold text-slate-600">2. Tanggal Verifikasi</p>
            <p className="text-slate-800">{formatTanggal(data.tanggal_verifikasi)}</p>
          </div>

          {/* Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 sm:p-4 items-center">
            <p className="font-semibold text-slate-600">3. Status</p>
            <span
              className={`inline-block font-semibold uppercase px-3 py-1 rounded-full text-xs tracking-wide text-center w-fit ${
                data.status === "valid"
                  ? "bg-green-100 text-green-700"
                  : data.status === "tidak_valid"
                  ? "bg-red-100 text-red-700"
                  : data.status === "proses_survei"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {data.status || "-"}
            </span>
          </div>

          {/* Penilaian */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 sm:p-4">
            <p className="font-semibold text-slate-600">4. Penilaian</p>
            <p className="text-slate-800">{data.penilaian || "-"}</p>
          </div>

          {/* Catatan */}
          <div className="grid grid-cols-1 p-3 sm:p-4">
            <p className="font-semibold text-slate-600 mb-2">5. Catatan Petugas</p>
            <div className="bg-gradient-to-r from-slate-50 to-sky-50 border border-slate-200 rounded-lg p-4 text-slate-700 shadow-inner text-sm">
              {data.catatan || <i className="text-slate-400">Tidak ada catatan.</i>}
            </div>
          </div>
        </div>

        {/* Foto Bukti */}
        <div className="mt-8">
          <h3 className="text-slate-700 font-semibold mb-3">6. Foto Bukti</h3>
          {data.foto_bukti?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {data.foto_bukti.map((foto, i) => (
                <a
                  key={i}
                  href={foto.url || foto}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                >
                  <img
                    src={foto.url || foto}
                    alt={`Foto-${i}`}
                    className="w-full h-40 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition"></div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic mt-1">Tidak ada foto bukti.</p>
          )}
        </div>
      </div>

      {/* Tombol */}
      <div className="mt-10 flex justify-between items-center">
        <Link
          to="/admin/verifikasi"
          className="flex items-center gap-2 bg-slate-100 text-slate-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-200 transition shadow-sm"
        >
          <ArrowLeft size={16} /> Kembali
        </Link>

        <Link
          to={`/admin/verifikasi/review/${id}`}
          className="relative group px-8 py-3 rounded-lg text-sm font-semibold text-white shadow-md bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 transition-all overflow-hidden"
        >
          <span className="relative z-10 text-base tracking-wide">
            Lanjut ke Review
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
        </Link>
      </div>
    </div>
  );
};

export default VerifikasiDetail;
