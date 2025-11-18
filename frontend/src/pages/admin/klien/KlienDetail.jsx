import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { ArrowLeftIcon, UserIcon } from "@heroicons/react/24/solid";

export default function KlienDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [klien, setKlien] = useState(null);

  useEffect(() => {
    api
      .get(`/klien/${id}`)
      .then((res) => setKlien(res.data.data))
      .catch(() => navigate("/admin/klien"));
  }, [id, navigate]);

  if (!klien) return <p className="p-6">Memuat...</p>;

  const fields = [
    { label: "NIK", value: klien.nik },
    { label: "Nama", value: klien.nama },
    { label: "Alamat", value: klien.alamat },
    { label: "Kelurahan", value: klien.kelurahan },
    { label: "Kecamatan", value: klien.kecamatan?.nama },
    { label: "LKS", value: klien.lks?.nama },
    { label: "Jenis Kebutuhan", value: klien.jenis_kebutuhan },
    { label: "Status Bantuan", value: klien.status_bantuan },
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

        {/* GRID RESPONSIVE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
          {fields.map((field, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-gray-200 rounded-xl p-5 sm:p-6 
              hover:border-emerald-300 hover:bg-gray-100 transition-shadow shadow-sm"
            >
              {/* LABEL */}
              <span className="text-xs sm:text-sm text-gray-500 font-semibold tracking-wide block mb-1">
                {String(index + 1).padStart(2, "0")}. {field.label}
              </span>

              {/* VALUE */}
              <p className="text-gray-900 font-semibold text-base sm:text-lg">
                {field.value ?? "-"}
              </p>
            </div>
          ))}
        </div>

        {/* BACK BUTTON */}
        <div className="mt-12">
          <button
            onClick={() => navigate("/admin/klien")}
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
