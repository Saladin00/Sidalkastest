import React, { useEffect, useState } from "react";
import API from "../../../utils/api";
import { Eye, Search, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OperatorLKSList = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [jenisLayanan, setJenisLayanan] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [perPage, setPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLKS();
  }, []);

  const fetchLKS = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await API.get("/lks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      let hasil = [];
      if (Array.isArray(res.data)) hasil = res.data;
      else if (Array.isArray(res.data.data)) hasil = res.data.data;
      else if (Array.isArray(res.data.lks)) hasil = res.data.lks;
      else if (res.data.data && Array.isArray(res.data.data.data))
        hasil = res.data.data.data;

      setData(hasil);
      setFiltered(hasil);
    } catch (err) {
      console.error("❌ Gagal ambil data LKS:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => fetchLKS();

  const handleReset = () => {
    setSearch("");
    setJenisLayanan("");
    setStatusFilter("");
    setFiltered(data);
  };

  // 🔍 Filter dan pencarian
  useEffect(() => {
    let result = data;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.nama?.toLowerCase().includes(q) ||
          item.kecamatan?.nama?.toLowerCase().includes(q)
      );
    }

    if (jenisLayanan) {
      result = result.filter(
        (item) => item.jenis_layanan?.toLowerCase() === jenisLayanan
      );
    }

    if (statusFilter) {
      result = result.filter(
        (item) => item.status?.toLowerCase() === statusFilter
      );
    }

    setFiltered(result);
  }, [search, jenisLayanan, statusFilter, data]);

  const displayedData = filtered.slice(0, perPage);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* FILTER BAR */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        {/* Filter kiri */}
        <div className="flex flex-wrap gap-2">
          {/* Jenis Layanan */}
          <select
            value={jenisLayanan}
            onChange={(e) => setJenisLayanan(e.target.value)}
            className="h-9 px-3 text-sm border border-gray-300 rounded-md bg-white w-full sm:w-auto"
          >
            <option value="">Semua Jenis</option>
            <option value="lansia">Lansia</option>
            <option value="disabilitas">Disabilitas</option>
            <option value="anak">Anak</option>
            <option value="fakir_miskin">Fakir Miskin</option>
            <option value="kesejahteraan sosial">Kesejahteraan Sosial</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 text-sm border border-gray-300 rounded-md bg-white w-full sm:w-auto"
          >
            <option value="">Semua Status</option>
            <option value="disetujui">Disetujui</option>
            <option value="pending">Pending</option>
            <option value="ditolak">Ditolak</option>
          </select>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="h-9 px-3 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-100 w-full sm:w-auto"
          >
            Reset
          </button>
        </div>

        {/* Filter kanan */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative w-full sm:w-60">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cari nama LKS atau kecamatan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-sky-500 bg-white w-full"
            />
          </div>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center justify-center gap-1 border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-700 text-sm px-3 py-2 rounded-md transition w-full sm:w-auto"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {/* TABEL DATA */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl ring-1 ring-slate-200/60">
        {loading ? (
          <p className="text-center text-gray-500 p-4">Memuat data...</p>
        ) : displayedData.length > 0 ? (
          <table className="min-w-full text-sm text-slate-700 border border-slate-200">
            <thead className="bg-slate-100 text-slate-800 border-b border-slate-300">
              <tr>
                <th className="px-4 py-3 text-center border border-slate-200">
                  No
                </th>
                <th className="px-4 py-3 border border-slate-200">Nama LKS</th>
                <th className="px-4 py-3 border border-slate-200">
                  Jenis Layanan
                </th>
                <th className="px-4 py-3 border border-slate-200">Kecamatan</th>
                <th className="px-4 py-3 text-center border border-slate-200">
                  Status
                </th>
                <th className="px-4 py-3 text-center border border-slate-200">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedData.map((lks, index) => (
                <tr
                  key={lks.id}
                  className="hover:bg-slate-50 transition border-t border-slate-200"
                >
                  <td className="px-4 py-3 text-center border border-slate-200">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 border border-slate-200 font-medium text-slate-800">
                    {lks.nama || "-"}
                  </td>
                  <td className="px-4 py-3 border border-slate-200">
                    {lks.jenis_layanan || "-"}
                  </td>
                  <td className="px-4 py-3 border border-slate-200">
                    {lks.kecamatan?.nama || "-"}
                  </td>
                  <td className="px-4 py-3 text-center border border-slate-200">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        lks.status === "disetujui"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : lks.status === "pending"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {(lks.status || "TIDAK DIKETAHUI").toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center border border-slate-200">
                    <button
                      onClick={() => navigate(`/operator/lks/detail/${lks.id}`)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs text-sky-700 border border-sky-200 hover:bg-sky-50 transition"
                    >
                      <Eye size={14} />
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 p-5">
            Tidak ada data LKS ditemukan.
          </p>
        )}
      </div>

      {/* SHOW PER PAGE */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <label htmlFor="perPage">Tampilkan</label>
          <select
            id="perPage"
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="40">40</option>
          </select>
          <span>data per halaman</span>
        </div>

        <p>
          Menampilkan {Math.min(filtered.length, perPage)} dari {filtered.length} data
        </p>
      </div>
    </div>
  );
};

export default OperatorLKSList;
