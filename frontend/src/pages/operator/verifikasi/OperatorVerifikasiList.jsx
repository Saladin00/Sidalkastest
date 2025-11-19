// src/pages/operator/verifikasi/OperatorVerifikasiList.jsx
import React, { useEffect, useState } from "react";
import { Eye, Loader2, RotateCw } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../../utils/api";

const OperatorVerifikasiList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/operator/verifikasi");
      setData(res.data?.data ?? []);
    } catch (err) {
      console.error("❌ Gagal ambil data verifikasi:", err);
      alert("Gagal memuat data verifikasi.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setTimeout(() => setRefreshing(false), 400);
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "menunggu":
        return "bg-gray-100 text-gray-700 border border-gray-300";
      case "proses_survei":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "valid":
        return "bg-green-100 text-green-700 border border-green-300";
      case "tidak_valid":
        return "bg-red-100 text-red-700 border border-red-300";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-300";
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl border border-slate-300 p-6">
      {/* Header */}
      <div className="flex justify-end mb-5">
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1 border border-slate-300 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-100 text-sm transition"
        >
          {refreshing ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <RotateCw size={14} />
          )}
          {refreshing ? "Memuat..." : "Refresh"}
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-10 text-gray-500">
          <Loader2 className="animate-spin mr-2" /> Memuat data...
        </div>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-500 italic py-10">
          Belum ada data verifikasi di kecamatan ini.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-300">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 text-slate-700 text-xs font-semibold uppercase border-b border-slate-300">
              <tr>
                <th className="px-3 py-3 border-r border-slate-300 text-center">No</th>
                <th className="px-3 py-3 border-r border-slate-300">Nama LKS</th>
                <th className="px-3 py-3 border-r border-slate-300">Petugas</th>
                <th className="px-3 py-3 border-r border-slate-300">Tanggal</th>
                <th className="px-3 py-3 border-r border-slate-300 text-center">Status</th>
                <th className="px-3 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <tr
                  key={item.id}
                  className="border-t border-slate-300 hover:bg-slate-50 transition"
                >
                  <td className="px-3 py-2 text-center border-r border-slate-300">
                    {i + 1}
                  </td>
                  <td className="px-3 py-2 border-r border-slate-300 font-medium text-slate-800">
                    {item.lks?.nama || "-"}
                  </td>
                  <td className="px-3 py-2 border-r border-slate-300 text-slate-700">
                    {item.petugas?.name || "-"}
                  </td>
                  <td className="px-3 py-2 border-r border-slate-300 text-slate-700">
                    {item.tanggal_verifikasi
                      ? new Date(item.tanggal_verifikasi).toLocaleDateString("id-ID")
                      : "-"}
                  </td>
                  <td className="px-3 py-2 border-r border-slate-300 text-center">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-block ${getStatusStyle(
                        item.status
                      )}`}
                    >
                      {item.status?.toUpperCase() || "MENUNGGU"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <Link
                      to={`/operator/verifikasi/detail/${item.id}`}
                      className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-800 text-sm font-medium transition"
                    >
                      <Eye size={16} /> Lihat Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OperatorVerifikasiList;
