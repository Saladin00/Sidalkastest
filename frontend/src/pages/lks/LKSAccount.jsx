import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import { toast } from "react-toastify";
import LKSLayout from "../../components/LKSLayout";
import { User, Mail, KeyRound } from "lucide-react";

export default function LKSAccount() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    username: "",
    name: "",
    email: "",
    kecamatan: "-",
  });

  const [form, setForm] = useState({ username: "", email: "" });
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
      const kecRes = await API.get("/kecamatan");
      const u = res.data.user;

      const kecList =
        kecRes.data.kecamatan || kecRes.data.data || kecRes.data || [];

      const kecName =
        kecList.find((k) => k.id === u.kecamatan_id)?.nama || "-";

      setProfile({
        username: u.username,
        name: u.name,
        email: u.email,
        kecamatan: kecName,
      });

      setForm({
        username: u.username,
        email: u.email,
      });

    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat profil akun LKS");
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
      await API.post("/account/update-username", {
        username: form.username,
      });
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

      toast.success("Password diperbarui!");

      setPasswordForm({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal memperbarui password");
    }
  };

  if (loading) return <LKSLayout>Loading...</LKSLayout>;

  return (
    <LKSLayout>
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 text-sky-700">
          Pengaturan Akun LKS
        </h2>

        {/* Info akun */}
        <div className="mb-8 p-4 bg-slate-50 border rounded-lg">
          <p><b>Username:</b> {profile.username}</p>
          <p><b>Email:</b> {profile.email}</p>
          <p><b>Kecamatan:</b> {profile.kecamatan}</p>
        </div>

        {/* EMAIL */}
        <h3 className="font-semibold text-sky-600 mb-2">Ubah Email</h3>
        <form onSubmit={updateEmail} className="space-y-3 mb-8">
          <div className="flex items-center gap-2 border p-2 rounded">
            <Mail size={16} />
            <input
              className="flex-1 outline-none"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <button className="bg-sky-600 text-white px-4 py-2 rounded">
            Simpan Email
          </button>
        </form>

        {/* USERNAME */}
        <h3 className="font-semibold text-sky-600 mb-2">Ubah Username</h3>
        <form onSubmit={updateUsername} className="space-y-3 mb-8">
          <div className="flex items-center gap-2 border p-2 rounded">
            <User size={16} />
            <input
              className="flex-1 outline-none"
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
            />
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded">
            Simpan Username
          </button>
        </form>

        {/* PASSWORD */}
        <h3 className="font-semibold text-sky-600 mb-2">Ganti Password</h3>
        <form onSubmit={updatePassword} className="space-y-3">
          <div className="flex items-center gap-2 border p-2 rounded">
            <KeyRound size={16} />
            <input
              type="password"
              placeholder="Password Lama"
              className="flex-1 outline-none"
              value={passwordForm.current_password}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  current_password: e.target.value,
                })
              }
            />
          </div>

          <div className="flex items-center gap-2 border p-2 rounded">
            <KeyRound size={16} />
            <input
              type="password"
              placeholder="Password Baru"
              className="flex-1 outline-none"
              value={passwordForm.new_password}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  new_password: e.target.value,
                })
              }
            />
          </div>

          <div className="flex items-center gap-2 border p-2 rounded">
            <KeyRound size={16} />
            <input
              type="password"
              placeholder="Konfirmasi Password"
              className="flex-1 outline-none"
              value={passwordForm.new_password_confirmation}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  new_password_confirmation: e.target.value,
                })
              }
            />
          </div>

          <button className="bg-emerald-600 text-white px-4 py-2 rounded">
            Update Password
          </button>
        </form>
      </div>
    </LKSLayout>
  );
}
