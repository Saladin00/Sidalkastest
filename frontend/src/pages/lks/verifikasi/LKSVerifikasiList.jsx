import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Eye, Plus, Trash2 } from "lucide-react";
import api from "../../../utils/api";

const LKSVerifikasiList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Ambil data verifikasi
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/lks/verifikasi");
      setData(res.data?.data ?? []);
    } catch (err) {
      alert("Gagal memuat data verifikasi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🔹 Fungsi hapus
  const handleDelete = async (id) => {
    const konfirmasi = window.confirm(
      "Apakah Anda yakin ingin menghapus pengajuan verifikasi ini?"
    );
    if (!konfirmasi) return;

    try {
      setLoading(true);
      await api.delete(`/lks/verifikasi/${id}`);
      alert("✅ Data verifikasi berhasil dihapus.");
      await loadData();
    } catch (err) {
      console.error("❌ Gagal menghapus:", err);
      alert("Terjadi kesalahan saat menghapus data verifikasi.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Warna status
  const renderStatus = (status) => {
    const style =
      status === "valid"
        ? "bg-green-100 text-green-700 border-green-200"
        : status === "tidak_valid"
        ? "bg-red-100 text-red-700 border-red-200"
        : "bg-yellow-100 text-yellow-700 border-yellow-200";

    return (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-medium border ${style}`}
      >
        {status?.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md border border-slate-200 p-6">

      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Riwayat Pengajuan Verifikasi
        </h2>

        <Link
          to="/lks/verifikasi/pengajuan"
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm px-4 py-2.5 rounded-lg transition-all"
        >
          <Plus size={16} /> Ajukan Verifikasi Baru
        </Link>
      </div>

      {/* ===== LOADING ===== */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-gray-500">
          <Loader2 className="animate-spin mr-2" /> Memuat data verifikasi...
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-10 text-gray-500 italic">
          Belum ada pengajuan verifikasi.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-slate-300 rounded-lg">
            <thead>
              <tr className="bg-slate-100 text-slate-700 uppercase text-xs font-semibold">
                {["No", "Tanggal", "Status", "Catatan", "Aksi"].map((head) => (
                  <th
                    key={head}
                    className="px-4 py-3 border border-slate-300 text-center"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.map((item, i) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 transition-all border-b border-slate-200"
                >
                  <td className="px-4 py-3 text-center border border-slate-300">
                    {i + 1}
                  </td>

                  <td className="px-4 py-3 text-center border border-slate-300">
                    {item.tanggal_verifikasi
                      ? new Date(item.tanggal_verifikasi).toLocaleDateString(
                          "id-ID"
                        )
                      : "-"}
                  </td>

                  <td className="px-4 py-3 text-center border border-slate-300">
                    {renderStatus(item.status)}
                  </td>

                  <td className="px-4 py-3 border border-slate-300">
                    {item.catatan || "-"}
                  </td>

                  {/* ===== AKSI ===== */}
                  <td className="px-4 py-3 text-center border border-slate-300">
                    <div className="flex justify-center gap-2">
                      {/* Tombol Detail */}
                      <Link
                        to={`/lks/verifikasi/detail/${item.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sky-600 border border-sky-300 rounded-md 
                        hover:bg-sky-50 transition text-xs font-medium"
                      >
                        <Eye size={14} /> Detail
                      </Link>

                      {/* Tombol Hapus */}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-rose-600 border border-rose-300 rounded-md 
                        hover:bg-rose-50 transition text-xs font-medium"
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
    </div>
  );
};

export default LKSVerifikasiList;