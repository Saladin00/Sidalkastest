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

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-md rounded-md border border-slate-200 p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Daftar Verifikasi Kecamatan
        </h2>
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

      {/* Tabel */}
      {loading ? (
        <div className="flex justify-center items-center py-10 text-gray-500">
          <Loader2 className="animate-spin mr-2" /> Memuat data...
        </div>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-500 italic py-10">
          Belum ada data verifikasi di kecamatan ini.
        </p>
      ) : (
        <table className="min-w-full text-sm border">
          <thead className="bg-slate-100 text-slate-700 text-xs font-semibold">
            <tr>
              <th className="px-3 py-2 border-r">No</th>
              <th className="px-3 py-2 border-r">Nama LKS</th>
              <th className="px-3 py-2 border-r">Petugas</th>
              <th className="px-3 py-2 border-r">Tanggal</th>
              <th className="px-3 py-2 border-r">Status</th>
              <th className="px-3 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={item.id} className="border-t hover:bg-slate-50">
                <td className="px-3 py-2 text-center">{i + 1}</td>
                <td className="px-3 py-2">{item.lks?.nama || "-"}</td>
                <td className="px-3 py-2">{item.petugas?.name || "-"}</td>
                <td className="px-3 py-2">
                  {item.tanggal_verifikasi
                    ? new Date(item.tanggal_verifikasi).toLocaleDateString("id-ID")
                    : "-"}
                </td>
                <td className="px-3 py-2 text-center">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.status === "valid"
                        ? "bg-green-100 text-green-700"
                        : item.status === "tidak_valid"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status?.toUpperCase()}
                  </span>
                </td>
                <td className="px-3 py-2 text-center">
                  <Link
                    to={`/operator/verifikasi/detail/${item.id}`}
                    className="text-sky-600 hover:text-sky-800"
                  >
                    <Eye size={18} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OperatorVerifikasiList;
