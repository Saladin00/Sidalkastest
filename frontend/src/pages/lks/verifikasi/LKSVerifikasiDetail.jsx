import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, FileImage } from "lucide-react";
import api from "../../../utils/api";

const LKSVerifikasiDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await api.get(`/lks/verifikasi/${id}`);
      const result = res.data?.data;

      // ✅ Pastikan foto_bukti bisa dibaca baik dari JSON string, array string, atau array objek
      if (typeof result.foto_bukti === "string") {
        try {
          result.foto_bukti = JSON.parse(result.foto_bukti);
        } catch {
          result.foto_bukti = [];
        }
      }

      if (!Array.isArray(result.foto_bukti)) {
        result.foto_bukti = [];
      }

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

  // ✅ Warna status
  const statusClass =
    data.status === "valid"
      ? "bg-green-100 text-green-700 border-green-200"
      : data.status === "tidak_valid"
      ? "bg-red-100 text-red-700 border-red-200"
      : "bg-yellow-100 text-yellow-700 border-yellow-200";

  return (
    <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-xl shadow-md p-6">
      {/* ====== HEADER ====== */}
      <h2 className="text-xl font-semibold text-slate-800 mb-6">
        Detail Verifikasi
      </h2>

      {/* ====== INFO TABEL ====== */}
      <div className="border border-slate-200 rounded-lg overflow-hidden mb-6">
        <div className="divide-y divide-slate-200 text-sm">
          {/* 1 */}
          <div className="flex bg-slate-50">
            <div className="w-52 font-semibold text-slate-700 px-4 py-3 border-r">
              1. Tanggal Verifikasi
            </div>
            <div className="flex-1 px-4 py-3">
              {data.tanggal_verifikasi
                ? new Date(data.tanggal_verifikasi).toLocaleString("id-ID")
                : "-"}
            </div>
          </div>

          {/* 2 */}
          <div className="flex">
            <div className="w-52 font-semibold text-slate-700 px-4 py-3 border-r">
              2. Petugas Verifikasi
            </div>
            <div className="flex-1 px-4 py-3">{data.petugas?.name || "-"}</div>
          </div>

          {/* 3 */}
          <div className="flex bg-slate-50">
            <div className="w-52 font-semibold text-slate-700 px-4 py-3 border-r">
              3. Status
            </div>
            <div className="flex-1 px-4 py-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusClass}`}
              >
                {data.status?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* 4 */}
          <div className="flex">
            <div className="w-52 font-semibold text-slate-700 px-4 py-3 border-r">
              4. Penilaian
            </div>
            <div className="flex-1 px-4 py-3">
              {data.penilaian || (
                <span className="italic text-slate-500">
                  Menunggu review dari operator kecamatan.
                </span>
              )}
            </div>
          </div>

          {/* 5 */}
          <div className="flex bg-slate-50">
            <div className="w-52 font-semibold text-slate-700 px-4 py-3 border-r">
              5. Catatan
            </div>
            <div className="flex-1 px-4 py-3">{data.catatan || "-"}</div>
          </div>
        </div>
      </div>

      {/* ====== FOTO BUKTI ====== */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">
          Dokumen / Foto Bukti
        </h3>

        {data.foto_bukti?.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {data.foto_bukti.map((foto, i) => {
              const src = foto.url || foto; // handle dua jenis data
              return (
                <a
                  key={i}
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                >
                  <img
                    src={src}
                    alt={`Foto ${i + 1}`}
                    className="object-cover w-full h-36 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition"></div>
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

      {/* ====== TOMBOL KEMBALI ====== */}
      <div className="pt-3">
        <Link
          to="/lks/verifikasi"
          className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 
          text-gray-700 px-4 py-2 rounded-md text-sm transition shadow-sm"
        >
          <ArrowLeft size={16} /> Kembali
        </Link>
      </div>
    </div>
  );
};

export default LKSVerifikasiDetail;