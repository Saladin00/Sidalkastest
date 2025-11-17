import React, { useEffect, useState } from "react";
import { RotateCw, Loader2 } from "lucide-react";
import api from "../../../utils/api";
import { useNavigate } from "react-router-dom";

const OperatorKlienList = () => {
  const [klienList, setKlienList] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [lksList, setLksList] = useState([]);
  const navigate = useNavigate();
  // 🔹 Filter manual
  const [filters, setFilters] = useState({
    kelurahan: "",
    lks_id: "",
  });

  // =============================================
  // Ambil Data Klien
  // =============================================
  const loadKlien = async (page = 1) => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await api.get("/klien", {
        params: {
          search,
          page,
          kelurahan: filters.kelurahan || undefined,
          lks_id: filters.lks_id || undefined,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data?.data;

      if (Array.isArray(data)) {
        setKlienList(data);
        setPagination({ current_page: 1, last_page: 1, total: data.length });
      } else {
        setKlienList(data?.data || []);
        setPagination({
          current_page: data?.current_page || 1,
          last_page: data?.last_page || 1,
          total: data?.total || data?.data?.length || 0,
        });
      }
    } catch (error) {
      console.error("❌ Gagal mengambil data klien:", error);
      alert(
        error.response?.data?.message ||
          "Terjadi kesalahan saat memuat data klien."
      );
    } finally {
      setLoading(false);
    }
  };

  // =============================================
  // Ambil Data LKS untuk Dropdown Filter
  // =============================================
  const loadLKS = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await api.get("/lks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLksList(res.data?.data?.data || res.data?.data || []);
    } catch (err) {
      console.error("Gagal memuat LKS:", err);
    }
  };

  useEffect(() => {
    loadLKS();
    loadKlien();
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") loadKlien(1);
  };

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =============================================
  // RENDER
  // =============================================
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center p-4 border-b border-slate-100 gap-2">
        <h2 className="text-lg font-semibold text-slate-800">
          Daftar Klien di Kecamatan Anda
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Kelurahan (input teks) */}
          <input
            type="text"
            name="kelurahan"
            value={filters.kelurahan}
            onChange={handleFilterChange}
            placeholder="Filter Kelurahan..."
            className="border border-slate-300 rounded-md text-sm px-2 py-1.5 w-40"
          />

          {/* Filter LKS */}
          <select
            name="lks_id"
            value={filters.lks_id}
            onChange={handleFilterChange}
            className="border border-slate-300 rounded-md text-sm px-2 py-1.5"
          >
            <option value="">Semua LKS</option>
            {lksList.map((lks) => (
              <option key={lks.id} value={lks.id}>
                {lks.nama}
              </option>
            ))}
          </select>

          {/* Search */}
          <div className="flex items-center border border-slate-300 rounded-md overflow-hidden bg-white">
            <input
              type="text"
              placeholder="Cari nama klien..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={handleKeyPress}
              className="px-3 py-1.5 text-sm outline-none w-44"
            />
            <button
              onClick={() => loadKlien(1)}
              className="bg-slate-100 px-3 py-1.5 text-slate-600 hover:bg-slate-200 transition"
            >
              🔍
            </button>
          </div>

          {/* Refresh */}
          <button
            onClick={() => loadKlien(pagination.current_page)}
            className="flex items-center gap-1 border border-slate-300 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-100 text-sm transition"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <RotateCw size={14} />
            )}
            {loading ? "Memuat..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-500">
            <Loader2 size={24} className="animate-spin mr-2" />
            Memuat data klien...
          </div>
        ) : (
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-slate-50 text-xs font-medium text-slate-600 border-b">
              <tr>
                <th className="px-4 py-3 text-center w-12 border-r">No</th>
                <th className="px-4 py-3 border-r">NIK</th>
                <th className="px-4 py-3 border-r">Nama Klien</th>
                <th className="px-4 py-3 border-r">Kelurahan</th>
                <th className="px-4 py-3 border-r">Alamat</th>
                <th className="px-4 py-3 border-r">Kecamatan</th>
                <th className="px-4 py-3 border-r">LKS</th>
                <th className="px-4 py-3 text-center">Status Pembinaan</th>
                <th className="px-4 py-3 text-center border-r">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {klienList.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-6 text-slate-400 italic"
                  >
                    Tidak ada data klien ditemukan.
                  </td>
                </tr>
              ) : (
                klienList.map((klien,) => (
                  <tr
                    key={klien.id}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    <td className="px-4 py-3 text-center border-r">
                      <button
                        onClick={() =>
                          navigate(`/operator/klien/detail/${klien.id}`)
                        }
                        className="text-sky-600 hover:underline text-sm font-medium"
                      >
                        Lihat
                      </button>
                    </td>

                    <td className="px-4 py-3 border-r">{klien.nik || "-"}</td>
                    <td className="px-4 py-3 border-r font-medium text-slate-800">
                      {klien.nama}
                    </td>
                    <td className="px-4 py-3 border-r">
                      {klien.kelurahan || "-"}
                    </td>
                    <td className="px-4 py-3 border-r">
                      {klien.alamat || "-"}
                    </td>
                    <td className="px-4 py-3 border-r">
                      {klien.kecamatan?.nama || "-"}
                    </td>
                    <td className="px-4 py-3 border-r">
                      {klien.lks?.nama || "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          klien.status_pembinaan === "aktif"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {klien.status_pembinaan || "-"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center p-4 text-sm text-slate-600">
        <p>
          Halaman {pagination.current_page} dari {pagination.last_page} — Total{" "}
          {pagination.total} data
        </p>
        <div className="flex gap-2">
          <button
            disabled={pagination.current_page <= 1}
            onClick={() => loadKlien(pagination.current_page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ⬅️ Prev
          </button>
          <button
            disabled={pagination.current_page >= pagination.last_page}
            onClick={() => loadKlien(pagination.current_page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next ➡️
          </button>
        </div>
      </div>
    </div>
  );
};

export default OperatorKlienList;
