import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Loader2, RotateCw } from "lucide-react";
import api from "../../../utils/api";

const PetugasVerifikasiList = () => {
  const [verifikasi, setVerifikasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/petugas/verifikasi");
      setVerifikasi(res.data?.data ?? []);
    } catch (err) {
      console.error("❌ Gagal ambil data verifikasi:", err);
      alert("Gagal memuat data verifikasi petugas.");
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
    <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg border border-slate-200 p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-5 gap-3">
        <h2 className="text-lg font-semibold text-slate-800">
          Daftar Verifikasi Lapangan
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

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-16 text-gray-500">
          <Loader2 className="animate-spin mr-2" /> Memuat data verifikasi...
        </div>
      ) : verifikasi.length === 0 ? (
        <p className="text-center text-gray-500 italic py-10">
          Belum ada tugas verifikasi dari operator.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-slate-200">
            <thead className="bg-slate-100 text-slate-700 text-xs font-semibold">
              <tr>
                <th className="px-3 py-2 border-r">No</th>
                <th className="px-3 py-2 border-r">Nama LKS</th>
                <th className="px-3 py-2 border-r">Tanggal</th>
                <th className="px-3 py-2 border-r">Status</th>
                <th className="px-3 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {verifikasi.map((item, i) => (
                <tr key={item.id} className="border-t hover:bg-slate-50">
                  <td className="px-3 py-2 text-center">{i + 1}</td>
                  <td className="px-3 py-2 font-medium text-slate-800">
                    {item.lks?.nama || "-"}
                  </td>
                  <td className="px-3 py-2">
                    {item.tanggal_verifikasi
                      ? new Date(item.tanggal_verifikasi).toLocaleDateString(
                          "id-ID"
                        )
                      : "-"}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
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
                      to={`/petugas/verifikasi/detail/${item.id}`}
                      className="text-sky-600 hover:text-sky-800 inline-flex items-center gap-1"
                    >
                      <Eye size={16} /> Detail
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

export default PetugasVerifikasiList;
