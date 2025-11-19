import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import { Search, UserPlus, X, RotateCcw, Trash2 } from "lucide-react";

const ManajemenUser = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [daftarKecamatan, setDaftarKecamatan] = useState([]);
  const [activeFilter, setActiveFilter] = useState("semua");

  const [searchTerm, setSearchTerm] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    role: "operator",
    kecamatan_id: "",
  });

  useEffect(() => {
    fetchUsers();
    fetchKecamatan();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await API.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const all = res.data.users || [];
      setAllUsers(all);
      setDisplayedUsers(all);
      setActiveFilter("semua");
    } catch (err) {
      console.error("Gagal memuat data pengguna:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchKecamatan = async () => {
    try {
      const res = await API.get("/kecamatan");
      setDaftarKecamatan(res.data.data || []);
    } catch (err) {
      console.error("Gagal ambil daftar kecamatan:", err);
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

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      await API.post("/admin/users", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Akun berhasil dibuat!");
      setShowForm(false);
      setFormData({
        username: "",
        name: "",
        email: "",
        password: "",
        role: "operator",
        kecamatan_id: "",
      });
      fetchUsers();
    } catch {
      alert("Gagal membuat akun baru.");
    }
  };

  const handleToggleStatus = async (id) => {
    if (!window.confirm("Ubah status aktif pengguna ini?")) return;
    try {
      const token = sessionStorage.getItem("token");
      await API.patch(`/admin/users/${id}/toggle-status`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch {
      alert("Gagal mengubah status pengguna.");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Yakin ingin menghapus pengguna ini?")) return;
    try {
      const token = sessionStorage.getItem("token");
      await API.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Pengguna berhasil dihapus.");
      fetchUsers();
    } catch {
      alert("Gagal menghapus pengguna.");
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* TOP BAR */}
      <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: "semua", label: "Semua User" },
            { key: "operator", label: "Operator" },
            { key: "petugas", label: "Petugas" },
            { key: "lks", label: "LKS" },
            { key: "admin", label: "Admin" },
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() => applyFilter(btn.key)}
              className={`px-4 py-1.5 text-xs rounded-md border transition ${
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
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
          >
            <RotateCcw size={14} /> Muat Ulang
          </button>
        </div>

        {/* Search + Add */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari user..."
              className="pl-7 pr-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-slate-500 bg-white min-w-[200px]"
            />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm"
          >
            <UserPlus size={16} /> Tambah User
          </button>
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <p className="text-center text-gray-500">Memuat data...</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-xl ring-1 ring-slate-200/60">
          <table className="w-full text-left text-sm border-collapse border border-gray-200">
            <thead>
              <tr className="bg-slate-100 text-slate-800 border-b border-gray-300">
                <th className="px-4 py-3 w-14 font-semibold border border-gray-200">No</th>
                <th className="px-4 py-3 font-semibold border border-gray-200">Username</th>
                <th className="px-4 py-3 font-semibold border border-gray-200">Nama</th>
                <th className="px-4 py-3 font-semibold border border-gray-200">Email</th>
                <th className="px-4 py-3 font-semibold border border-gray-200">Role</th>
                <th className="px-4 py-3 font-semibold border border-gray-200">Kecamatan</th>
                <th className="px-4 py-3 font-semibold border border-gray-200">Status</th>
                <th className="px-4 py-3 text-center font-semibold border border-gray-200">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length ? (
                paginatedUsers.map((user, i) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 border border-gray-200">{startIndex + i + 1}</td>
                    <td className="px-4 py-3 border border-gray-200">{user.username}</td>
                    <td className="px-4 py-3 border border-gray-200">{user.name}</td>
                    <td className="px-4 py-3 border border-gray-200">{user.email}</td>
                    <td className="px-4 py-3 border border-gray-200 capitalize">{user.role}</td>
                    <td className="px-4 py-3 border border-gray-200">{user.kecamatan?.nama || "-"}</td>
                    <td className="px-4 py-3 border border-gray-200">
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
                    <td className="px-4 py-3 border border-gray-200 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className={`px-3 py-1.5 text-xs rounded-full ${
                            user.status_aktif
                              ? "text-rose-700 ring-1 ring-rose-200 hover:bg-rose-50"
                              : "text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-50"
                          }`}
                        >
                          {user.status_aktif ? "Nonaktifkan" : "Aktifkan"}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1.5 rounded-full text-red-700 ring-1 ring-red-200 hover:bg-red-50 flex items-center justify-center"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500 border border-gray-200">
                    Tidak ada data pengguna.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* FORM TAMBAH USER */}
     {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-3 border-b">
              <h3 className="text-sm font-semibold">Tambah Akun Baru</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="px-5 py-4 space-y-4">
              {["username", "name", "email", "password"].map((key) => (
                <div key={key} className="space-y-1">
                  <label className="text-xs font-medium capitalize">{key}</label>
                  <input
                    type={key === "password" ? "password" : "text"}
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-slate-500"
                    required
                  />
                </div>
              ))}
              <div className="space-y-1">
                <label className="text-xs font-medium">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="operator">Operator</option>
                  <option value="petugas">Petugas</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Kecamatan</label>
                <select
                  value={formData.kecamatan_id}
                  onChange={(e) => setFormData({ ...formData, kecamatan_id: e.target.value })}
                  required
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Pilih Kecamatan</option>
                  {daftarKecamatan.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded-md"
                >
                  Batal
                </button>
                <button type="submit" className="px-4 py-1.5 text-xs bg-slate-900 text-white rounded-md">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BOTTOM CONTROLS */}
      <div className="mt-3 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 gap-2">
        <div className="flex items-center gap-2">
          <span>Tampilkan</span>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-md px-2 py-1 bg-white text-xs"
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
              currentPageSafe === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
          >
            &laquo; Sebelumnya
          </button>
          <span>
            Halaman {currentPageSafe} dari {totalPages}
          </span>
          <button
            disabled={currentPageSafe === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
  );
};

export default ManajemenUser;
