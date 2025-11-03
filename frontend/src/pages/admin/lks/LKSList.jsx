// src/pages/admin/lks/LKSList.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../../components/AdminLayout";
import API from "../../../utils/api";

const LKSList = () => {
  const [lksList, setLksList] = useState([]);
  const [filter, setFilter] = useState({
    kecamatan: "",
    jenis: "",
    status: "",
  });

  const loadLKS = async () => {
    try {
      const res = await API.get("/lks", {
        params: {
          kecamatan: filter.kecamatan,
          jenis: filter.jenis,
          status: filter.status,
        },
      });
      setLksList(res.data);
    } catch (error) {
      console.error("Gagal ambil data LKS:", error);
    }
  };

  useEffect(() => {
    loadLKS();
  }, []);

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📋 Daftar LKS</h2>
        <Link
          to="/admin/lks/tambah"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          ➕ Tambah LKS
        </Link>
      </div>

      {/* 🔍 FILTER BAR */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          value={filter.kecamatan}
          onChange={(e) => setFilter({ ...filter, kecamatan: e.target.value })}
          className="border rounded px-4 py-2"
        >
          <option value="">Semua Kecamatan</option>
          <option value="Cibiru">Cibiru</option>
          <option value="Ujungberung">Ujungberung</option>
          <option value="Arcamanik">Arcamanik</option>
          <option value="Antapani">Antapani</option>
          <option value="Gedebage">Gedebage</option>
          {/* Tambahkan kecamatan lain sesuai kebutuhan */}
        </select>

        <select
          value={filter.jenis}
          onChange={(e) => setFilter({ ...filter, jenis: e.target.value })}
          className="border rounded px-4 py-2"
        >
          <option value="">Semua Jenis</option>
          <option value="Panti Asuhan">Panti Asuhan</option>
          <option value="Panti Jompo">Panti Jompo</option>
          <option value="Panti Rehabilitasi">Panti Rehabilitasi</option>
          <option value="Rumah Singgah">Rumah Singgah</option>
        </select>

        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="border rounded px-4 py-2"
        >
          <option value="">Semua Status</option>
          <option value="Aktif">Aktif</option>
          <option value="Nonaktif">Nonaktif</option>
        </select>

        <button
          onClick={loadLKS}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          🔍 Filter
        </button>
      </div>

      {/* 📄 TABEL DATA */}
      <div className="overflow-x-auto bg-white rounded shadow border border-gray-200">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
            <tr>
              <th className="px-6 py-3">Nama</th>
              <th className="px-6 py-3">Jenis</th>
              <th className="px-6 py-3">Kecamatan</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {lksList.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  Belum ada data LKS.
                </td>
              </tr>
            ) : (
              lksList.map((lks) => (
                <tr key={lks.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-3">{lks.nama}</td>
                  <td className="px-6 py-3">{lks.jenis_layanan}</td>
                  <td className="px-6 py-3">{lks.kecamatan}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        lks.status === "Aktif"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {lks.status}
                    </span>
                  </td>

                  {/* 🧭 Aksi: Detail + Profil dalam satu flex container */}
                  <td className="px-6 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <Link
                        to={`/admin/lks/detail/${lks.id}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Detail
                      </Link>
                      <Link
                        to={`/admin/lks/profil/${lks.id}`}
                        className="text-indigo-600 hover:underline text-sm"
                      >
                        Profil
                      </Link>
                      <Link
                        to={`/admin/lks/edit/${lks.id}`}
                        className="text-yellow-600 hover:underline text-sm"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default LKSList;
