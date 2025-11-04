import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "../../../components/AdminLayout";
import API from "../../../utils/api";

const LKSList = () => {
  const [lksList, setLksList] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 🔹 Ambil data LKS dari API
  const loadLKS = async () => {
    try {
      const res = await API.get("/lks", {
        params: { search },
      });
      setLksList(res.data);
    } catch (error) {
      console.error("Gagal ambil data LKS:", error);
    }
  };

  // 🔹 Hapus data
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus data LKS ini?");
    if (!confirmDelete) return;
    try {
      await API.delete(`/lks/${id}`);
      loadLKS();
    } catch (error) {
      console.error("Gagal hapus data:", error);
      alert("Terjadi kesalahan saat menghapus data.");
    }
  };

  useEffect(() => {
    loadLKS();
  }, []);

  // 🔹 Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = lksList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(lksList.length / itemsPerPage);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[18px] font-semibold text-gray-800">Daftar LKS</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white">
            <input
              type="text"
              placeholder="Search"
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
            className="bg-[#1e3a8a] text-white px-4 py-2 rounded-md hover:bg-[#1e40af] text-sm transition"
          >
            Tambah LKS
          </Link>
        </div>
      </div>

      {/* 📋 Tabel */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-md shadow-sm">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-50 text-xs font-medium text-gray-600 border-b">
            <tr>
              <th className="px-4 py-3 text-center w-16 border-r">No</th>
              <th className="px-4 py-3 border-r">Nama</th>
              <th className="px-4 py-3 border-r">Jenis</th>
              <th className="px-4 py-3 border-r">Kecamatan</th>
              <th className="px-4 py-3 border-r">Status</th>
              <th className="px-4 py-3 text-center w-32">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            ) : (
              currentItems.map((lks, index) => (
                <tr
                  key={lks.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-center border-r">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="px-4 py-3 border-r font-medium text-gray-800">
                    {lks.nama}
                  </td>
                  <td className="px-4 py-3 border-r">{lks.jenis_layanan}</td>
                  <td className="px-4 py-3 border-r">{lks.kecamatan}</td>
                  <td className="px-4 py-3 border-r">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        lks.status === "Aktif"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {lks.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <Link
                        to={`/admin/lks/detail/${lks.id}`}
                        className="text-blue-600 hover:text-blue-800"
                        title="Detail"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        to={`/admin/lks/edit/${lks.id}`}
                        className="text-yellow-500 hover:text-yellow-600"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(lks.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Hapus"
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
      </div>

      {/* 📄 Pagination & Show per page */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>per page</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 border rounded ${
              currentPage === 1
                ? "text-gray-400 border-gray-200"
                : "hover:bg-gray-100"
            }`}
          >
            Prev
          </button>
          <span>
            {currentPage} / {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-3 py-1 border rounded ${
              currentPage === totalPages || totalPages === 0
                ? "text-gray-400 border-gray-200"
                : "hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default LKSList;
