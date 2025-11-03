// src/pages/admin/lks/tabs/TabProfilUmum.jsx
import React from "react";

const TabProfilUmum = ({ data, setData }) => {
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Nama Lembaga */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama Lembaga
        </label>
        <input
          type="text"
          name="nama"
          value={data.nama}
          onChange={handleChange}
          placeholder="Masukkan nama lembaga..."
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Alamat Lengkap */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Alamat Lengkap
        </label>
        <textarea
          name="alamat"
          value={data.alamat}
          onChange={handleChange}
          rows="3"
          placeholder="Masukkan alamat lengkap lembaga..."
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      {/* Jenis Layanan */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Jenis Layanan
        </label>
        <select
          name="jenis_layanan"
          value={data.jenis_layanan}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Pilih jenis layanan</option>
          <option value="Panti Asuhan">Panti Asuhan</option>
          <option value="Panti Jompo">Panti Jompo</option>
          <option value="Rehabilitasi Sosial">Rehabilitasi Sosial</option>
          <option value="Disabilitas">Disabilitas</option>
        </select>
      </div>

      {/* Akta Pendirian */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Akta Pendirian
        </label>
        <input
          type="text"
          name="akta_pendirian"
          value={data.akta_pendirian}
          onChange={handleChange}
          placeholder="Nomor akta pendirian..."
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Izin Operasional */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Izin Operasional
        </label>
        <input
          type="text"
          name="izin_operasional"
          value={data.izin_operasional}
          onChange={handleChange}
          placeholder="Nomor izin operasional..."
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Kontak Pengurus */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Kontak Pengurus
        </label>
        <input
          type="text"
          name="kontak_pengurus"
          value={data.kontak_pengurus}
          onChange={handleChange}
          placeholder="Nomor telepon / email pengurus..."
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          name="status"
          value={data.status}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Aktif">Aktif</option>
          <option value="Nonaktif">Nonaktif</option>
        </select>
      </div>
    </div>
  );
};

export default TabProfilUmum;
