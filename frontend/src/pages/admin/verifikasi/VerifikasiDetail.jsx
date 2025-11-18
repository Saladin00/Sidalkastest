import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../utils/api";
import { Loader2, ArrowLeft } from "lucide-react";

const VerifikasiDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await api.get(`/admin/verifikasi/${id}`);
      setData(res.data?.data || null);
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

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Detail Verifikasi – {data.lks?.nama || "LKS"}
        </h2>
        <Link
          to="/admin/verifikasi"
          className="flex items-center text-slate-600 hover:text-sky-600 text-sm"
        >
          <ArrowLeft size={16} className="mr-1" /> Kembali
        </Link>
      </div>

      <div className="space-y-4 text-sm">
        <p>
          <strong>Petugas:</strong> {data.petugas?.name || "-"}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`font-semibold ${
              data.status === "valid"
                ? "text-green-600"
                : data.status === "tidak_valid"
                ? "text-red-600"
                : data.status === "proses_survei"
                ? "text-blue-600"
                : "text-yellow-600"
            }`}
          >
            {data.status?.toUpperCase() || "-"}
          </span>
        </p>
        <p>
          <strong>Tanggal Verifikasi:</strong>{" "}
          {data.tanggal_verifikasi
            ? new Date(data.tanggal_verifikasi).toLocaleString("id-ID")
            : "-"}
        </p>
        <p>
          <strong>Penilaian:</strong> {data.penilaian || "-"}
        </p>
        <p>
          <strong>Catatan Petugas:</strong> {data.catatan || "-"}
        </p>

        <div>
          <strong>Foto Bukti:</strong>
          {Array.isArray(data.foto_bukti) && data.foto_bukti.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
              {data.foto_bukti.map((foto, i) => (
                <img
                  key={i}
                  src={foto.url || foto}
                  alt={`Foto-${i}`}
                  className="w-full h-32 object-cover border rounded-md"
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic mt-1">Tidak ada foto bukti.</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Link
          to={`/admin/verifikasi/review/${id}`}
          className="bg-sky-600 text-white px-4 py-2 rounded-md text-sm hover:bg-sky-700"
        >
          Lanjut ke Review
        </Link>
      </div>
    </div>
  );
};

export default VerifikasiDetail;
