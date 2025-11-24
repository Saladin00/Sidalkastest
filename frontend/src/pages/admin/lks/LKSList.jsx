// src/pages/admin/lks/LKSList.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  Loader2,
  Search,
  Plus,
} from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import AdminLayout from "../../../components/AdminLayout";
import API from "../../../utils/api";
import { showSuccess, showError, showInfo } from "../../../utils/toast";

const LKSList = () => {
  const [lksList, setLksList] = useState([]);
  const [daftarKecamatan, setDaftarKecamatan] = useState([]); // 🔹 Tambah state untuk semua kecamatan
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [jenisFilter, setJenisFilter] = useState("");
  const [kecamatanFilter, setKecamatanFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const location = useLocation();

  // 🔹 Fetch data LKS
  const loadLKS = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await API.get("/lks", {
        params: { search: search || "" },
        headers: { Authorization: `Bearer ${token}` },
      });

      const items =
        Array.isArray(res.data?.data?.data)
          ? res.data.data.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
      setLksList(items);
    } catch (error) {
      console.error("❌ Gagal ambil data LKS:", error);
      showError("Gagal memuat data LKS!");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch semua kecamatan dari backend
  const loadKecamatan = async () => {
    try {
      const res = await API.get("/kecamatan");
      setDaftarKecamatan(res.data.data || []);
    } catch (err) {
      console.error("❌ Gagal memuat kecamatan:", err);
      showError("Gagal memuat daftar kecamatan!");
    }
  };

  useEffect(() => {
    loadLKS();
    loadKecamatan(); // 🔹 Muat kecamatan dari backend saat pertama kali
  }, [location]);

  const jenisOptions = Array.from(
    new Set(lksList.map((item) => item.jenis_layanan).filter(Boolean))
  );

  const statusDisplay = (raw) => {
    if (!raw) return "Menunggu";
    const lower = raw.toLowerCase();
    if (lower === "valid") return "Valid";
    if (lower === "tidak_valid") return "Tidak Valid";
    return "Menunggu";
  };

  const resetFilters = () => {
    setJenisFilter("");
    setKecamatanFilter("");
    setStatusFilter("");
    setSearch("");
    showInfo("Filter telah direset.");
    loadLKS();
  };

  // 🔹 Filter hasil
  const filteredList = lksList.filter((lks) => {
    if (search && !lks.nama?.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (jenisFilter && lks.jenis_layanan !== jenisFilter) return false;
    if (kecamatanFilter && lks.kecamatan?.nama !== kecamatanFilter) return false;

    const rawStatus = lks.verifikasi_terbaru?.status || "";
    if (statusFilter) {
      const lower = rawStatus.toLowerCase();
      const normalized =
        lower === "valid"
          ? "valid"
          : lower === "tidak_valid"
          ? "tidak_valid"
          : "pending";
      if (statusFilter !== normalized) return false;
    }
    return true;
  });

  const displayedList = filteredList.slice(0, pageSize);

  // 🔹 Hapus data LKS
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Data LKS?",
      text: "Data akan dihapus secara permanen dari sistem.",
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

    if (!result.isConfirmed) {
      showInfo("Aksi dibatalkan.");
      return;
    }

    showInfo("Menghapus data LKS...");
    try {
      const token = sessionStorage.getItem("token");
      await API.delete(`/lks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showSuccess("Data LKS berhasil dihapus!");
      loadLKS();
    } catch (error) {
      console.error("❌ Gagal hapus:", error);
      showError("Gagal menghapus data LKS!");
    }
  };

  return (
    <AdminLayout>
      {/* ======= BAR ATAS ======= */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Filter kiri */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={jenisFilter}
            onChange={(e) => setJenisFilter(e.target.value)}
            className="h-9 rounded-full border border-gray-300 bg-white px-4 text-xs md:text-sm focus:outline-none"
          >
            <option value="">Jenis Layanan: Semua</option>
            {jenisOptions.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </select>

          {/* 🔹 Kecamatan dari backend (semua Indramayu) */}
          <select
            value={kecamatanFilter}
            onChange={(e) => setKecamatanFilter(e.target.value)}
            className="h-9 rounded-full border border-gray-300 bg-white px-4 text-xs md:text-sm focus:outline-none"
          >
            <option value="">Kecamatan: Semua</option>
            {daftarKecamatan.map((k) => (
              <option key={k.id} value={k.nama}>
                {k.nama}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-full border border-gray-300 bg-white px-4 text-xs md:text-sm focus:outline-none"
          >
            <option value="">Status: Semua</option>
            <option value="valid">Status: Valid</option>
            <option value="tidak_valid">Status: Tidak Valid</option>
            <option value="pending">Status: Menunggu</option>
          </select>

          <div className="flex gap-2 mt-2 sm:mt-0">
            <button
              onClick={loadLKS}
              disabled={loading}
              className="flex h-9 items-center gap-1 rounded-full border border-gray-300 bg-white px-3 text-xs md:text-sm text-gray-700 hover:bg-gray-100 transition"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin text-sky-600" />
              ) : (
                <RefreshCw size={16} />
              )}
              <span className="hidden sm:inline">
                {loading ? "Memuat..." : "Refresh"}
              </span>
            </button>
            <button
              onClick={resetFilters}
              className="h-9 rounded-full border border-gray-300 bg-white px-3 text-xs md:text-sm text-gray-700 hover:bg-gray-100 transition"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Search & Tambah */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="flex w-full sm:w-auto items-center overflow-hidden rounded-md border border-gray-300 bg-white">
            <span className="pl-2 text-gray-500">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Cari nama LKS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 px-2 text-sm flex-1 outline-none"
            />
            <button
              onClick={loadLKS}
              className="h-9 bg-gray-100 px-3 text-xs md:text-sm text-gray-600 hover:bg-gray-200"
            >
              Cari
            </button>
          </div>

          <Link
            to="/admin/lks/tambah"
            className="flex items-center justify-center gap-1 rounded-md bg-blue-700 px-4 py-2 text-xs md:text-sm font-medium text-white hover:bg-blue-800 transition"
          >
            <Plus size={16} />
            <span>Tambah LKS</span>
          </Link>
        </div>
      </div>

      {/* ======= TABEL ======= */}
      <div className="overflow-x-auto rounded-md border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-500">
            <Loader2 size={24} className="mr-2 animate-spin" />
            Memuat data LKS...
          </div>
        ) : (
          <table className="min-w-full text-sm text-slate-700 border border-slate-200 rounded-lg overflow-hidden shadow-md">
            <thead className="bg-gradient-to-r from-slate-100 to-slate-50 text-xs font-semibold text-slate-600 uppercase tracking-wide">
              <tr>
                <th className="w-12 sm:w-16 px-3 sm:px-4 py-3 text-center border-b border-slate-200">
                  No
                </th>
                <th className="px-3 sm:px-4 py-3 text-left border-b border-slate-200">
                  Nama
                </th>
                <th className="hidden sm:table-cell px-3 sm:px-4 py-3 text-left border-b border-slate-200">
                  Jenis Layanan
                </th>
                <th className="hidden md:table-cell px-3 sm:px-4 py-3 text-left border-b border-slate-200">
                  Kecamatan
                </th>
                <th className="hidden md:table-cell px-3 sm:px-4 py-3 text-left border-b border-slate-200">
                  Status Verifikasi
                </th>
                <th className="w-32 sm:w-40 px-3 sm:px-4 py-3 text-center border-b border-slate-200">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {displayedList.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="py-10 text-center text-slate-400 italic border-t border-slate-100 bg-slate-50"
                  >
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                displayedList.map((lks, index) => {
                  const rawStatus = lks.verifikasi_terbaru?.status;
                  const lower = rawStatus?.toLowerCase() || "";
                  const badgeClass =
                    lower === "valid"
                      ? "bg-green-100 text-green-700"
                      : lower === "tidak_valid"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700";

                  return (
                    <tr
                      key={lks.id}
                      className="hover:bg-sky-50/70 transition-all border-t border-slate-100"
                    >
                      <td className="px-3 sm:px-4 py-3 text-center font-medium text-slate-700 border-x border-slate-100 bg-white">
                        {index + 1}
                      </td>
                      <td className="px-3 sm:px-4 py-3 font-semibold text-slate-800 border-x border-slate-100 bg-white">
                        {lks.nama}
                      </td>
                      <td className="hidden sm:table-cell px-3 sm:px-4 py-3 border-x border-slate-100 bg-white">
                        {lks.jenis_layanan}
                      </td>
                      <td className="hidden md:table-cell px-3 sm:px-4 py-3 border-x border-slate-100 bg-white">
                        {lks.kecamatan?.nama || "-"}
                      </td>
                      <td className="hidden md:table-cell px-3 sm:px-4 py-3 border-x border-slate-100 bg-white">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium shadow-sm ${badgeClass}`}
                        >
                          {statusDisplay(rawStatus).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-center border-x border-slate-100 bg-white">
                        <div className="flex justify-center gap-3 text-xs sm:text-[11px]">
                          <Link
                            to={`/admin/lks/detail/${lks.id}`}
                            className="flex flex-col items-center text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <Eye size={18} className="mb-0.5" />
                            <span>Detail</span>
                          </Link>
                          <Link
                            to={`/admin/lks/edit/${lks.id}`}
                            className="flex flex-col items-center text-amber-500 hover:text-amber-600 transition-colors"
                          >
                            <Pencil size={18} className="mb-0.5" />
                            <span>Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(lks.id)}
                            className="flex flex-col items-center text-red-600 hover:text-red-700 transition-colors"
                          >
                            <Trash2 size={18} className="mb-0.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar
        newestOnTop
        theme="light"
      />
    </AdminLayout>
  );
};

export default LKSList;
