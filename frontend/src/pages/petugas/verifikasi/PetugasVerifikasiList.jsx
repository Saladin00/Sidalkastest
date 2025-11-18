// src/pages/petugas/verifikasi/PetugasVerifikasiList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Plus, Loader2 } from "lucide-react";
import api from "../../../utils/api";

const PetugasVerifikasiList = () => {
  const [verifikasi, setVerifikasi] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/petugas/verifikasi");
      setVerifikasi(res.data?.data ?? []);
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

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-md rounded-md border border-slate-200 p-5">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Daftar Verifikasi Lapangan
        </h2>
        <Link
          to="/petugas/verifikasi/tambah"
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md text-sm"
        >
          <Plus size={16} /> Tambah Verifikasi
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10 text-gray-500">
          <Loader2 className="animate-spin mr-2" /> Memuat data...
        </div>
      ) : verifikasi.length === 0 ? (
        <p className="text-center text-gray-500 italic py-10">
          Belum ada data verifikasi.
        </p>
      ) : (
        <table className="min-w-full text-sm border">
          <thead className="bg-slate-100 text-slate-700 text-xs font-semibold">
            <tr>
              <th className="px-3 py-2 border-r">No</th>
              <th className="px-3 py-2 border-r">LKS</th>
              <th className="px-3 py-2 border-r">Tanggal</th>
              <th className="px-3 py-2 border-r">Status</th>
              <th className="px-3 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {verifikasi.map((item, index) => (
              <tr key={item.id} className="border-t hover:bg-slate-50">
                <td className="px-3 py-2 text-center">{index + 1}</td>
                <td className="px-3 py-2">{item.lks?.nama || "-"}</td>
                <td className="px-3 py-2">
                  {item.tanggal_verifikasi
                    ? new Date(item.tanggal_verifikasi).toLocaleString("id-ID")
                    : "-"}
                </td>
                <td className="px-3 py-2 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
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

export default PetugasVerifikasiList;
