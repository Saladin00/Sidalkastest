// src/components/lks-form/TabMonitoring.jsx

import React from "react";

const TabMonitoring = ({ form, setForm }) => {
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, monitoring_file: e.target.files[0] });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Tanggal Kunjungan */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tanggal Kunjungan
        </label>
        <input
          type="date"
          name="tanggal_kunjungan"
          value={form.tanggal_kunjungan || ""}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-md shadow-sm focus:ring focus:ring-blue-500"
        />
      </div>

      {/* Nama Petugas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama Petugas
        </label>
        <input
          type="text"
          name="nama_petugas"
          value={form.nama_petugas || ""}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-md shadow-sm focus:ring focus:ring-blue-500"
        />
      </div>

      {/* Hasil Observasi */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hasil Observasi
        </label>
        <textarea
          name="hasil_observasi"
          value={form.hasil_observasi || ""}
          onChange={handleChange}
          rows={4}
          className="w-full border px-4 py-2 rounded-md shadow-sm focus:ring focus:ring-blue-500"
        />
      </div>

      {/* Tindak Lanjut */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tindak Lanjut / Catatan Khusus
        </label>
        <textarea
          name="tindak_lanjut"
          value={form.tindak_lanjut || ""}
          onChange={handleChange}
          rows={4}
          className="w-full border px-4 py-2 rounded-md shadow-sm focus:ring focus:ring-blue-500"
        />
      </div>

      {/* Upload Dokumen / Foto */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upload Foto / Dokumen Hasil Kunjungan
        </label>
        <input
          type="file"
          name="monitoring_file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default TabMonitoring;
