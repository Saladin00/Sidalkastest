// src/pages/admin/lks/LKSProfil.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../../components/AdminLayout";
import API from "../../../utils/api";

const LKSProfil = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchLKS = async () => {
      try {
        const res = await API.get(`/lks/${id}`);
        setData(res.data);
      } catch (err) {
        console.error("Gagal ambil data profil:", err);
        alert("Gagal ambil data profil LKS");
      }
    };
    fetchLKS();
  }, [id]);

  if (!data) return <div className="p-6">⏳ Loading profil LKS...</div>;

  return (
    <AdminLayout>
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-700">
            🏢 Profil LKS: {data.nama}
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="text-sm px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            ⬅️ Kembali
          </button>
        </div>

        {/* Identitas LKS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 text-sm text-gray-700">
          <div>
            <strong className="block mb-1 text-gray-500">Jenis Layanan:</strong>
            {data.jenis_layanan}
          </div>
          <div>
            <strong className="block mb-1 text-gray-500">Kecamatan:</strong>
            {data.kecamatan}
          </div>
          <div>
            <strong className="block mb-1 text-gray-500">Status:</strong>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                data.status === "Aktif"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {data.status}
            </span>
          </div>
          <div>
            <strong className="block mb-1 text-gray-500">Alamat:</strong>
            {data.alamat || "-"}
          </div>
        </div>

        {/* Legalitas & Akreditasi */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">📄 Legalitas & Akreditasi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <strong className="block mb-1 text-gray-500">Legalitas:</strong>
              {data.legalitas || "-"}
            </div>
            <div>
              <strong className="block mb-1 text-gray-500">Akreditasi:</strong>
              {data.akreditasi || "-"}
            </div>
          </div>
        </div>

        {/* Pengurus */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">👥 Pengurus / Tenaga Sosial</h3>
          <div className="text-sm bg-gray-50 p-4 rounded border">
            {data.pengurus || "-"}
          </div>
        </div>

        {/* Sarana */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">🏗️ Sarana & Prasarana</h3>
          <div className="text-sm bg-gray-50 p-4 rounded border">
            {data.sarana || "-"}
          </div>
        </div>

        {/* Koordinat */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">📍 Koordinat Lokasi</h3>
          <div className="text-sm bg-gray-50 p-4 rounded border">
            {data.koordinat || "-"}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default LKSProfil;
