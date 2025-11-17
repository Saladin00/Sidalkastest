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
import AdminLayout from "../../../components/AdminLayout";
import API from "../../../utils/api";

const LKSList = () => {
  const [lksList, setLksList] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  // Filter UI states
  const [jenisFilter, setJenisFilter] = useState("");
  const [kecamatanFilter, setKecamatanFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const location = useLocation();

  // 🔹 Ambil data dari backend
  const loadLKS = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await API.get("/lks", {
        params: { search: search || "" },
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📦 Hasil API:", res.data);

      // ✅ Aman untuk berbagai struktur response
      const items =
        Array.isArray(res.data?.data?.data)
          ? res.data.data.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

      setLksList(items);
    } catch (error) {
      console.error(
        "❌ Gagal ambil data LKS:",
        error.response?.data || error.message || error
      );
      alert(
        error.response?.data?.message ||
          "Terjadi kesalahan saat memuat data LKS."
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Hapus data
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data LKS ini?")) return;
    try {
      const token = sessionStorage.getItem("token");
      await API.delete(`/lks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadLKS();
    } catch (error) {
      console.error("❌ Gagal hapus:", error);
      alert("Terjadi kesalahan saat menghapus data.");
    }
  };

  useEffect(() => {
    loadLKS();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // ------- Data untuk filter dropdown -------
  const jenisOptions = Array.from(
    new Set(lksList.map((item) => item.jenis_layanan).filter(Boolean))
  );

  const kecamatanOptions = Array.from(
    new Set(lksList.map((item) => item.kecamatan?.nama).filter(Boolean))
  );

  // 🔹 Status normalization
  const statusDisplay = (raw) => {
    if (!raw) return "Menunggu";
    const lower = raw.toLowerCase();
    if (lower === "valid") return "Valid";
    if (lower === "tidak_valid") return "Tidak Valid";
    return "Menunggu";
  };

  // 🔄 Reset semua filter
  const resetFilters = () => {
    setJenisFilter("");
    setKecamatanFilter("");
    setStatusFilter("");
    setSearch("");
    loadLKS();
  };

  // ------- Filter frontend -------
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

  return (
    <AdminLayout>
      {/* ======= BAR ATAS ======= */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Filter kiri */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Jenis Layanan */}
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

          {/* Kecamatan */}
          <select
            value={kecamatanFilter}
            onChange={(e) => setKecamatanFilter(e.target.value)}
            className="h-9 rounded-full border border-gray-300 bg-white px-4 text-xs md:text-sm focus:outline-none"
          >
            <option value="">Kecamatan: Semua</option>
            {kecamatanOptions.map((kec) => (
              <option key={kec} value={kec}>
                {kec}
              </option>
            ))}
          </select>

          {/* Status */}
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

          {/* Refresh */}
          <button
            onClick={loadLKS}
            className="flex h-9 items-center gap-1 rounded-full border border-gray-300 bg-white px-4 text-xs md:text-sm text-gray-700 transition hover:bg-gray-100"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
            <span className="hidden sm:inline">
              {loading ? "Memuat..." : "Refresh"}
            </span>
          </button>

          {/* Reset filter */}
          <button
            onClick={resetFilters}
            className="h-9 rounded-full border border-gray-300 bg-white px-4 text-xs md:text-sm text-gray-700 transition hover:bg-gray-100"
          >
            Reset Filter
          </button>
        </div>

        {/* Search + Tambah kanan */}
        <div className="flex items-center gap-2">
          <div className="flex items-center overflow-hidden rounded-md border border-gray-300 bg-white">
            <span className="pl-2 text-gray-500">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Cari nama LKS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 px-2 text-sm outline-none"
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
            className="flex h-9 items-center gap-1 rounded-md bg-blue-700 px-4 text-xs md:text-sm font-medium text-white transition hover:bg-blue-800"
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
          <table className="min-w-full text-sm text-gray-700">
            <thead className="border-b bg-gray-50 text-xs font-medium text-gray-600">
              <tr>
                <th className="w-16 border-r px-4 py-3 text-center">No</th>
                <th className="border-r px-4 py-3 text-left">Nama</th>
                <th className="border-r px-4 py-3 text-left">Jenis Layanan</th>
                <th className="border-r px-4 py-3 text-left">Kecamatan</th>
                <th className="border-r px-4 py-3 text-left">Status</th>
                <th className="w-40 px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {displayedList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-400">
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
                    <tr key={lks.id} className="border-t hover:bg-gray-50">
                      <td className="border-r px-4 py-3 text-center">
                        {index + 1}
                      </td>
                      <td className="border-r px-4 py-3 font-medium text-gray-800">
                        {lks.nama}
                      </td>
                      <td className="border-r px-4 py-3">
                        {lks.jenis_layanan}
                      </td>
                      <td className="border-r px-4 py-3">
                        {lks.kecamatan?.nama || "-"}
                      </td>
                      <td className="border-r px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${badgeClass}`}
                        >
                          {statusDisplay(rawStatus).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-4 text-[11px]">
                          <Link
                            to={`/admin/lks/detail/${lks.id}`}
                            className="flex flex-col items-center text-blue-600 hover:text-blue-800"
                          >
                            <Eye size={18} className="mb-0.5" />
                            <span>Detail</span>
                          </Link>
                          <Link
                            to={`/admin/lks/edit/${lks.id}`}
                            className="flex flex-col items-center text-yellow-500 hover:text-yellow-600"
                          >
                            <Pencil size={18} className="mb-0.5" />
                            <span>Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(lks.id)}
                            className="flex flex-col items-center text-red-600 hover:text-red-700"
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

      {/* ======= FOOTER ======= */}
      <div className="mt-3 flex flex-col gap-2 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="h-8 rounded-md border border-gray-300 bg-white px-2 text-xs focus:outline-none"
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span>entries</span>
        </div>

        <div className="text-[11px] text-gray-500">
          Menampilkan {displayedList.length} dari {filteredList.length} data
        </div>
      </div>
    </AdminLayout>
  );
};

export default LKSList;
