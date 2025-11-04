import React, { useEffect, useState } from "react";
import API from "../../utils/api";

const ManajemenUser = () => {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({
        id: null,
        username: "",
        name: "",
        email: "",
        password: "",
        role: "lks",
        status_aktif: true,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await API.get("/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(res.data.users);
        } catch (err) {
            console.error("Gagal ambil data user:", err);
            setError("Gagal memuat data pengguna.");
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (isEditing) {
                await API.put(`/users/${form.id}`, form, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("User berhasil diperbarui");
            } else {
                await API.post("/users", form, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("User berhasil ditambahkan");
            }
            fetchUsers();
            resetForm();
        } catch (err) {
            console.error("Gagal simpan user:", err);
            alert("Terjadi kesalahan saat menyimpan user.");
        }
    };

    const handleEdit = (user) => {
        setForm({
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            password: "",
            role: user.role,
            status_aktif: user.status_aktif,
        });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus user ini?")) return;
        try {
            const token = localStorage.getItem("token");
            await API.delete(`/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("User berhasil dihapus");
            fetchUsers();
        } catch (err) {
            console.error("Gagal hapus user:", err);
            alert("Terjadi kesalahan saat menghapus user.");
        }
    };

    const resetForm = () => {
        setForm({
            id: null,
            username: "",
            name: "",
            email: "",
            password: "",
            role: "lks",
            status_aktif: true,
        });
        setIsEditing(false);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-gray-700">
                👥 Manajemen Pengguna
            </h1>

            {/* Form tambah/edit */}
            <div className="bg-white shadow-md rounded-lg p-4 mb-6">
                <h2 className="text-lg font-semibold mb-2">
                    {isEditing ? "✏️ Edit User" : "➕ Tambah User"}
                </h2>
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-2 gap-4"
                >
                    {/* Username */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            name="username"
                            placeholder="Masukkan username"
                            value={form.username}
                            onChange={handleChange}
                            className="border p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                            required
                        />
                    </div>

                    {/* Nama Lengkap */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            Nama Lengkap
                        </label>
                        <input
                            name="name"
                            placeholder="Masukkan nama lengkap"
                            value={form.name}
                            onChange={handleChange}
                            className="border p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col col-span-2">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            name="email"
                            placeholder="Masukkan email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className="border p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                            required
                        />
                    </div>

                    {/* Role */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            Role
                        </label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="border p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                        >
                            <option value="admin">Admin</option>
                            <option value="operator">Operator</option>
                            <option value="petugas">Petugas</option>
                            <option value="lks">LKS</option>
                        </select>
                    </div>

                    {/* Status Aktif */}
                    <div className="flex items-center gap-2 mt-6">
                        <input
                            type="checkbox"
                            name="status_aktif"
                            checked={form.status_aktif}
                            onChange={handleChange}
                            className="w-4 h-4 accent-emerald-600"
                        />
                        <label className="text-sm font-medium text-gray-700">
                            Aktif
                        </label>
                    </div>

                    {/* Tombol */}
                    <div className="col-span-2 flex gap-2 mt-4">
                        <button
                            type="submit"
                            className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
                        >
                            {isEditing ? "Simpan Perubahan" : "Tambah User"}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Batal
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Tabel daftar user */}
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-emerald-600 text-white">
                            <th className="px-4 py-2">#</th>
                            <th className="px-4 py-2">Username</th>
                            <th className="px-4 py-2">Nama</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Role</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr
                                key={user.id}
                                className="border-b hover:bg-gray-50"
                            >
                                <td className="px-4 py-2">{index + 1}</td>
                                <td className="px-4 py-2">{user.username}</td>
                                <td className="px-4 py-2">{user.name}</td>
                                <td className="px-4 py-2">{user.email}</td>
                                <td className="px-4 py-2">{user.role}</td>
                                <td className="px-4 py-2">
                                    {user.status_aktif ? (
                                        <span className="text-green-600 font-semibold">
                                            Aktif
                                        </span>
                                    ) : (
                                        <span className="text-red-600 font-semibold">
                                            Nonaktif
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-2 space-x-2">
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="text-center py-4 text-gray-500"
                                >
                                    Tidak ada pengguna
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManajemenUser;
