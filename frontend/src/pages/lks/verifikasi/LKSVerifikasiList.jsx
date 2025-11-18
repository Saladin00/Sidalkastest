import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Eye, Plus, AlertCircle } from "lucide-react";
import api from "../../../utils/api";

const LKSVerifikasiList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/lks/verifikasi");
      setData(res.data?.data ?? []);
    } catch (err) {
      console.error("❌ Gagal ambil data verifikasi:", err);
      alert("Gagal memuat data verifikasi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const renderStatus = (status) => {
    const color =
      status === "valid"
        ? "bg-green-100 text-green-700"
        : status === "tidak_valid"
        ? "bg-red-100 text-red-700"
        : "bg-yellow-100 text-yellow-700";
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {status?.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md border border-slate-200 p-6">
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

      {loading ? (
        <div className="flex justify-center items-center py-20 text-gray-500">
          <Loader2 className="animate-spin mr-2" /> Memuat data verifikasi...
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-10 text-gray-500 italic">
          Belum ada pengajuan verifikasi.
        </div>
      ) : (
        <table className="min-w-full text-sm border border-slate-200">
          <thead className="bg-slate-100 text-slate-600 text-xs font-semibold">
            <tr>
              <th className="px-4 py-2 border">No</th>
              <th className="px-4 py-2 border">Tanggal</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Catatan</th>
              <th className="px-4 py-2 border text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={item.id} className="border-t hover:bg-slate-50">
                <td className="px-4 py-2 text-center">{i + 1}</td>
                <td className="px-4 py-2 text-center">
                  {item.tanggal_verifikasi
                    ? new Date(item.tanggal_verifikasi).toLocaleDateString(
                        "id-ID"
                      )
                    : "-"}
                </td>
                <td className="px-4 py-2 text-center">
                  {renderStatus(item.status)}
                </td>
                <td className="px-4 py-2">{item.catatan || "-"}</td>
                <td className="px-4 py-2 text-center">
                  <Link
                    to={`/lks/verifikasi/detail/${item.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sky-600 border border-sky-200 rounded-md hover:bg-sky-50 transition text-xs font-medium"
                  >
                    <Eye size={14} /> Detail
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

export default LKSVerifikasiList;
