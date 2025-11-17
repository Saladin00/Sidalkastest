import React, { useEffect, useState } from "react";
import API from "../../../utils/api";
import { Eye, Search, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OperatorLKSList = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
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

  // 🧭 Fungsi untuk refresh manual
  const handleRefresh = () => {
    fetchLKS();
  };

  // 🔍 Filter pencarian
  useEffect(() => {
    if (!Array.isArray(data)) return;
    const q = search.toLowerCase();
    const filteredData = data.filter(
      (item) =>
        item.nama?.toLowerCase().includes(q) ||
        item.jenis_layanan?.toLowerCase().includes(q) ||
        item.kecamatan?.nama?.toLowerCase().includes(q)
    );
    setFiltered(filteredData);
  }, [search, data]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header dan Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-semibold text-sky-900">
            Daftar LKS di Kecamatan
          </h2>
          <p className="text-sm text-gray-500">
            Lihat seluruh lembaga kesejahteraan sosial yang terdaftar di wilayah Anda.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cari nama LKS atau kecamatan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-sky-500 bg-white"
            />
          </div>

          {/* Tombol Refresh */}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-1 border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-700 text-sm px-3 py-2 rounded-md transition"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {/* Tabel Data */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl ring-1 ring-slate-200/60">
        {loading ? (
          <p className="text-center text-gray-500 p-4">Memuat data...</p>
        ) : Array.isArray(filtered) && filtered.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-800">
                <th className="px-4 py-3 w-14 font-semibold">No</th>
                <th className="px-4 py-3 font-semibold">Nama LKS</th>
                <th className="px-4 py-3 font-semibold">Jenis Layanan</th>
                <th className="px-4 py-3 font-semibold">Kecamatan</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-center font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lks, index) => (
                <tr
                  key={lks.id}
                  className="border-b border-slate-200/60 last:border-b-0 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {lks.nama || "-"}
                  </td>
                  <td className="px-4 py-3">{lks.jenis_layanan || "-"}</td>
                  <td className="px-4 py-3">{lks.kecamatan?.nama || "-"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        lks.status === "disetujui"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : lks.status === "pending"
                          ? "bg-amber-50 text-amber-700 border border-amber-100"
                          : "bg-rose-50 text-rose-700 border border-rose-100"
                      }`}
                    >
                      {(lks.status || "tidak diketahui").toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
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
    </div>
  );
};

export default OperatorLKSList;
