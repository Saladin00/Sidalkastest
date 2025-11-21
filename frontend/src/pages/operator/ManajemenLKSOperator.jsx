import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import { RotateCw, Loader2, Search } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManajemenLKSOperator = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [perPage, setPerPage] = useState(10);

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
      // ✅ Tidak ada toast sukses/gagal
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
  const toggleStatus = async (id, status_aktif) => {
    const result = await Swal.fire({
      title: "Ubah Status Akun?",
      text: `Akun ini akan ${
        status_aktif ? "dinonaktifkan" : "diaktifkan"
      }. Lanjutkan?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0ea5e9",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Lanjutkan",
      cancelButtonText: "Batal",
      reverseButtons: true,
      background: "#fff",
      color: "#374151",
      backdrop: "rgba(0,0,0,0.4)",
    });

    if (!result.isConfirmed) return;

    try {
      const token = sessionStorage.getItem("token");
      await API.patch(`/operator/users/${id}/toggle-status`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await loadUsers();
      toast.success("Status akun berhasil diperbarui.", { autoClose: 2000 });
    } catch (err) {
      console.error("Gagal ubah status:", err);
      toast.error("Gagal mengubah status akun.", { autoClose: 2500 });
    }
  };

  // 🔹 Filter data
  const filtered = users.filter((u) => {
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      !statusFilter ||
      (statusFilter === "aktif" && u.status_aktif) ||
      (statusFilter === "nonaktif" && !u.status_aktif);
    return matchSearch && matchStatus;
  });

  const paginated = filtered.slice(0, perPage);

  const handleReset = () => {
    setSearch("");
    setStatusFilter("");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
        <h2 className="text-xl font-semibold text-slate-800">
          Manajemen Akun LKS di Kecamatan Anda
        </h2>

        {/* FILTER BAR */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 text-sm border border-slate-300 rounded-md bg-white"
          >
            <option value="">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>

        

          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cari nama/email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-sky-500 bg-white w-56"
            />
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-700 px-3 py-1.5 rounded-md text-sm transition"
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
                {[
                  "No",
                  "Username",
                  "Nama",
                  "Email",
                  "Status Akun",
                  "Kecamatan",
                  "Aksi",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 border-r text-center">
                    {h}
                  </th>
                ))}
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
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3 border-r">{u.username}</td>
                    <td className="px-4 py-3 border-r font-medium text-slate-800">
                      {u.name}
                    </td>
                    <td className="px-4 py-3 border-r">{u.email}</td>
                    <td className="px-4 py-3 text-center border-r">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                          u.status_aktif
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {u.status_aktif ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center border-r">
                      {u.kecamatan?.nama || "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleStatus(u.id, u.status_aktif)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition border ${
                          u.status_aktif
                            ? "text-rose-700 bg-rose-50 border-rose-200 hover:bg-rose-100"
                            : "text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
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

      {/* FOOTER */}
      <div className="flex justify-between items-center text-sm text-slate-600 mt-3">
        <div className="flex items-center gap-2">
          <label htmlFor="perPage">Tampilkan</label>
          <select
            id="perPage"
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            {[5, 10, 20, 40, 60, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span>data per halaman</span>
        </div>

        <p>
          Menampilkan {Math.min(filtered.length, perPage)} dari {filtered.length} data
        </p>
      </div>

      <ToastContainer position="top-right" autoClose={2500} theme="light" />
    </div>
  );
};

export default ManajemenLKSOperator;
