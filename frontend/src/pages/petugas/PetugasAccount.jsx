import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import { toast } from "react-toastify";
import PetugasLayout from "../../components/PetugasLayout";
import { User, Mail, KeyRound } from "lucide-react";

export default function PetugasAccount() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    username: "",
    name: "",
    email: "",
    role: "petugas",
    kecamatan: "-", // 🔥 Tambahkan kecamatan
  });

  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await API.get("/account");
      const u = res.data.user;

      // 🔥 Ambil data kecamatan aman untuk semua struktur API
      const kecRes = await API.get("/kecamatan");

      const list =
        kecRes.data.kecamatan || kecRes.data.data || kecRes.data || [];

      const kecamatanNama =
        list.find((k) => k.id === u.kecamatan_id)?.nama ?? "-";

      setProfile({
        username: u.username,
        name: u.name,
        email: u.email,
        role: u.roles?.[0]?.name ?? "petugas",
        kecamatan: kecamatanNama,
      });

      setForm({
        username: u.username,
        name: u.name,
        email: u.email,
      });
    } catch (err) {
      console.error("Gagal load data kecamatan:", err);
      toast.error("Gagal memuat profil");
    }

    setLoading(false);
  };

  const updateEmail = async (e) => {
    e.preventDefault();
    try {
      await API.post("/account/update-email", { email: form.email });
      toast.success("Email berhasil diperbarui!");
      loadProfile();
    } catch {
      toast.error("Email gagal diperbarui.");
    }
  };

  const updateUsername = async (e) => {
    e.preventDefault();
    try {
      await API.post("/account/update-username", { username: form.username });
      toast.success("Username berhasil diperbarui!");
      loadProfile();
    } catch {
      toast.error("Gagal memperbarui username.");
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    try {
      await API.post("/account/update-password", passwordForm);

      toast.success("Password berhasil diperbarui!");

      setPasswordForm({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Password gagal diperbarui");
    }
  };

  if (loading) return <PetugasLayout>Loading...</PetugasLayout>;

  return (
    <PetugasLayout>
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 text-sky-700">
          Pengaturan Akun Petugas Lapangan
        </h2>

        {/* Informasi akun */}
        <div className="mb-8 p-4 bg-slate-50 border rounded-lg">
          <p>
            <b>Username:</b> {profile.username}
          </p>
          <p>
            <b>Nama:</b> {profile.name}
          </p>
          <p>
            <b>Email:</b> {profile.email}
          </p>
          <p>
            <b>Role:</b> {profile.role.toUpperCase()}
          </p>

          {/* 🔥 Tampilkan kecamatan */}
          <p>
            <b>Kecamatan:</b> {profile.kecamatan}
          </p>
        </div>

        {/* Update Email */}
        <h3 className="font-semibold text-sky-600 mb-2">Ubah Email</h3>
        <form onSubmit={updateEmail} className="space-y-4 mb-8">
          <div>
            <label className="text-sm font-semibold">Email Baru</label>
            <div className="flex gap-2 items-center border rounded px-3 py-2">
              <Mail size={16} />
              <input
                className="flex-1 outline-none"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>
          <button className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700">
            Simpan Email
          </button>
        </form>

        {/* Update Username */}
        <h3 className="font-semibold text-sky-600 mb-2">Ubah Username</h3>
        <form onSubmit={updateUsername} className="space-y-4 mb-8">
          <div>
            <label className="text-sm font-semibold">Username Baru</label>
            <div className="flex gap-2 items-center border rounded px-3 py-2">
              <User size={16} />
              <input
                className="flex-1 outline-none"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Simpan Username
          </button>
        </form>

        {/* Update Password */}
        <h3 className="font-semibold text-sky-600 mb-2">Ganti Password</h3>
        <form onSubmit={updatePassword} className="space-y-4">
          <div>
            <label className="text-sm font-semibold">Password Lama</label>
            <div className="flex items-center gap-2 border rounded px-3 py-2">
              <KeyRound size={16} />
              <input
                type="password"
                className="flex-1 outline-none"
                value={passwordForm.current_password}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    current_password: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">Password Baru</label>
            <div className="flex items-center gap-2 border rounded px-3 py-2">
              <KeyRound size={16} />
              <input
                type="password"
                className="flex-1 outline-none"
                value={passwordForm.new_password}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    new_password: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">
              Konfirmasi Password Baru
            </label>
            <div className="flex items-center gap-2 border rounded px-3 py-2">
              <KeyRound size={16} />
              <input
                type="password"
                className="flex-1 outline-none"
                value={passwordForm.new_password_confirmation}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    new_password_confirmation: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <button className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">
            Update Password
          </button>
        </form>
      </div>
    </PetugasLayout>
  );
}
