// src/pages/admin/lks/LKSKunjungan.jsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../../../components/AdminLayout";
import API from "../../../utils/api";

const LKSKunjungan = () => {
  const { id } = useParams();
  const [kunjungan, setKunjungan] = useState([]);
  const [form, setForm] = useState({
    petugas: "",
    catatan: "",
    tanggal: "",
  });

  const fetchKunjungan = async () => {
    try {
      const res = await API.get(`/lks/${id}/kunjungan`);
      setKunjungan(res.data);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    }
  };

  useEffect(() => {
    fetchKunjungan();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/lks/${id}/kunjungan`, form);
      fetchKunjungan();
      setForm({ petugas: "", catatan: "", tanggal: "" });
    } catch (err) {
      console.error("Gagal simpan:", err);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded shadow border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          📝 Laporan Kunjungan LKS
        </h2>

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3 mb-6">
          <input
            type="text"
            name="petugas"
            placeholder="Nama Petugas"
            value={form.petugas}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="date"
            name="tanggal"
            value={form.tanggal}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="catatan"
            placeholder="Catatan kunjungan"
            value={form.catatan}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <div className="md:col-span-3 text-right">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              ➕ Tambah Kunjungan
            </button>
          </div>
        </form>

        {/* Tabel Kunjungan */}
        <table className="min-w-full text-sm text-gray-700 border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Tanggal</th>
              <th className="p-3 text-left">Petugas</th>
              <th className="p-3 text-left">Catatan</th>
            </tr>
          </thead>
          <tbody>
            {kunjungan.map((laporan) => (
              <tr key={laporan.id} className="border-t">
                <td className="p-3">{laporan.tanggal}</td>
                <td className="p-3">{laporan.petugas}</td>
                <td className="p-3">{laporan.catatan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default LKSKunjungan;
