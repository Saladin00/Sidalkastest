import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Eye, Pencil, Trash2, RotateCw, Loader2 } from "lucide-react";
import AdminLayout from "../../../components/AdminLayout";
import API from "../../../utils/api";

const LKSList = () => {
  const [lksList, setLksList] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const loadLKS = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await API.get("/lks", {
        params: { search: search || "" },
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("HASIL API:", res.data);

      const items = res.data?.data?.data ?? [];
      setLksList(items);
    } catch (error) {
      console.error(
        "❌ Gagal ambil data LKS:",
        error.response?.data || error.message || error
      );
      alert(
        error.response?.data?.message ||
          "Terjadi kesalahan saat memuat data LKS."
      );
    } finally {
      setLoading(false); // ⬅ WAJIB
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data LKS ini?")) return;
    try {
      await API.delete(`/lks/${id}`);
      loadLKS();
    } catch {
      alert("Terjadi kesalahan saat menghapus data.");
    }
  };

  useEffect(() => {
    loadLKS();
  }, [location]);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[18px] font-semibold text-gray-800">Daftar LKS</h2>

        <div className="flex items-center gap-2">
          <button
            onClick={loadLKS}
            className="flex items-center gap-1 border border-gray-300 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-100 text-sm transition"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <RotateCw size={14} />
            )}
            {loading ? "Memuat..." : "Refresh"}
          </button>

          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white">
            <input
              type="text"
              placeholder="Cari nama LKS"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1.5 text-sm outline-none"
            />
            <button
              onClick={loadLKS}
              className="bg-gray-100 px-3 py-1.5 text-gray-600 hover:bg-gray-200"
            >
              🔍
            </button>
          </div>

          <Link
            to="/admin/lks/tambah"
            className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 text-sm transition"
          >
            Tambah LKS
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-md shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-500">
            <Loader2 size={24} className="animate-spin mr-2" />
            Memuat data LKS...
          </div>
        ) : (
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-50 text-xs font-medium text-gray-600 border-b">
              <tr>
                <th className="px-4 py-3 text-center w-16 border-r">No</th>
                <th className="px-4 py-3 border-r">Nama</th>
                <th className="px-4 py-3 border-r">Jenis Layanan</th>
                <th className="px-4 py-3 border-r">Kecamatan</th>
                <th className="px-4 py-3 border-r">Status</th>
                <th className="px-4 py-3 text-center w-32">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {lksList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-400">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                lksList.map((lks, index) => (
                  <tr key={lks.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-center border-r">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 border-r font-medium text-gray-800">
                      {lks.nama}
                    </td>
                    <td className="px-4 py-3 border-r">{lks.jenis_layanan}</td>
                    <td className="px-4 py-3 border-r">
                      {lks.kecamatan?.nama || "-"}
                    </td>
                    <td className="px-4 py-3 border-r">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          lks.verifikasi_terbaru?.status?.toLowerCase() ===
                          "valid"
                            ? "bg-green-100 text-green-700"
                            : lks.verifikasi_terbaru?.status?.toLowerCase() ===
                              "tidak_valid"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {lks.verifikasi_terbaru?.status?.toUpperCase() ||
                          "PENDING"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-3">
                        <Link
                          to={`/admin/lks/detail/${lks.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          to={`/admin/lks/edit/${lks.id}`}
                          className="text-yellow-500 hover:text-yellow-600"
                        >
                          <Pencil size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(lks.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default LKSList;
