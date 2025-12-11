// src/pages/operator/klien/OperatorKlienDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, User } from "lucide-react";
import api from "../../../utils/api";

export default function OperatorKlienDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [klien, setKlien] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/klien/${id}`);
        setKlien(res.data?.data || res.data);
      } catch (error) {
        console.error("❌ Gagal mengambil detail klien:", error);
        navigate("/operator/klien");
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [id, navigate]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-20 text-gray-500">
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
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          isActive
            ? "bg-emerald-100 text-emerald-700"
            : "bg-rose-100 text-rose-700"
        }`}
      >
        {status || "-"}
      </span>
    );
  };

  // 🔥 FINAL FIELDS — STATUS BANTUAN DIHAPUS, JENIS KEBUTUHAN DIGANTI JENIS BANTUAN
  const fields = [
    { label: "NIK", value: klien.nik },
    { label: "Nama", value: klien.nama },
    { label: "Alamat", value: klien.alamat },
    { label: "Kelurahan", value: klien.kelurahan },
    { label: "Kecamatan", value: klien.kecamatan?.nama },
    { label: "LKS Penanggung Jawab", value: klien.lks?.nama },

    // 🔥 FIX UTAMA
    { label: "Jenis Bantuan", value: klien.jenis_bantuan },

    {
      label: "Status Pembinaan",
      value: renderStatusBadge(klien.status_pembinaan),
    },
  ];

  return (
    <div className="relative max-w-5xl mx-auto my-10 bg-white rounded-2xl shadow-xl border">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white p-8">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full shadow-lg">
            <User size={40} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wide">
              Detail Klien: {klien.nama}
            </h1>
          </div>
        </div>
      </div>

      {/* DETAIL */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field, i) => (
          <div
            key={i}
            className="p-5 rounded-xl border bg-gray-50 shadow-sm"
          >
            <p className="text-xs uppercase text-gray-500 font-semibold mb-1">
              {i + 1}. {field.label}
            </p>
            <p className="text-gray-800 font-semibold text-sm">
              {field.value || <span className="text-gray-400">-</span>}
            </p>
          </div>
        ))}
      </div>

      {/* BUTTON KEMBALI */}
      <div className="p-6">
        <button
          onClick={() => navigate("/operator/klien")}
          className="flex items-center gap-2 px-6 py-2.5 bg-sky-600 text-white rounded-lg shadow hover:bg-sky-700"
        >
          <ArrowLeft size={16} /> Kembali
        </button>
      </div>
    </div>
  );
}
