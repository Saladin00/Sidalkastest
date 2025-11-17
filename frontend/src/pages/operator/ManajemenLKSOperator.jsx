import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import { RotateCw, Loader2, Search } from "lucide-react";

const ManajemenLKSOperator = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Pagination (opsional)
  const [page, setPage] = useState(1);
  const perPage = 10;

  // 🔹 Ambil data akun LKS di kecamatan operator
  const loadUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const token = sessionStorage.getItem("token");
      const res = await API.get("/operator/users", {
        headers: { Authorization: `Bearer ${token}` },
        params: { search },
      });

      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Gagal memuat data:", err);
      setError("Gagal memuat data pengguna.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setTimeout(() => setRefreshing(false), 500);
  };

  // 🔹 Toggle status aktif / nonaktif
  const toggleStatus = async (id) => {
    if (!window.confirm("Ubah status akun LKS ini?")) return;

    try {
      const token = sessionStorage.getItem("token");
      await API.patch(`/operator/users/${id}/toggle-status`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await loadUsers();
      alert("Status akun berhasil diperbarui.");
    } catch (err) {
      console.error("Gagal ubah status:", err);
      alert("Gagal mengubah status akun.");
    }
  };

  // 🔹 Filter dan pagination
  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
        <h2 className="text-xl font-semibold text-slate-800">
          Manajemen Akun LKS di Kecamatan Anda
        </h2>

        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari nama/email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-slate-300 rounded-md px-3 py-1.5 pl-8 text-sm w-56 focus:ring-2 focus:ring-slate-500 outline-none"
            />
            <Search
              size={16}
              className="absolute left-2 top-2.5 text-slate-400"
            />
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 border border-slate-300 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-100 text-sm transition"
          >
            {refreshing ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <RotateCw size={14} />
            )}
            {refreshing ? "Memuat..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-rose-50 text-rose-700 border border-rose-200 px-4 py-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {/* TABEL DATA */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-x-auto">
        {loading ? (
          <div className="text-center py-10 text-gray-500 flex justify-center items-center gap-2">
            <Loader2 className="animate-spin" size={20} /> Memuat data...
          </div>
        ) : (
          <table className="min-w-full text-sm text-slate-700">
            <thead className="bg-slate-100 border-b text-xs font-semibold text-slate-600">
              <tr>
                <th className="px-4 py-3 w-12 text-center border-r">No</th>
                <th className="px-4 py-3 border-r">Username</th>
                <th className="px-4 py-3 border-r">Nama</th>
                <th className="px-4 py-3 border-r">Email</th>
                <th className="px-4 py-3 border-r">Status Akun</th>
                <th className="px-4 py-3 border-r">Kecamatan</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-8 text-slate-400 italic"
                  >
                    Tidak ada akun LKS ditemukan.
                  </td>
                </tr>
              ) : (
                paginated.map((u, idx) => (
                  <tr
                    key={u.id}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    <td className="px-4 py-3 text-center border-r">
                      {(page - 1) * perPage + idx + 1}
                    </td>
                    <td className="px-4 py-3 border-r">{u.username}</td>
                    <td className="px-4 py-3 border-r font-medium text-slate-800">
                      {u.name}
                    </td>
                    <td className="px-4 py-3 border-r">{u.email}</td>
                    <td className="px-4 py-3 border-r">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          u.status_aktif
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {u.status_aktif ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-r">
                      {u.kecamatan?.nama || "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleStatus(u.id)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                          u.status_aktif
                            ? "text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100"
                            : "text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100"
                        }`}
                      >
                        {u.status_aktif ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center text-sm text-slate-600 mt-3">
        <p>
          Menampilkan {Math.min(users.length, page * perPage)} dari{" "}
          {users.length} data
        </p>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ⬅️ Prev
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next ➡️
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManajemenLKSOperator;
