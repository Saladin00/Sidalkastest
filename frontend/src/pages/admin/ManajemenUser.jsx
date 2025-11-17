import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import { Search, UserPlus, X } from "lucide-react";

const ManajemenUser = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [daftarKecamatan, setDaftarKecamatan] = useState([]);
  const [activeFilter, setActiveFilter] = useState("operator_petugas"); // default

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
      // default tampilkan operator + petugas
      setDisplayedUsers(all.filter((u) => ["operator", "petugas"].includes(u.role)));
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data pengguna.");
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
      await API.patch(`/admin/users/${id}/toggle-status`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchUsers();
    } catch {
      alert("Gagal mengubah status pengguna.");
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
      {/* Toolbar */}
      <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span>Show</span>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-md px-2 py-1 bg-white text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
          <span>entries</span>
        </div>

        <div className="flex items-center gap-3 md:justify-end">
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
            <UserPlus size={16} />
            <span>Tambah User</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
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
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center text-gray-500">Memuat data...</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-xl ring-1 ring-slate-200/60">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-800">
                <th className="px-4 py-3 w-14 font-semibold">No</th>
                <th className="px-4 py-3 font-semibold">Username</th>
                <th className="px-4 py-3 font-semibold">Nama</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Kecamatan</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-center font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length ? (
                paginatedUsers.map((user, i) => (
                  <tr key={user.id} className="border-b hover:bg-slate-50">
                    <td className="px-4 py-3">{startIndex + i + 1}</td>
                    <td className="px-4 py-3">{user.username}</td>
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3 capitalize">{user.role}</td>
                    <td className="px-4 py-3">{user.kecamatan?.nama || "-"}</td>
                    <td className="px-4 py-3">
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
                    <td className="px-4 py-3 text-center">
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
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500">
                    Tidak ada data pengguna.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Tambah User */}
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
    </div>
  );
};

export default ManajemenUser;
