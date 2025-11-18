import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/api";
import { Eye, FileEdit, Loader2, RotateCw } from "lucide-react";

const VerifikasiList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 🔹 Load data dari backend
  const loadVerifikasi = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/verifikasi", { params: { search } });
      console.log("📦 Response API:", res.data);

      const result = res.data?.data?.data; // ambil array dari pagination Laravel
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("❌ Gagal ambil data verifikasi:", err);
      alert("Gagal memuat data verifikasi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVerifikasi();
  }, []);

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg border border-slate-200 p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Data Verifikasi
        </h2>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Cari nama LKS / petugas..."
            className="border rounded-md px-3 py-1.5 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={loadVerifikasi}
            className="bg-slate-900 text-white px-3 py-1.5 rounded text-sm hover:bg-black"
          >
            Cari
          </button>
          <button
            onClick={loadVerifikasi}
            className="flex items-center gap-1 border px-3 py-1.5 rounded text-sm text-slate-600 hover:bg-slate-100"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <RotateCw size={16} />
            )}
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-500">
            <Loader2 className="animate-spin mr-2" /> Memuat data verifikasi...
          </div>
        ) : (
          <table className="min-w-full text-sm border">
            <thead className="bg-slate-100 text-slate-700 text-xs font-semibold">
              <tr>
                <th className="px-4 py-2 border">No</th>
                <th className="px-4 py-2 border">LKS</th>
                <th className="px-4 py-2 border">Petugas</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Tanggal</th>
                <th className="px-4 py-2 border text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    Tidak ada data verifikasi.
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-t hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-2 text-center">{index + 1}</td>
                    <td className="px-4 py-2">{item.lks?.nama || "-"}</td>
                    <td className="px-4 py-2">{item.petugas?.name || "-"}</td>
                    <td className="px-4 py-2 capitalize">
                      <span
                        className={`font-medium px-2 py-1 rounded-full text-xs ${
                          item.status === "valid"
                            ? "bg-green-100 text-green-700"
                            : item.status === "tidak_valid"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.status || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {item.tanggal_verifikasi || "-"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center gap-2">
                        {/* Tombol Detail */}
                        <Link
                          to={`/admin/verifikasi/detail/${item.id}`}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs text-sky-700 hover:bg-sky-50"
                        >
                          <Eye size={14} /> Detail
                        </Link>

                        {/* Tombol Review */}
                        <Link
                          to={`/admin/verifikasi/review/${item.id}`}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs text-emerald-700 hover:bg-emerald-50"
                        >
                          <FileEdit size={14} /> Review
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
  );
};

export default VerifikasiList;
