// src/pages/petugas/verifikasi/PetugasVerifikasiList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Loader2, RotateCw, Filter } from "lucide-react";
import api from "../../../utils/api";

const PetugasVerifikasiList = () => {
  const [verifikasi, setVerifikasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState("semua");

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

  // 🔹 Warna status diseragamkan semua role
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "menunggu":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "proses_survei":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      case "valid":
        return "bg-green-100 text-green-700 border border-green-300";
      case "tidak_valid":
        return "bg-red-100 text-red-700 border border-red-300";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-300";
    }
  };

  const filteredData =
    filterStatus === "semua"
      ? verifikasi
      : verifikasi.filter(
          (item) => item.status?.toLowerCase() === filterStatus.toLowerCase()
        );

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl border border-slate-300 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-5 gap-3">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-slate-300 text-slate-700 text-sm rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="semua">Semua Status</option>
            <option value="menunggu">Menunggu</option>
            <option value="proses_survei">Proses Survei</option>
            <option value="valid">Valid</option>
            <option value="tidak_valid">Tidak Valid</option>
          </select>
        </div>

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
      ) : filteredData.length === 0 ? (
        <p className="text-center text-gray-500 italic py-10">
          Tidak ada data verifikasi dengan status tersebut.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-300">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 text-slate-700 text-xs font-semibold uppercase border-b border-slate-300">
              <tr>
                <th className="px-3 py-3 border-r border-slate-300 text-center">
                  No
                </th>
                <th className="px-3 py-3 border-r border-slate-300 text-left">
                  Nama LKS
                </th>
                <th className="px-3 py-3 border-r border-slate-300 text-center">
                  Tanggal
                </th>
                <th className="px-3 py-3 border-r border-slate-300 text-center">
                  Status
                </th>
                <th className="px-3 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, i) => (
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
                  <td className="px-3 py-2 border-r border-slate-300 text-center text-slate-700">
                    {item.tanggal_verifikasi
                      ? new Date(item.tanggal_verifikasi).toLocaleDateString(
                          "id-ID"
                        )
                      : "-"}
                  </td>
                  <td className="px-3 py-2 border-r border-slate-300 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full inline-block ${getStatusStyle(
                        item.status
                      )}`}
                    >
                      {item.status?.replace("_", " ")?.toUpperCase() ||
                        "MENUNGGU"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <Link
                      to={`/petugas/verifikasi/detail/${item.id}`}
                      className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-800 text-sm font-medium transition"
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
