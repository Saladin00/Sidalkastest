import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

export default function KlienList() {
  const navigate = useNavigate();
  const [klien, setKlien] = useState([]);
  const [loading, setLoading] = useState(true);

  // filter sesuai backend
  const [filters, setFilters] = useState({
    status_bantuan: "",
    jenis_kebutuhan: "",
    kecamatan_id: "",
    lks_id: "",
  });

  const [daftarKecamatan, setDaftarKecamatan] = useState([]);
  const [daftarLKS, setDaftarLKS] = useState([]);

  // 🟢 Ambil daftar kecamatan dari tabel 'kecamatan'
  const fetchKecamatan = async () => {
    try {
      const res = await api.get("/kecamatan");
      setDaftarKecamatan(res.data?.data || []);
    } catch (err) {
      console.error("Gagal ambil kecamatan:", err);
      setDaftarKecamatan([]);
    }
  };

  // 🟢 Ambil daftar LKS (default atau by kecamatan)
  const fetchLKS = async (kecamatanId = "") => {
    try {
      let res;
      if (kecamatanId) {
        // ambil berdasarkan kecamatan
        res = await api.get(`/lks/by-kecamatan/${kecamatanId}`);
        setDaftarLKS(res.data?.data || []);
      } else {
        // ambil semua
        res = await api.get("/lks");
        setDaftarLKS(res.data?.data || []);
      }
    } catch (err) {
      console.error("Gagal ambil LKS:", err);
      setDaftarLKS([]);
    }
  };

  // 🟢 Ambil data klien (terfilter)
  const fetchKlien = async () => {
    setLoading(true);
    try {
      const res = await api.get("/klien", { params: filters });
      const items = res.data?.data?.data || res.data?.data || [];
      setKlien(items);
    } catch (error) {
      console.error("Gagal mengambil data klien:", error);
      alert("Terjadi kesalahan saat memuat data klien.");
      setKlien([]);
    } finally {
      setLoading(false);
    }
  };

  // pertama kali halaman dibuka
  useEffect(() => {
    fetchKecamatan();
    fetchLKS();
  }, []);

  // kalau kecamatan berubah, ambil ulang LKS by kecamatan
  useEffect(() => {
    if (filters.kecamatan_id) {
      fetchLKS(filters.kecamatan_id);
    } else {
      fetchLKS(); // ambil semua kalau kecamatan dikosongkan
    }

    // reset lks_id tiap kali kecamatan berubah
    setFilters((f) => ({ ...f, lks_id: "" }));
  }, [filters.kecamatan_id]);

  // ambil ulang data klien setiap kali filter berubah
  useEffect(() => {
    fetchKlien();
  }, [filters]);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data klien ini?")) return;
    try {
      await api.delete(`/klien/${id}`);
      alert("Klien berhasil dihapus!");
      fetchKlien();
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus data klien.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Data Klien</h1>
        <button
          onClick={() => navigate("/admin/klien/tambah")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Tambah Klien
        </button>
      </div>

      {/* 🔍 Filter */}
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Status Bantuan */}
        <select
          className="border p-2 rounded"
          value={filters.status_bantuan}
          onChange={(e) =>
            setFilters({ ...filters, status_bantuan: e.target.value })
          }
        >
          <option value="">Semua Bantuan</option>
          <option value="PKH">PKH</option>
          <option value="BPNT">BPNT</option>
          <option value="BLT">BLT</option>
          <option value="lainnya">Lainnya</option>
        </select>

        {/* Jenis Kebutuhan */}
        <select
          className="border p-2 rounded"
          value={filters.jenis_kebutuhan}
          onChange={(e) =>
            setFilters({ ...filters, jenis_kebutuhan: e.target.value })
          }
        >
          <option value="">Semua Jenis Kebutuhan</option>
          <option value="anak">Anak</option>
          <option value="disabilitas">Disabilitas</option>
          <option value="lansia">Lansia</option>
          <option value="fakir_miskin">Fakir Miskin</option>
          <option value="lainnya">Lainnya</option>
        </select>

        {/* Kecamatan */}
        <select
          className="border p-2 rounded"
          value={filters.kecamatan_id}
          onChange={(e) =>
            setFilters({ ...filters, kecamatan_id: e.target.value })
          }
        >
          <option value="">Semua Kecamatan</option>
          {daftarKecamatan.map((kec) => (
            <option key={kec.id} value={kec.id}>
              {kec.nama}
            </option>
          ))}
        </select>

        {/* LKS */}
        <select
          className="border p-2 rounded"
          value={filters.lks_id}
          onChange={(e) => setFilters({ ...filters, lks_id: e.target.value })}
        >
          <option value="">Semua LKS</option>
          {daftarLKS.map((lks) => (
            <option key={lks.id} value={lks.id}>
              {lks.nama}
            </option>
          ))}
        </select>
      </div>

      {/* 📋 Tabel Data */}
      {loading ? (
        <p className="text-gray-600">Memuat data klien...</p>
      ) : klien.length === 0 ? (
        <p className="text-gray-500 italic">Tidak ada data klien ditemukan.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 w-10">#</th>
                <th className="border p-2">NIK</th>
                <th className="border p-2">Nama</th>
                <th className="border p-2">Alamat</th>
                <th className="border p-2">Kelurahan</th>
                <th className="border p-2">Kecamatan</th>
                <th className="border p-2">Jenis Kebutuhan</th>
                <th className="border p-2">Status Bantuan</th>
                <th className="border p-2">LKS</th>
                <th className="border p-2 w-48 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {klien.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2">{item.nik}</td>
                  <td className="border p-2">{item.nama}</td>
                  <td className="border p-2">{item.alamat}</td>
                  <td className="border p-2">{item.kelurahan}</td>
                  <td className="border p-2">{item.kecamatan?.nama || "-"}</td>
                  <td className="border p-2">{item.jenis_kebutuhan || "-"}</td>
                  <td className="border p-2">{item.status_bantuan || "-"}</td>
                  <td className="border p-2">{item.lks?.nama || "-"}</td>
                  <td className="border p-2 text-center">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                      onClick={() => navigate(`/admin/klien/detail/${item.id}`)}
                    >
                      Detail
                    </button>
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                      onClick={() => navigate(`/admin/klien/edit/${item.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDelete(item.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
