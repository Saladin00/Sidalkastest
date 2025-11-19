import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, UserIcon } from "@heroicons/react/24/solid";
import { Loader2 } from "lucide-react";
import api from "../../../utils/api";

export default function OperatorKlienDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [klien, setKlien] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ambil detail klien
  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem("token");
        const res = await api.get(`/klien/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setKlien(res.data.data);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-500">
        <Loader2 size={24} className="animate-spin mr-2" />
        Memuat detail klien...
      </div>
    );
  }

  if (!klien) {
    return (
      <div className="text-center py-10 text-gray-400">
        Data klien tidak ditemukan.
      </div>
    );
  }

  // daftar field seperti admin
  const fields = [
    { label: "NIK", value: klien.nik },
    { label: "Nama", value: klien.nama },
    { label: "Alamat", value: klien.alamat },
    { label: "Kelurahan", value: klien.kelurahan },
    { label: "Kecamatan", value: klien.kecamatan?.nama },
    { label: "LKS Penanggung Jawab", value: klien.lks?.nama },
    { label: "Jenis Kebutuhan", value: klien.jenis_kebutuhan },
    { label: "Status Bantuan", value: klien.status_bantuan },
    {
      label: "Status Pembinaan",
      value: (
        <span
          className={`px-3 py-1 text-xs rounded-full font-semibold ${
            klien.status_pembinaan === "aktif"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {klien.status_pembinaan || "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 border border-gray-100">
        {/* HEADER */}
        <div className="text-center mb-10 sm:mb-12">
          <UserIcon className="h-12 w-12 sm:h-14 sm:w-14 text-emerald-600 mx-auto mb-3" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-700">
            Detail Klien
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-1">
            Informasi lengkap mengenai data klien
          </p>
        </div>

        {/* GRID DATA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
          {fields.map((field, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-gray-200 rounded-xl p-5 sm:p-6 
              hover:border-emerald-300 hover:bg-gray-100 transition-shadow shadow-sm"
            >
              <span className="text-xs sm:text-sm text-gray-500 font-semibold tracking-wide block mb-1">
                {String(index + 1).padStart(2, "0")}. {field.label}
              </span>
              <p className="text-gray-900 font-semibold text-base sm:text-lg">
                {field.value ?? "-"}
              </p>
            </div>
          ))}
        </div>

        {/* TERAKHIR DIPERBARUI */}
        <div className="mt-10 border-t pt-4 text-sm sm:text-base text-gray-600">
          <p className="text-gray-500 mb-1">Diperbarui Terakhir</p>
          <p className="font-semibold text-slate-700">
            {klien.updated_at
              ? new Date(klien.updated_at).toLocaleString("id-ID")
              : "-"}
          </p>
        </div>

        {/* BACK BUTTON */}
        <div className="mt-8">
          <button
            onClick={() => navigate("/operator/klien")}
            className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3
            text-sm sm:text-base font-medium text-gray-700 border border-gray-300 
            rounded-lg hover:bg-gray-100 transition shadow-sm"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
