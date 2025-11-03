// src/pages/admin/lks/form/TabLegalitas.jsx

import React from "react";

const TabLegalitas = ({ data, setData }) => {
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status Legalitas
        </label>
        <select
          name="legalitas"
          value={data.legalitas || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Pilih Status</option>
          <option value="Sudah">Sudah</option>
          <option value="Belum">Belum</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nomor Akta / Izin
        </label>
        <input
          type="text"
          name="nomor_izin"
          value={data.nomor_izin || ""}
          onChange={handleChange}
          placeholder="Misalnya: 123/Akt/2022"
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status Akreditasi
        </label>
        <select
          name="akreditasi"
          value={data.akreditasi || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Pilih Status</option>
          <option value="A">A (Sangat Baik)</option>
          <option value="B">B (Baik)</option>
          <option value="C">C (Cukup)</option>
          <option value="Belum">Belum Terakreditasi</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nomor Sertifikat Akreditasi
        </label>
        <input
          type="text"
          name="nomor_sertifikat"
          value={data.nomor_sertifikat || ""}
          onChange={handleChange}
          placeholder="Contoh: 001/Sert/Akt/2023"
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tanggal Akreditasi
        </label>
        <input
          type="date"
          name="tanggal_akreditasi"
          value={data.tanggal_akreditasi || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default TabLegalitas;
