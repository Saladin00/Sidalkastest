// src/pages/lks/verifikasi/LKSVerifikasiList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Eye, Plus, Trash2, Filter } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import api from "../../../utils/api";
import { showSuccess, showError, showInfo } from "../../../utils/toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LKSVerifikasiList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("semua");

  // 🔹 Ambil data verifikasi
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/lks/verifikasi");
      setData(res.data?.data ?? []);
    } catch (err) {
      console.error(err);
      showError("Gagal memuat data verifikasi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🔹 Hapus data pakai SweetAlert
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Pengajuan Verifikasi?",
      text: "Data verifikasi akan dihapus secara permanen dari sistem.",
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

    try {
      setLoading(true);
      await api.delete(`/lks/verifikasi/${id}`);
      showSuccess("Data verifikasi berhasil dihapus!");
      await loadData();
    } catch (err) {
      console.error("❌ Gagal menghapus:", err);
      showError("Terjadi kesalahan saat menghapus data verifikasi.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Warna status
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

  // 🔹 Filter data
  const filteredData =
    filterStatus === "semua"
      ? data
      : data.filter(
          (item) => item.status?.toLowerCase() === filterStatus.toLowerCase()
        );

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md border border-slate-300 p-6">
      {/* ===== HEADER ===== */}
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

        <Link
          to="/lks/verifikasi/pengajuan"
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm px-4 py-2.5 rounded-lg transition-all"
        >
          <Plus size={16} /> Ajukan Verifikasi Baru
        </Link>
      </div>

      {/* ===== TABEL ===== */}
      {loading ? (
        <div className="flex justify-center items-center py-16 text-gray-400 text-sm">
          <Loader2 className="animate-spin mr-2" size={18} /> Memproses...
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-10 text-gray-500 italic">
          Tidak ada data verifikasi dengan status tersebut.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-300">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-slate-100 text-slate-700 text-xs font-semibold uppercase border-b border-slate-300">
              <tr>
                <th className="px-3 py-3 border-r border-slate-300 text-center">
                  No
                </th>
                <th className="px-3 py-3 border-r border-slate-300 text-center">
                  Tanggal
                </th>
                <th className="px-3 py-3 border-r border-slate-300 text-center">
                  Status
                </th>
                <th className="px-3 py-3 border-r border-slate-300 text-left">
                  Catatan
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

                  <td className="px-3 py-2 border-r border-slate-300 text-center text-slate-700">
                    {item.tanggal_verifikasi
                      ? new Date(item.tanggal_verifikasi).toLocaleDateString(
                          "id-ID"
                        )
                      : "-"}
                  </td>

                  <td className="px-3 py-2 border-r border-slate-300 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(
                        item.status
                      )}`}
                    >
                      {item.status?.replace("_", " ")?.toUpperCase() ||
                        "MENUNGGU"}
                    </span>
                  </td>

                  <td className="px-3 py-2 border-r border-slate-300 text-slate-700">
                    {item.catatan || "-"}
                  </td>

                  <td className="px-3 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/lks/verifikasi/detail/${item.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sky-600 border border-sky-300 rounded-md hover:bg-sky-50 transition text-xs font-medium"
                      >
                        <Eye size={14} /> Detail
                      </Link>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-rose-600 border border-rose-300 rounded-md hover:bg-rose-50 transition text-xs font-medium"
                      >
                        <Trash2 size={14} /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar
        newestOnTop
        theme="light"
      />
    </div>
  );
};

export default LKSVerifikasiList;
