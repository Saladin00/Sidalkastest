// src/pages/admin/verifikasi/VerifikasiList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/api";
import { Eye, FileEdit, Loader2, RotateCw } from "lucide-react";
import { showInfo, showError } from "../../../utils/toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifikasiList = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  // 🔹 Ambil data awal
  const loadVerifikasi = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/verifikasi");
      const result = res.data?.data?.data || res.data?.data || [];
      const list = Array.isArray(result) ? result : [];
      setData(list);
      setFiltered(list);
    } catch (err) {
      console.error("❌ Gagal ambil data verifikasi:", err);
      showError("Gagal memuat data verifikasi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVerifikasi();
  }, []);

  // 🔹 Filter dan pencarian
  useEffect(() => {
    let temp = [...data];
    if (status) temp = temp.filter((item) => item.status === status);
    if (search) {
      const q = search.toLowerCase();
      temp = temp.filter(
        (item) =>
          item.lks?.nama?.toLowerCase().includes(q) ||
          item.petugas?.name?.toLowerCase().includes(q)
      );
    }
    setFiltered(temp);
  }, [search, status, data]);

  const handleReset = () => {
    setSearch("");
    setStatus("");
    setFiltered(data);
    showInfo("Filter dan pencarian telah direset.");
  };

  // 🔹 Warna status (disamakan semua role)
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

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-7xl space-y-4">
        {/* ====== Filter & Search ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white border border-slate-200 shadow-sm px-4 py-3 rounded-lg">
          {/* Filter + Reset */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-slate-300 rounded-full px-3 py-2 text-xs sm:text-sm text-gray-700 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition bg-white"
            >
              <option value="">Semua Status</option>
              <option value="menunggu">Menunggu</option>
              <option value="proses_survei">Proses Survei</option>
              <option value="valid">Valid</option>
              <option value="tidak_valid">Tidak Valid</option>
            </select>

            <button
              onClick={handleReset}
              className="flex items-center gap-1 border border-slate-300 text-slate-600 hover:bg-slate-100 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm transition"
            >
              {loading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <RotateCw size={15} />
              )}
              Reset
            </button>
          </div>

          {/* Pencarian */}
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Cari nama LKS / petugas..."
              className="w-full sm:w-72 border border-slate-300 rounded-full px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ====== Tabel ====== */}
        <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center py-20 text-gray-500 text-sm">
              <Loader2 className="animate-spin mr-2" /> Memuat data verifikasi...
            </div>
          ) : (
            <table className="min-w-full text-xs sm:text-sm border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-semibold uppercase">
                <tr>
                  <th className="border border-slate-200 px-3 py-2 text-center w-12">
                    No
                  </th>
                  <th className="border border-slate-200 px-3 py-2 text-left">
                    Nama LKS
                  </th>
                  <th className="border border-slate-200 px-3 py-2 text-left">
                    Petugas
                  </th>
                  <th className="border border-slate-200 px-3 py-2 text-center">
                    Status
                  </th>
                  <th className="border border-slate-200 px-3 py-2 text-center">
                    Tanggal
                  </th>
                  <th className="border border-slate-200 px-3 py-2 text-center w-32">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-6 text-gray-500 italic"
                    >
                      Tidak ada data verifikasi ditemukan.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item, i) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 transition-colors border-t border-slate-100"
                    >
                      <td className="border border-slate-200 px-3 py-2 text-center font-medium text-slate-700">
                        {i + 1}
                      </td>
                      <td className="border border-slate-200 px-3 py-2">
                        {item.lks?.nama || "-"}
                      </td>
                      <td className="border border-slate-200 px-3 py-2">
                        {item.petugas?.name || "-"}
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-center">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${getStatusStyle(
                            item.status
                          )}`}
                        >
                          {item.status?.replace("_", " ") || "-"}
                        </span>
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-center">
                        {item.tanggal_verifikasi
                          ? new Date(
                              item.tanggal_verifikasi
                            ).toLocaleDateString("id-ID")
                          : "-"}
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-center">
                        <div className="flex justify-center items-center gap-2 flex-nowrap">
                          <Link
                            to={`/admin/verifikasi/detail/${item.id}`}
                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-sky-100 text-sky-700 border border-sky-200 rounded hover:bg-sky-200 whitespace-nowrap transition"
                          >
                            <Eye size={13} /> Detail
                          </Link>
                          <Link
                            to={`/admin/verifikasi/review/${item.id}`}
                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200 rounded hover:bg-emerald-200 whitespace-nowrap transition"
                          >
                            <FileEdit size={13} /> Review
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

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

export default VerifikasiList;
