import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/api";
import { Eye, FileEdit, Loader2, RotateCw } from "lucide-react";

const VerifikasiList = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]); // <- hasil filter tampil di tabel
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("dikirim_admin");

  // 🔹 Ambil semua data sekali
  const loadVerifikasi = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/verifikasi");
      const result = res.data?.data?.data || res.data?.data || [];
      setData(Array.isArray(result) ? result : []);
      setFiltered(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("❌ Gagal ambil data verifikasi:", err);
      alert("Gagal memuat data verifikasi.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Load data awal
  useEffect(() => {
    loadVerifikasi();
  }, []);

  // 🔹 Jalankan filter & search di frontend
  useEffect(() => {
    let temp = [...data];

    if (status) {
      temp = temp.filter((item) => item.status === status);
    }

    if (search) {
      const lower = search.toLowerCase();
      temp = temp.filter(
        (item) =>
          item.lks?.nama?.toLowerCase().includes(lower) ||
          item.petugas?.name?.toLowerCase().includes(lower)
      );
    }

    setFiltered(temp);
  }, [search, status, data]);

  // 🔹 Reset semua filter
  const handleReset = () => {
    setSearch("");
    setStatus("dikirim_admin");
    setFiltered(data.filter((item)=> item.status === "dikirim_admin"));
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-7xl space-y-4">
        {/* 🔹 Filter & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 shadow-sm px-4 py-3 rounded-lg">
          {/* Left: Filter + Reset */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
            >
              <option value="">Semua Status</option>
              <option value="menunggu">Menunggu</option>
              <option value="dikirim_operator">Dikirim Operator</option>
              <option value="dikirim_petugas">Dikirim Petugas</option>
              <option value="dikirim_admin">Dikirim Admin</option>
              <option value="proses_survei">Proses Survei</option>
              <option value="valid">Valid</option>
              <option value="tidak_valid">Tidak Valid</option>
            </select>

            <button
              onClick={handleReset}
              className="flex items-center gap-1 border border-slate-300 text-slate-600 hover:bg-slate-100 px-4 py-1.5 rounded-lg text-sm transition"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <RotateCw size={16} />
              )}
              Reset
            </button>
          </div>

          {/* Right: Search */}
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Cari nama LKS / petugas..."
              className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm w-64 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* 🔹 Tabel Data */}
        <div className="overflow-x-auto bg-white border border-slate-200 rounded-lg shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center py-20 text-gray-500">
              <Loader2 className="animate-spin mr-2" /> Memuat data
              verifikasi...
            </div>
          ) : (
            <table className="min-w-full text-sm border-collapse border border-slate-200">
              <thead className="bg-slate-100 text-slate-700 text-xs font-semibold uppercase">
                <tr>
                  <th className="border border-slate-200 px-4 py-2 text-center w-14">
                    No
                  </th>
                  <th className="border border-slate-200 px-4 py-2 text-left">
                    Nama LKS
                  </th>
                  <th className="border border-slate-200 px-4 py-2 text-left">
                    Petugas
                  </th>
                  <th className="border border-slate-200 px-4 py-2 text-center">
                    Status
                  </th>
                  <th className="border border-slate-200 px-4 py-2 text-center">
                    Tanggal
                  </th>
                  <th className="border border-slate-200 px-4 py-2 text-center w-32">
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
                      <td className="border border-slate-200 px-4 py-2 text-center font-medium text-slate-700">
                        {i + 1}
                      </td>
                      <td className="border border-slate-200 px-4 py-2">
                        {item.lks?.nama || "-"}
                      </td>
                      <td className="border border-slate-200 px-4 py-2">
                        {item.petugas?.name || "-"}
                      </td>
                      <td className="border border-slate-200 px-4 py-2 text-center">
                        <span
                          className={`font-medium px-2 py-1 rounded-full text-xs capitalize ${
                            item.status === "valid"
                              ? "bg-green-100 text-green-700"
                              : item.status === "tidak_valid"
                              ? "bg-red-100 text-red-700"
                              : item.status === "proses_survei"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {item.status?.replace("_", " ") || "-"}
                        </span>
                      </td>
                      <td className="border border-slate-200 px-4 py-2 text-center">
                        {item.tanggal_verifikasi
                          ? new Date(
                              item.tanggal_verifikasi
                            ).toLocaleDateString("id-ID")
                          : "-"}
                      </td>
                      <td className="border border-slate-200 px-4 py-2 text-center">
                        <div className="flex justify-center gap-2">
                          <Link
                            to={`/admin/verifikasi/detail/${item.id}`}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-sky-300 text-xs text-sky-700 hover:bg-sky-50 transition"
                          >
                            <Eye size={14} /> Detail
                          </Link>
                          <Link
                            to={`/admin/verifikasi/review/${item.id}`}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-emerald-300 text-xs text-emerald-700 hover:bg-emerald-50 transition"
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
    </div>
  );
};

export default VerifikasiList;
