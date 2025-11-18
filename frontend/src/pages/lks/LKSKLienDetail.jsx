import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { ArrowLeft, Loader2 } from "lucide-react";

const KlienDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [klien, setKlien] = useState(null);

  useEffect(() => {
    const fetchKlien = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/klien/${id}`);
        setKlien(res.data.data || res.data);
      } catch (err) {
        console.error("❌ Gagal memuat data klien:", err);
        alert("Gagal memuat data klien.");
      } finally {
        setLoading(false);
      }
    };
    fetchKlien();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-16 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Memuat detail klien...
      </div>
    );

  if (!klien)
    return (
      <div className="text-center py-10 text-gray-500 italic">
        Data klien tidak ditemukan.
      </div>
    );

  const renderStatusBadge = (status) => {
    const isActive = status?.toLowerCase() === "aktif";
    const colorClass = isActive
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : "bg-rose-100 text-rose-700 border-rose-200";
    return (
      <span
        className={`px-2.5 py-1 text-xs font-medium rounded-full border ${colorClass}`}
      >
        {status || "-"}
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl border border-gray-100 p-8 mt-6">
      {/* Judul */}
      <h1 className="text-2xl font-bold text-gray-800 mb-1">
        Detail Klien: {klien.nama}
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Data hasil input oleh LKS terkait.
      </p>

      {/* Grid detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "NIK", value: klien.nik },
          { label: "Nama", value: klien.nama },
          { label: "Alamat", value: klien.alamat },
          { label: "Kelurahan", value: klien.kelurahan },
          { label: "Kecamatan", value: klien.kecamatan?.nama },
          { label: "Jenis Kebutuhan", value: klien.jenis_kebutuhan },
          { label: "Status Bantuan", value: klien.status_bantuan },
          { label: "Status Pembinaan", value: renderStatusBadge(klien.status_pembinaan) },
        ].map((item, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-sky-50 transition"
          >
            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
              {i + 1}. {item.label}
            </p>
            <p className="text-gray-800 font-semibold text-sm">
              {item.value || <span className="text-gray-400">Belum diisi</span>}
            </p>
          </div>
        ))}
      </div>

      {/* Tombol kembali di bawah kiri */}
      <div className="flex justify-start mt-10">
        <button
          onClick={() => navigate("/lks/klien")}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium transition"
        >
          <ArrowLeft size={16} /> Kembali
        </button>
      </div>
    </div>
  );
};

export default KlienDetail;
