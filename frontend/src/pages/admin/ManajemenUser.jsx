import React, { useEffect, useState } from "react";
import API from "../../utils/api";

const ManajemenUser = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [daftarKecamatan, setDaftarKecamatan] = useState([]);

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

  // 🔹 Ambil semua user
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/users");
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("❌ Gagal ambil data user:", err);
      setError("Gagal memuat data pengguna.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Ambil daftar kecamatan
  const fetchKecamatan = async () => {
    try {
      const res = await API.get("/kecamatan");
      setDaftarKecamatan(res.data.data || []);
    } catch (err) {
      console.error("Gagal ambil daftar kecamatan:", err);
    }
  };

  // 🔹 Buat akun baru (oleh admin)
  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      alert("Semua field wajib diisi!");
      return;
    }

    try {
      await API.post("/users", formData);
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

  // 🔹 Toggle aktif/nonaktif
  const handleToggleStatus = async (userId) => {
    if (!window.confirm("Ubah status aktif pengguna ini?")) return;
    try {
      await API.patch(`/users/${userId}/toggle-status`);
      fetchUsers();
    } catch (err) {
      console.error("❌ Gagal ubah status pengguna:", err);
      alert("Gagal mengubah status pengguna.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-700">
          👥 Manajemen Pengguna
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
        >
          ➕ Tambah User
        </button>
      </div>

      {error && (
        <p className="text-red-600 bg-red-100 border border-red-300 rounded p-3 mb-4">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Memuat data...</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Kecamatan</th>
                <th className="px-4 py-2">Status Akun</th>
                <th className="px-4 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{user.username}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2 capitalize">{user.role}</td>
                    <td className="px-4 py-2">
                      {user.kecamatan?.nama || "-"}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`font-semibold ${
                          user.status_aktif ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {user.status_aktif ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className="text-blue-600 hover:underline"
                      >
                        {user.status_aktif ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    Tidak ada pengguna.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 🧾 Modal Tambah User */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              ➕ Tambah Akun Baru
            </h2>
            <form onSubmit={handleCreateUser} className="space-y-3">
              <input
                type="text"
                placeholder="Username"
                className="w-full border rounded p-2"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Nama Lengkap"
                className="w-full border rounded p-2"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border rounded p-2"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border rounded p-2"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />

              {/* Pilihan Role */}
              <select
                className="w-full border rounded p-2"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="operator">Operator</option>
                <option value="petugas">Petugas</option>
              </select>

              {/* Pilihan Kecamatan */}
              {(formData.role === "operator" ||
                formData.role === "petugas") && (
                <select
                  className="w-full border rounded p-2"
                  value={formData.kecamatan_id}
                  onChange={(e) =>
                    setFormData({ ...formData, kecamatan_id: e.target.value })
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
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
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
