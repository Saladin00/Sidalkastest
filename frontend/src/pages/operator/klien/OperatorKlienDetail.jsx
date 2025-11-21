import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, User } from "lucide-react";
import api from "../../../utils/api";

export default function OperatorKlienDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [klien, setKlien] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ambil detail klien
  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem("token");
        const res = await api.get(`/klien/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setKlien(res.data?.data || res.data);
      } catch (error) {
        console.error("❌ Gagal mengambil detail klien:", error);
        alert("Gagal memuat detail klien");
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

  const fields = [
    { label: "NIK", value: klien.nik },
    { label: "Nama", value: klien.nama },
    { label: "Alamat", value: klien.alamat },
    { label: "Kelurahan", value: klien.kelurahan },
    { label: "Kecamatan", value: klien.kecamatan?.nama },
    { label: "LKS Penanggung Jawab", value: klien.lks?.nama },
    { label: "Jenis Kebutuhan", value: klien.jenis_kebutuhan },
    { label: "Status Bantuan", value: klien.status_bantuan },
    { label: "Status Pembinaan", value: renderStatusBadge(klien.status_pembinaan) },
  ];

  return (
    <div className="relative max-w-5xl mx-auto my-10 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Accent Background */}
      <div className="absolute -top-20 right-10 w-96 h-96 bg-sky-100/50 rounded-full blur-3xl -z-10"></div>

      {/* HEADER */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white p-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full shadow-lg">
            <User size={42} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wide">
              Detail Klien: {klien.nama}
            </h1>
            <p className="text-sm text-blue-100 mt-1">
              Data hasil input oleh LKS dan diverifikasi oleh Operator
            </p>
          </div>
        </div>
      </div>

      {/* DETAIL SECTION */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field, i) => (
            <div
              key={i}
              className="p-5 rounded-xl border border-gray-100 bg-gray-50 shadow-sm hover:shadow-md hover:bg-sky-50 transition-all duration-200"
            >
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                {i + 1}. {field.label}
              </p>
              <p className="text-gray-800 font-semibold text-sm">
                {field.value || (
                  <span className="text-gray-400 italic">Belum diisi</span>
                )}
              </p>
            </div>
          ))}
        </div>

        {/* TERAKHIR DIPERBARUI */}
        <div className="mt-10 border-t pt-4 text-sm text-gray-600">
          <p className="text-gray-500 mb-1">Diperbarui Terakhir</p>
          <p className="font-semibold text-slate-700">
            {klien.updated_at
              ? new Date(klien.updated_at).toLocaleString("id-ID")
              : "-"}
          </p>
        </div>

        {/* TOMBOL KEMBALI */}
        <div className="flex justify-start mt-10">
          <button
            onClick={() => navigate("/operator/klien")}
            className="flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium shadow-md transition-all"
          >
            <ArrowLeft size={16} />
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
