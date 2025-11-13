import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import { Search, UserPlus, X } from "lucide-react";

const ManajemenUser = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [daftarKecamatan, setDaftarKecamatan] = useState([]);

  // 🔍 Search & Pagination
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

  // ===== FETCH DATA =====
  useEffect(() => {
    fetchUsers();
    fetchKecamatan();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = sessionStorage.getItem("token");
      const res = await API.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("❌ Gagal ambil data user:", err);
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

  // ===== CRUD =====
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      alert("Semua field wajib diisi!");
      return;
    }
    try {
      const token = sessionStorage.getItem("token");
      await API.post("/users", formData, {
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
    } catch (err) {
      console.error("❌ Gagal membuat user:", err);
      alert("Gagal membuat akun baru.");
    }
  };

  const handleToggleStatus = async (userId) => {
    if (!window.confirm("Ubah status aktif pengguna ini?")) return;
    try {
      const token = sessionStorage.getItem("token");
      await API.patch(`/users/${userId}/toggle-status`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("❌ Gagal ubah status pengguna:", err);
      alert("Gagal mengubah status pengguna.");
    }
  };

  // ===== FILTER & PAGINATION =====
  const filteredUsers = users.filter((u) => {
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
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + perPage
  );

  // ===== UI =====
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 🔝 Toolbar */}
      <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span>Show</span>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-md px-2 py-1 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
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
              className="pl-7 pr-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-slate-500 bg-white min-w-[200px]"
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

      {/* ⚠️ Error */}
      {error && (
        <p className="text-red-600 bg-red-100 border border-red-300 rounded p-3 mb-4">
          {error}
        </p>
      )}

      {/* 📊 Table */}
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
                <th className="px-4 py-3 font-semibold">Status Akun</th>
                <th className="px-4 py-3 text-center font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, idx) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-200/60 last:border-b-0 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3">{startIndex + idx + 1}</td>
                    <td className="px-4 py-3">{user.username}</td>
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3 capitalize">{user.role}</td>
                    <td className="px-4 py-3">
                      {user.kecamatan?.nama || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          user.status_aktif
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-rose-50 text-rose-700 border border-rose-100"
                        }`}
                      >
                        {user.status_aktif ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {user.status_aktif ? (
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-200 hover:bg-rose-50 transition"
                        >
                          Nonaktifkan
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-50 transition"
                        >
                          Aktifkan
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-6 text-gray-500"
                  >
                    Tidak ada pengguna.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 📑 Pagination Info */}
      {!loading && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-3 text-xs text-gray-600 gap-2">
          <div>
            {filteredUsers.length > 0
              ? (
                <>
                  Showing{" "}
                  <span className="font-semibold">{startIndex + 1}</span> to{" "}
                  <span className="font-semibold">
                    {Math.min(startIndex + perPage, filteredUsers.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold">
                    {filteredUsers.length}
                  </span>{" "}
                  entries
                </>
              )
              : "Showing 0 entries"}
          </div>

          <div className="flex items-center gap-1 self-start md:self-auto">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPageSafe === 1}
              className={`px-2 py-1.5 border rounded-md ${
                currentPageSafe === 1
                  ? "text-gray-300 border-gray-200 cursor-not-allowed"
                  : "text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 border rounded-md ${
                  page === currentPageSafe
                    ? "bg-slate-900 text-white border-slate-900"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPageSafe === totalPages}
              className={`px-2 py-1.5 border rounded-md ${
                currentPageSafe === totalPages
                  ? "text-gray-300 border-gray-200 cursor-not-allowed"
                  : "text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ➕ Modal Tambah User */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-3 border-b">
              <h3 className="text-sm font-semibold text-gray-800">
                Tambah Akun Baru
              </h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="px-5 py-4 space-y-4">
              {[
                { key: "username", label: "Username", type: "text" },
                { key: "name", label: "Nama Lengkap", type: "text" },
                { key: "email", label: "Email", type: "email" },
                { key: "password", label: "Password", type: "password" },
              ].map((f) => (
                <div key={f.key} className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500"
                    value={formData[f.key]}
                    onChange={(e) =>
                      setFormData({ ...formData, [f.key]: e.target.value })
                    }
                    required
                  />
                </div>
              ))}

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  Role
                </label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="operator">Operator</option>
                  <option value="petugas">Petugas</option>
                </select>
              </div>

              {(formData.role === "operator" ||
                formData.role === "petugas") && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    Kecamatan
                  </label>
                  <select
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
                    value={formData.kecamatan_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        kecamatan_id: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Pilih Kecamatan</option>
                    {daftarKecamatan.map((kec) => (
                      <option key={kec.id} value={kec.id}>
                        {kec.nama}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t mt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-3 py-1.5 text-xs rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs rounded-md bg-slate-900 text-white hover:bg-black"
                >
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
