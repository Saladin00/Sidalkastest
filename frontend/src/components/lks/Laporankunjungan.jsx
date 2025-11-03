// src/components/lks/LaporanKunjungan.jsx

import React, { useEffect, useState } from "react";
import API from "../../utils/api";

const LaporanKunjungan = ({ lksId }) => {
  const [laporanList, setLaporanList] = useState([]);
  const [form, setForm] = useState({
    tanggal: "",
    petugas: "",
    catatan: "",
  });

  // 🔹 Ambil semua laporan kunjungan untuk LKS tertentu
  const loadLaporan = async () => {
    try {
      const res = await API.get(`/lks/${lksId}/kunjungan`);
      setLaporanList(res.data);
    } catch (err) {
      console.error("Gagal ambil laporan:", err);
    }
  };

  useEffect(() => {
    if (lksId) loadLaporan();
  }, [lksId]);

  // 🔹 Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Simpan laporan baru
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ GUNAKAN endpoint sesuai route backend: /lks/{id}/kunjungan
      await API.post(`/lks/${lksId}/kunjungan`, form);
      alert("✅ Laporan kunjungan berhasil disimpan!");
      setForm({ tanggal: "", petugas: "", catatan: "" });
      loadLaporan();
    } catch (err) {
      console.error("Gagal simpan:", err);
      alert("❌ Gagal menyimpan laporan kunjungan.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-10 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        📋 Laporan Kunjungan / Monitoring
      </h3>

      {/* 🧾 Form Input */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        <input
          type="date"
          name="tanggal"
          value={form.tanggal}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="text"
          name="petugas"
          value={form.petugas}
          onChange={handleChange}
          placeholder="Nama Petugas"
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="text"
          name="catatan"
          value={form.catatan}
          onChange={handleChange}
          placeholder="Catatan Monitoring"
          className="border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 col-span-full"
        >
          ➕ Simpan Laporan
        </button>
      </form>

      {/* 📄 Daftar Laporan */}
      <ul className="divide-y text-sm">
        {laporanList.length === 0 ? (
          <li className="text-gray-400 italic">Belum ada laporan kunjungan.</li>
        ) : (
          laporanList.map((laporan) => (
            <li key={laporan.id} className="py-3">
              <div className="font-semibold">
                {laporan.tanggal} — {laporan.petugas}
              </div>
              <div className="text-gray-600">{laporan.catatan}</div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default LaporanKunjungan;
