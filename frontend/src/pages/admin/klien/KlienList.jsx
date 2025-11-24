// src/pages/admin/klien/KlienList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import {
  showSuccess,
  showError,
  showWarning,
  showInfo,
} from "../../../utils/toast";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
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
  const [perPage, setPerPage] = useState(10);

  // 🔹 Ambil data kecamatan
  useEffect(() => {
    const fetchKecamatan = async () => {
      try {
        const kecRes = await api.get("/kecamatan");
        setDaftarKecamatan(kecRes.data?.data ?? []);
      } catch {
        setDaftarKecamatan([]);
      }
    };
    fetchKecamatan();
  }, []);

  // 🔹 Ambil data klien
  const fetchKlien = async () => {
    setLoading(true);
    try {
      const res = await api.get("/klien", { params: filters });
      setKlien(res.data?.data ?? []);
    } catch {
      setKlien([]);
      showError("Gagal memuat data klien!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKlien();
  }, [filters]);

  // 🔹 Hapus data klien
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Data Klien?",
      text: "Data klien akan dihapus permanen dari sistem.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e02424",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      reverseButtons: true,
      background: "#fff",
      color: "#374151",
      backdrop: `rgba(0,0,0,0.4)`,
    });

    if (!result.isConfirmed) return;

    showInfo("Menghapus data klien...");
    try {
      await api.delete(`/klien/${id}`);
      showSuccess("Klien berhasil dihapus!");
      fetchKlien();
    } catch {
      showError("Gagal menghapus data klien. Coba lagi nanti.");
    }
  };

  // 🔹 Reset filter
  const handleResetFilters = () => {
    setFilters({
      status_bantuan: "",
      jenis_kebutuhan: "",
      kecamatan_id: "",
    });
    showInfo("Filter telah direset.");
  };

  // 🔹 Info jika filter diterapkan
  useEffect(() => {
    if (
      filters.kecamatan_id ||
      filters.status_bantuan ||
      filters.jenis_kebutuhan
    ) {
      showInfo("Filter diterapkan.");
    }
  }, [filters]);

  // 🔹 Filter dan pencarian
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
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* ====== FILTER & SEARCH BAR ====== */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-5">
        {/* Filter Group */}
        <div className="flex flex-wrap gap-2">
          <select
            className="h-9 px-3 text-xs sm:text-sm border rounded-full bg-white"
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
            className="h-9 px-3 text-xs sm:text-sm border rounded-full bg-white"
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
            className="h-9 px-3 text-xs sm:text-sm border rounded-full bg-white"
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
            className="h-9 px-3 text-xs sm:text-sm bg-white border rounded-full hover:bg-gray-100 transition"
            onClick={handleResetFilters}
          >
            Reset
          </button>
        </div>

        {/* Search + Tambah */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Cari klien..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-56 h-9 pl-8 pr-3 text-sm border rounded-full focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>

          <button
            onClick={() => navigate("/admin/klien/tambah")}
            className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow transition"
          >
            <Plus size={16} /> Tambah Klien
          </button>
        </div>
      </div>

      {/* ====== TABEL ====== */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Memuat data...</div>
        ) : displayedData.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            {filters.kecamatan_id
              ? "Belum ada klien terdaftar pada kecamatan ini."
              : "Tidak ada data ditemukan."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-slate-700">
              <thead className="bg-slate-100 border-b text-slate-600">
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
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="border px-3 py-2 text-center">{i + 1}</td>
                    <td className="border px-3 py-2">{item.nik}</td>
                    <td className="border px-3 py-2 font-medium text-slate-800">
                      {item.nama}
                    </td>
                    <td className="border px-3 py-2">{item.alamat}</td>
                    <td className="border px-3 py-2">{item.kelurahan}</td>
                    <td className="border px-3 py-2">{item.kecamatan?.nama}</td>
                    <td className="border px-3 py-2">{item.jenis_kebutuhan}</td>
                    <td className="border px-3 py-2">{item.status_bantuan}</td>
                    <td className="border px-3 py-2">{item.lks?.nama}</td>
                    <td className="border px-3 py-2 text-center">
                      <div className="flex justify-center items-center gap-2 flex-nowrap">
                        <button
                          onClick={() =>
                            navigate(`/admin/klien/detail/${item.id}`)
                          }
                          className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200 rounded hover:bg-blue-200 whitespace-nowrap transition"
                        >
                          <Eye size={13} /> Lihat
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/admin/klien/edit/${item.id}`)
                          }
                          className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200 rounded hover:bg-yellow-200 whitespace-nowrap transition"
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-700 border border-red-200 rounded hover:bg-red-200 whitespace-nowrap transition"
                        >
                          <Trash2 size={13} /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ====== FOOTER ====== */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <label>Tampilkan</label>
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm bg-white"
          >
            {[5, 10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span>data per halaman</span>
        </div>

        <div className="mt-2 sm:mt-0 text-xs text-slate-500">
          Menampilkan {displayedData.length} dari {filteredData.length} data
        </div>
      </div>
    </div>
  );
}
