// src/pages/operator/lks/OperatorLKSList.jsx
import React, { useEffect, useState } from "react";
import { Eye, RotateCw, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../../utils/api";

const OperatorLKSList = () => {
  const [lksList, setLksList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const loadLKS = async () => {
    setLoading(true);
    try {
      const res = await api.get("/lks", { params: { search } });
      setLksList(res.data?.data || []);
    } catch (error) {
      console.error("Gagal mengambil data LKS:", error);
      alert("Terjadi kesalahan saat memuat data LKS.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLKS();
  }, []);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800">
          Daftar Lembaga Kesejahteraan Sosial (LKS)
        </h2>

        <div className="flex items-center gap-2">
          <div className="flex items-center border border-slate-300 rounded-md overflow-hidden bg-white">
            <input
              type="text"
              placeholder="Cari nama LKS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1.5 text-sm outline-none w-48"
            />
            <button
              onClick={loadLKS}
              className="bg-slate-100 px-3 py-1.5 text-slate-600 hover:bg-slate-200 transition"
            >
              🔍
            </button>
          </div>

          <button
            onClick={loadLKS}
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
            Memuat data LKS...
          </div>
        ) : (
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-slate-50 text-xs font-medium text-slate-600 border-b">
              <tr>
                <th className="px-4 py-3 text-center w-16 border-r">No</th>
                <th className="px-4 py-3 border-r">Nama LKS</th>
                <th className="px-4 py-3 border-r">Jenis Layanan</th>
                <th className="px-4 py-3 border-r">Kecamatan</th>
                <th className="px-4 py-3 border-r">Status</th>
                <th className="px-4 py-3 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {lksList.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-slate-400 italic"
                  >
                    Tidak ada data LKS ditemukan.
                  </td>
                </tr>
              ) : (
                lksList.map((lks, index) => (
                  <tr
                    key={lks.id}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    <td className="px-4 py-3 text-center border-r">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 border-r font-medium text-slate-800">
                      {lks.nama}
                    </td>
                    <td className="px-4 py-3 border-r">
                      {lks.jenis_layanan || "-"}
                    </td>
                    <td className="px-4 py-3 border-r">
                      {lks.kecamatan?.nama || "-"}
                    </td>
                    <td className="px-4 py-3 border-r">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          lks.verifikasi_terbaru?.status?.toLowerCase() ===
                          "valid"
                            ? "bg-green-100 text-green-700"
                            : lks.verifikasi_terbaru?.status?.toLowerCase() ===
                              "tidak_valid"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {lks.verifikasi_terbaru?.status?.toUpperCase() ||
                          "PENDING"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        to={`/operator/lks/detail/${lks.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={18} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OperatorLKSList;
