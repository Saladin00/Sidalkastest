import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import { toast } from "react-toastify";
import OperatorLayout from "../../components/OperatorLayout";
import { User, Mail, KeyRound } from "lucide-react";

export default function OperatorAccount() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    kecamatan: "",
  });

  const [kecamatanList, setKecamatanList] = useState([]);


  const [form, setForm] = useState({ name: "", email: "" });
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
    const kecListRes = await API.get("/kecamatan");

    let list = [];

    // 🔥 DETEKSI FORMAT API /kecamatan
    if (Array.isArray(kecListRes.data)) {
      list = kecListRes.data;
    } else if (Array.isArray(kecListRes.data.kecamatan)) {
      list = kecListRes.data.kecamatan;
    } else if (Array.isArray(kecListRes.data.data)) {
      list = kecListRes.data.data;
    } else {
      console.warn("⚠ Format kecamatan tidak dikenali:", kecListRes.data);
    }

    const u = res.data.user;

    const kecamatanNama =
      list.find((k) => k.id === u.kecamatan_id)?.nama || "-";

    setProfile({
      username: u.username,
      name: u.name,
      email: u.email,
      role: u.roles?.[0]?.name ?? "operator",
      kecamatan: kecamatanNama,
    });

    setForm({
      username: u.username,
      name: u.name,
      email: u.email,
    });

  } catch (err) {
    console.error(err);
    toast.error("Gagal memuat profil");
  }

  setLoading(false);
};




  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      await API.post("/account/update-email", { email: form.email });

      toast.success("Profil berhasil diperbarui");
      loadProfile();
    } catch {
      toast.error("Gagal memperbarui profil");
    }
  };

  const updateUsername = async (e) => {
    e.preventDefault();
    try {
      await API.post("/account/update-username", {
        username: form.username,
      });

      toast.success("Username berhasil diperbarui");
      loadProfile();
    } catch {
      toast.error("Gagal memperbarui username");
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/account/update-password", passwordForm);
      toast.success("Password berhasil diperbarui");
      setPasswordForm({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal memperbarui password");
    }
  };

  if (loading) return <OperatorLayout>Loading...</OperatorLayout>;

  return (
    <OperatorLayout>
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 text-sky-700">
          Pengaturan Akun Operator
        </h2>

        {/* Informasi akun */}
        <div className="mb-8 p-4 bg-slate-50 border rounded-lg">
          <p>
            <b>username:</b> {profile.username}
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
          <p>
            <b>Kecamatan:</b> {profile.kecamatan}
          </p>
        </div>

        {/* Update Profil */}
        <h3 className="font-semibold text-sky-600 mb-2">Edit Profil</h3>
        <form onSubmit={updateProfile} className="space-y-4 mb-8">
          <div>
            <label className="text-sm font-semibold">Nama</label>
            <div className="flex gap-2 items-center border rounded px-3 py-2">
              <User size={16} />
              <input
                className="flex-1 outline-none"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">Email</label>
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
            Simpan Perubahan
          </button>
        </form>
        <h3 className="font-semibold text-sky-600 mb-2">Edit Username</h3>
        <form onSubmit={updateUsername} className="space-y-4 mb-8">
          <div>
            <label className="text-sm font-semibold">Username</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Update Username
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
    </OperatorLayout>
  );
}
