import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { ArrowLeft, Loader2, User } from "lucide-react";
import { showInfo, showSuccess, showError } from "../../../utils/toast";
import { ToastContainer } from "react-toastify";

const KlienDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [klien, setKlien] = useState(null);

  useEffect(() => {
    const fetchKlien = async () => {
      try {
        showInfo("Memuat detail klien...");
        const res = await api.get(`/klien/${id}`);
        setKlien(res.data.data);
        showSuccess("Data klien berhasil dimuat!");
      } catch (err) {
        showError("Gagal memuat data klien!");
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
    return <div className="text-center py-10 text-gray-500">Data tidak ditemukan.</div>;

  const renderStatusBadge = (status) => {
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          status === "aktif"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-rose-100 text-rose-700"
        }`}
      >
        {status}
      </span>
    );
  };

  const infoList = [
    { label: "NIK", value: klien.nik },
    { label: "Nama", value: klien.nama },
    { label: "Jenis Kelamin", value: klien.jenis_kelamin },
    { label: "Alamat", value: klien.alamat },
    { label: "Kelurahan", value: klien.kelurahan },
    { label: "Kecamatan", value: klien.kecamatan?.nama },
    { label: "Jenis Bantuan", value: klien.jenis_bantuan },
    { label: "Kelompok Umur", value: klien.kelompok_umur },
    { label: "Status Pembinaan", value: renderStatusBadge(klien.status_pembinaan) },
  ];

  return (
    <div className="relative max-w-5xl mx-auto my-10 bg-white rounded-2xl shadow-2xl border overflow-hidden">
      <div className="absolute -top-20 right-10 w-96 h-96 bg-sky-100/50 rounded-full blur-3xl -z-10"></div>

      <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white p-8 flex items-center gap-4">
        <div className="bg-white/20 p-3 rounded-full">
          <User size={42} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Detail Klien: {klien.nama}</h1>
          <p className="text-blue-100 text-sm">Data klien hasil input LKS</p>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {infoList.map((item, i) => (
            <div
              key={i}
              className="p-5 bg-gray-50 rounded-xl border shadow-sm hover:bg-sky-50 transition"
            >
              <p className="text-xs text-gray-500 uppercase mb-1 font-semibold">
                {item.label}
              </p>
              <p className="text-gray-800 text-sm font-semibold">{item.value || "-"}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-start mt-10">
          <button
            onClick={() => navigate("/lks/klien")}
            className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Kembali
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default KlienDetail;
