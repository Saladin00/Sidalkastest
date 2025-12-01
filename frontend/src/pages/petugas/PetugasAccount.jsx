import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import PetugasLayout from "../../components/PetugasLayout";
import { User, Mail, KeyRound } from "lucide-react";

export default function PetugasAccount() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [form, setForm] = useState({ name: "", email: "", username: "" });
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const toastOptions = {
    position: "top-right",
    autoClose: 2500,
    theme: "colored",
    icon: false,
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await API.get("/account");
      const kecRes = await API.get("/kecamatan");
      const u = res.data.user;

      const list =
        kecRes.data.kecamatan || kecRes.data.data || kecRes.data || [];
      const kecamatanNama = list.find((k) => k.id === u.kecamatan_id)?.nama ?? "-";

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
      toast.error("Gagal memuat profil petugas", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  const confirmAction = async (title, text, confirmText, actionFn) => {
    const result = await Swal.fire({
      title,
      text,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0ea5e9",
      cancelButtonColor: "#6b7280",
      confirmButtonText: confirmText,
      cancelButtonText: "Batal",
    });
    if (result.isConfirmed) await actionFn();
  };

  const updateProfile = (e) => {
    e.preventDefault();
    confirmAction(
      "Simpan Perubahan Profil?",
      "Data profil Anda akan diperbarui.",
      "Ya, Simpan",
      async () => {
        try {
          await API.post("/account/update-email", { email: form.email });
          toast.success("Profil berhasil diperbarui", toastOptions);
          loadProfile();
        } catch {
          toast.error("Gagal memperbarui profil", toastOptions);
        }
      }
    );
  };

  const updateUsername = (e) => {
    e.preventDefault();
    confirmAction(
      "Ubah Username?",
      "Pastikan username tidak sama dengan sebelumnya.",
      "Ya, Ubah",
      async () => {
        try {
          await API.post("/account/update-username", {
            username: form.username,
          });
          toast.success("Username berhasil diperbarui", toastOptions);
          loadProfile();
        } catch {
          toast.error("Gagal memperbarui username", toastOptions);
        }
      }
    );
  };

  const updatePassword = (e) => {
    e.preventDefault();
    confirmAction(
      "Ganti Password?",
      "Pastikan Anda mengingat password baru Anda.",
      "Ya, Ganti",
      async () => {
        try {
          await API.post("/account/update-password", passwordForm);
          toast.success("Password berhasil diperbarui", toastOptions);
          setPasswordForm({
            current_password: "",
            new_password: "",
            new_password_confirmation: "",
          });
        } catch (err) {
          toast.error(
            err.response?.data?.message || "Gagal memperbarui password",
            toastOptions
          );
        }
      }
    );
  };

  if (loading)
    return (
      <PetugasLayout>
        <div className="max-w-3xl mx-auto mt-16 p-8 bg-white rounded-2xl shadow animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-2/4"></div>
        </div>
      </PetugasLayout>
    );

  return (
    <PetugasLayout>
      <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-md border border-slate-100">
        <h2 className="text-2xl font-bold text-sky-700 mb-8">
          Pengaturan Akun Petugas Lapangan
        </h2>

        {/* Informasi Akun & Edit Profil */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Informasi Akun */}
          <div className="bg-sky-50 border border-sky-100 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-sky-700 mb-5 text-lg">
              Informasi Akun
            </h3>
            <div className="text-sm text-slate-700 space-y-2">
              <InfoRow label="Username" value={profile.username} />
              <InfoRow label="Nama" value={profile.name} />
              <InfoRow label="Email" value={profile.email} />
              <InfoRow label="Role" value={profile.role.toUpperCase()} />
              <InfoRow label="Kecamatan" value={profile.kecamatan} />
            </div>
          </div>

          {/* Edit Profil */}
          <div className="bg-sky-50 border border-sky-100 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-sky-700 mb-4 text-lg">Edit Profil</h3>
            <form onSubmit={updateProfile} className="space-y-4">
              <InputWithIcon
                icon={<User size={16} />}
                label="Nama"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <InputWithIcon
                icon={<Mail size={16} />}
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <button className="btn-primary w-full">Simpan Perubahan</button>
            </form>
          </div>
        </div>

        {/* Edit Username */}
        <div className="bg-sky-50 border border-sky-100 p-6 rounded-xl shadow-sm mb-10">
          <h3 className="font-semibold text-sky-700 mb-4 text-lg">Edit Username</h3>
          <form onSubmit={updateUsername} className="space-y-4">
            <InputWithIcon
              icon={<User size={16} />}
              label="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <button className="btn-primary w-full">Update Username</button>
          </form>
        </div>

        {/* Ganti Password */}
        <div className="bg-sky-50 border border-sky-100 p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold text-sky-700 mb-4 text-lg">Ganti Password</h3>
          <form onSubmit={updatePassword} className="space-y-4">
            <InputWithIcon
              icon={<KeyRound size={16} />}
              label="Password Lama"
              type="password"
              value={passwordForm.current_password}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  current_password: e.target.value,
                })
              }
            />
            <InputWithIcon
              icon={<KeyRound size={16} />}
              label="Password Baru"
              type="password"
              value={passwordForm.new_password}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  new_password: e.target.value,
                })
              }
            />
            <InputWithIcon
              icon={<KeyRound size={16} />}
              label="Konfirmasi Password Baru"
              type="password"
              value={passwordForm.new_password_confirmation}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  new_password_confirmation: e.target.value,
                })
              }
            />
            <button className="btn-primary w-full">Update Password</button>
          </form>
        </div>
      </div>
    </PetugasLayout>
  );
}

// Komponen info baris rapi sejajar
function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-3 text-sm">
      <span className="font-medium text-slate-800">{label}</span>
      <span className="col-span-2 text-slate-700">: {value}</span>
    </div>
  );
}

// Komponen input seragam dengan ikon
function InputWithIcon({ icon, label, type = "text", ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-600 mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-400 transition-all">
        {icon && <span className="text-slate-500">{icon}</span>}
        <input
          type={type}
          className="flex-1 outline-none text-sm bg-transparent text-slate-800"
          {...props}
          required
        />
      </div>
    </div>
  );
}
