// src/pages/admin/klien/KlienList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { Search, Plus, Eye, Edit2, Trash2 } from "lucide-react";

export default function KlienList() {
  const navigate = useNavigate();

  const [klien, setKlien] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status_bantuan: "",
    jenis_kebutuhan: "",
    kecamatan_id: "",
  });
  const [daftarKecamatan, setDaftarKecamatan] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [perPage, setPerPage] = useState(10); // ✅ default 10 data

  // 🔹 Ambil data awal
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const kecRes = await api.get("/kecamatan");
        setDaftarKecamatan(kecRes.data?.data ?? []);
      } catch {
        setDaftarKecamatan([]);
      }
    };
    fetchAll();
  }, []);

  const fetchKlien = async () => {
    setLoading(true);
    try {
      const res = await api.get("/klien", { params: filters });
      setKlien(res.data?.data ?? []);
    } catch {
      setKlien([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKlien();
  }, [filters]);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data klien ini?")) return;
    try {
      await api.delete(`/klien/${id}`);
      alert("Klien berhasil dihapus.");
      fetchKlien();
    } catch {
      alert("Gagal menghapus klien.");
    }
  };

  const handleResetFilters = () => {
    setFilters({
      status_bantuan: "",
      jenis_kebutuhan: "",
      kecamatan_id: "",
    });
  };

  // 🔹 Pencarian
  const filteredData = klien.filter((item) => {
    const q = searchTerm.toLowerCase();
    if (!q) return true;
    return (
      item?.nik?.toLowerCase().includes(q) ||
      item?.nama?.toLowerCase().includes(q) ||
      item?.alamat?.toLowerCase().includes(q) ||
      item?.kelurahan?.toLowerCase().includes(q) ||
      item?.kecamatan?.nama?.toLowerCase().includes(q) ||
      item?.lks?.nama?.toLowerCase().includes(q)
    );
  });

  const displayedData = filteredData.slice(0, perPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ====== FILTER BAR ====== */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
        <div className="flex flex-wrap gap-2">
          <select
            className="h-8 px-3 text-xs border rounded-full"
            value={filters.status_bantuan}
            onChange={(e) =>
              setFilters({ ...filters, status_bantuan: e.target.value })
            }
          >
            <option value="">Status Bantuan</option>
            <option value="PKH">PKH</option>
            <option value="BPNT">BPNT</option>
            <option value="BLT">BLT</option>
          </select>

          <select
            className="h-8 px-3 text-xs border rounded-full"
            value={filters.jenis_kebutuhan}
            onChange={(e) =>
              setFilters({ ...filters, jenis_kebutuhan: e.target.value })
            }
          >
            <option value="">Jenis Kebutuhan</option>
            <option value="anak">Anak</option>
            <option value="disabilitas">Disabilitas</option>
            <option value="lansia">Lansia</option>
            <option value="fakir_miskin">Fakir Miskin</option>
          </select>

          <select
            className="h-8 px-3 text-xs border rounded-full"
            value={filters.kecamatan_id}
            onChange={(e) =>
              setFilters({ ...filters, kecamatan_id: e.target.value })
            }
          >
            <option value="">Kecamatan</option>
            {daftarKecamatan.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama}
              </option>
            ))}
          </select>

          <button
            className="h-8 px-3 text-xs bg-white border rounded-full"
            onClick={handleResetFilters}
          >
            Reset
          </button>
        </div>

        {/* SEARCH + TAMBAH */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2 top-2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Cari klien..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 pl-7 pr-3 text-sm border rounded-full"
            />
          </div>

          <button
            onClick={() => navigate("/admin/klien/tambah")}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow transition"
          >
            <Plus size={16} /> Tambah Klien
          </button>
        </div>
      </div>

      {/* ====== TABEL ====== */}
      {loading ? (
        <p>Memuat data...</p>
      ) : displayedData.length === 0 ? (
        <p className="text-center text-gray-500 italic py-8">
          {filters.kecamatan_id
            ? "Belum ada klien terdaftar pada kecamatan ini."
            : "Tidak ada data klien ditemukan."}
        </p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-3 py-2 border">No</th>
                <th className="px-3 py-2 border">NIK</th>
                <th className="px-3 py-2 border">Nama</th>
                <th className="px-3 py-2 border">Alamat</th>
                <th className="px-3 py-2 border">Kelurahan</th>
                <th className="px-3 py-2 border">Kecamatan</th>
                <th className="px-3 py-2 border">Kebutuhan</th>
                <th className="px-3 py-2 border">Bantuan</th>
                <th className="px-3 py-2 border">LKS</th>
                <th className="px-3 py-2 border text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {displayedData.map((item, i) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="border px-3 py-2 text-center">{i + 1}</td>
                  <td className="border px-3 py-2">{item.nik}</td>
                  <td className="border px-3 py-2">{item.nama}</td>
                  <td className="border px-3 py-2">{item.alamat}</td>
                  <td className="border px-3 py-2">{item.kelurahan}</td>
                  <td className="border px-3 py-2">{item.kecamatan?.nama}</td>
                  <td className="border px-3 py-2">{item.jenis_kebutuhan}</td>
                  <td className="border px-3 py-2">{item.status_bantuan}</td>
                  <td className="border px-3 py-2">{item.lks?.nama}</td>
                  <td className="border px-3 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/admin/klien/detail/${item.id}`)
                        }
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200 rounded hover:bg-blue-200 transition"
                      >
                        <Eye size={14} /> Lihat
                      </button>

                      <button
                        onClick={() => navigate(`/admin/klien/edit/${item.id}`)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200 rounded hover:bg-yellow-200 transition"
                      >
                        <Edit2 size={14} /> Edit
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-red-100 text-red-700 border border-red-200 rounded hover:bg-red-200 transition"
                      >
                        <Trash2 size={14} /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ====== FOOTER - TAMPILKAN DATA ====== */}
      <div className="flex items-center justify-start mt-4">
        <label className="text-sm mr-2 text-slate-700">Tampilkan</label>
        <select
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        >
          {[5, 10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <span className="text-sm ml-2 text-slate-700">data per halaman</span>
      </div>
    </div>
  );
}
