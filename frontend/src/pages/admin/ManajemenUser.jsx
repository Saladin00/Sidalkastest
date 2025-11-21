// src/pages/admin/ManajemenUser.jsx
import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import { Search, RotateCcw, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError, showInfo } from "../../utils/toast";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManajemenUser = () => {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await API.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const users = res.data.users || [];
      setAllUsers(users);
      setDisplayedUsers(users);
      setActiveFilter("semua");
    } catch (err) {
      console.error("❌ Gagal memuat data pengguna:", err);
      showError("Gagal memuat data pengguna!");
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (filter) => {
    setActiveFilter(filter);

    if (filter === "semua") {
      setDisplayedUsers(allUsers);
    } else {
      setDisplayedUsers(allUsers.filter((u) => u.role === filter));
    }

    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleToggleStatus = async (id) => {
    const result = await Swal.fire({
      title: "Ubah Status Pengguna?",
      text: "Status aktif pengguna ini akan diubah.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Ubah",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return showInfo("Aksi dibatalkan");

    showInfo("Mengubah status pengguna...");
    try {
      const token = sessionStorage.getItem("token");
      await API.patch(
        `/admin/users/${id}/toggle-status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSuccess("Status pengguna berhasil diubah!");
      fetchUsers();
    } catch (err) {
      console.error("❌ Gagal mengubah status pengguna:", err);
      showError("Gagal mengubah status pengguna!");
    }
  };

  const handleDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Pengguna?",
      text: "Data pengguna akan dihapus secara permanen dari sistem.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e02424",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return showInfo("Aksi dibatalkan");

    showInfo("Menghapus pengguna...");
    try {
      const token = sessionStorage.getItem("token");
      await API.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showSuccess("Pengguna berhasil dihapus!");
      fetchUsers();
    } catch (err) {
      console.error("❌ Gagal menghapus pengguna:", err);
      showError("Gagal menghapus pengguna!");
    }
  };

  const filteredUsers = displayedUsers.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      u.username?.toLowerCase().includes(q) ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / perPage));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const startIndex = (currentPageSafe - 1) * perPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + perPage);

  return (
    <>
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        {/* ====== TOP BAR ====== */}
        <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Filter Group */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { key: "semua", label: "Semua" },
              { key: "operator", label: "Operator" },
              { key: "petugas", label: "Petugas" },
              { key: "lks", label: "LKS" },
              { key: "admin", label: "Admin" },
            ].map((btn) => (
              <button
                key={btn.key}
                onClick={() => applyFilter(btn.key)}
                className={`px-3 py-1.5 text-xs rounded-full border transition ${
                  activeFilter === btn.key
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {btn.label}
              </button>
            ))}
            <button
              onClick={fetchUsers}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-700 border border-gray-300 rounded-full hover:bg-gray-100 transition"
            >
              <RotateCcw
                size={14}
                className={loading ? "animate-spin text-sky-600" : ""}
              />{" "}
              Muat Ulang
            </button>
          </div>

          {/* Search + Tambah */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-2.5 top-2.5 text-gray-400"
              />
              <input
                type="text"
                placeholder="Cari user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-slate-400 bg-white w-44 sm:w-64"
              />
            </div>
            <button
              onClick={() => navigate("/admin/users/tambah")}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm"
            >
              <PlusCircle size={16} /> Tambah User
            </button>
          </div>
        </div>

        {/* ====== TABLE ====== */}
        {loading ? (
          <p className="text-center text-gray-500 py-8">Memuat data...</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-xl ring-1 ring-slate-200/60">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-semibold">
                <tr>
                  {[
                    "No",
                    "Username",
                    "Nama",
                    "Email",
                    "Role",
                    "Kecamatan",
                    "Status",
                    "Aksi",
                  ].map((head, idx) => (
                    <th
                      key={idx}
                      className="px-3 py-2 border border-gray-200 text-center"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length ? (
                  paginatedUsers.map((user, i) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="border px-3 py-2 text-center">
                        {startIndex + i + 1}
                      </td>
                      <td className="border px-3 py-2">{user.username}</td>
                      <td className="border px-3 py-2">{user.name}</td>
                      <td className="border px-3 py-2">{user.email}</td>
                      <td className="border px-3 py-2 capitalize">
                        {user.role}
                      </td>
                      <td className="border px-3 py-2">
                        {user.kecamatan?.nama || "-"}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.status_aktif
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {user.status_aktif ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="border px-3 py-2 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            className={`px-3 py-1 text-xs rounded-full transition ${
                              user.status_aktif
                                ? "text-rose-700 ring-1 ring-rose-200 hover:bg-rose-50"
                                : "text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-50"
                            }`}
                          >
                            {user.status_aktif ? "Nonaktifkan" : "Aktifkan"}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="px-3 py-1 text-xs rounded-full text-red-700 ring-1 ring-red-200 hover:bg-red-50 font-medium"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-6 text-gray-500 border-t"
                    >
                      Tidak ada data pengguna.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ====== PAGINATION ====== */}
        <div className="mt-3 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-600 gap-2">
          <div className="flex items-center gap-2">
            <span>Tampilkan</span>
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md px-2 py-1 bg-white"
            >
              {[5, 10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span>data per halaman</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPageSafe === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={`px-2 py-1 border rounded ${
                currentPageSafe === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              &laquo; Sebelumnya
            </button>
            <span>
              Halaman {currentPageSafe} dari {totalPages}
            </span>
            <button
              disabled={currentPageSafe === totalPages}
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              className={`px-2 py-1 border rounded ${
                currentPageSafe === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              Selanjutnya &raquo;
            </button>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar
        newestOnTop
        theme="light"
      />
    </>
  );
};

export default ManajemenUser;
