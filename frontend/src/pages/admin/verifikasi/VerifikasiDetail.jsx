// src/pages/admin/verifikasi/VerifikasiDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../utils/api";
import { Loader2, ArrowLeft, FileCheck2, FileImage } from "lucide-react";
import {
  showInfo,
  showSuccess,
  showError,
} from "../../../utils/toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifikasiDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    showInfo("Memuat detail verifikasi...");
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
      showSuccess("Detail verifikasi berhasil dimuat!");
    } catch (err) {
      console.error("❌ Gagal ambil detail verifikasi:", err);
      showError("Gagal memuat data verifikasi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const formatTanggal = (tgl) => {
    if (!tgl) return "-";
    const date = new Date(tgl);
    return (
      date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }) + ` pukul ${date.toLocaleTimeString("id-ID")}`
    );
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "menunggu":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "proses_survei":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      case "valid":
        return "bg-green-100 text-green-700 border border-green-300";
      case "tidak_valid":
        return "bg-red-100 text-red-700 border border-red-300";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-300";
    }
  };

  const getNamaFile = (url, index) => {
    const ext = url.split(".").pop()?.toLowerCase() || "";
    const isImage = ["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(ext);
    return isImage ? `Foto ${index + 1}` : `Dokumen ${index + 1}`;
  };

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

  return (
    <div className="max-w-5xl mx-auto bg-white border border-slate-200 shadow-xl rounded-2xl p-10 relative overflow-hidden">
      {/* Accent Background */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-sky-100/40 rounded-full blur-3xl -z-10 translate-x-16 -translate-y-10"></div>

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
      <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-slate-50/30 shadow-sm text-[15px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
          <p className="font-semibold text-slate-600">1. Petugas</p>
          <p className="text-slate-800">{data.petugas?.name || "-"}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
          <p className="font-semibold text-slate-600">2. Tanggal Verifikasi</p>
          <p className="text-slate-800">{formatTanggal(data.tanggal_verifikasi)}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 items-center">
          <p className="font-semibold text-slate-600">3. Status</p>
          <span
            className={`inline-block font-semibold uppercase px-3 py-1.5 rounded-full text-xs tracking-wide ${getStatusStyle(
              data.status
            )}`}
          >
            {data.status || "-"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
          <p className="font-semibold text-slate-600">4. Penilaian</p>
          <p className="text-slate-800">{data.penilaian || "-"}</p>
        </div>

        <div className="grid grid-cols-1 p-4">
          <p className="font-semibold text-slate-600 mb-2">5. Catatan Petugas</p>
          <div className="bg-gradient-to-r from-slate-50 to-sky-50 border border-slate-200 rounded-lg p-4 text-slate-700 shadow-inner text-sm">
            {data.catatan || <i className="text-slate-400">Tidak ada catatan.</i>}
          </div>
        </div>
      </div>

      {/* Dokumen / Foto Bukti */}
      <div className="mt-8">
        <h3 className="text-slate-700 font-semibold mb-3">6. Dokumen / Foto Bukti</h3>
        {data.foto_bukti?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {data.foto_bukti.map((foto, i) => {
              const src = foto.url || foto;
              const namaFile = getNamaFile(src, i);
              return (
                <div
                  key={i}
                  className="border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-white"
                >
                  <a
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={src}
                      alt={namaFile}
                      className="object-cover w-full h-36"
                    />
                  </a>
                  <div
                    className="p-2 border-t text-center bg-slate-50 text-xs text-slate-600 font-medium truncate"
                    title={namaFile}
                  >
                    {namaFile}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-500 text-sm italic flex items-center gap-2">
            <FileImage size={16} /> Tidak ada dokumen atau foto bukti.
          </p>
        )}
      </div>

      {/* Tombol */}
      <div className="mt-10 flex justify-between items-center">
        <Link
          to="/admin/verifikasi"
          className="flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium shadow-md transition-all"
        >
          <ArrowLeft size={16} /> Kembali
        </Link>

        <Link
          to={`/admin/verifikasi/review/${id}`}
          className="relative group px-8 py-3 rounded-lg text-sm font-semibold text-white shadow-md bg-gradient-to-r from-sky-500 to-green-600 hover:from-sky-600 hover:to-green-700 transition-all overflow-hidden"
        >
          <span className="relative z-10 text-base tracking-wide">
            Lanjut ke Review
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
        </Link>
      </div>

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

export default VerifikasiDetail;
