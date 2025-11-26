import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import AdminLayout from "../../components/AdminLayout";
import { toast } from "react-toastify";
import { Mail, User, KeyRound, Save } from "lucide-react";

export default function AccountSettings() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await API.get("/account");
      setUser(res.data.user);

      setEmail(res.data.user.email);
      setUsername(res.data.user.username);
    } catch (err) {
      toast.error("Gagal memuat profil akun!");
    } finally {
      setLoading(false);
    }
  };

  const updateEmail = async () => {
    try {
      await API.put("/account/update-email", { email });
      toast.success("Email berhasil diperbarui.");
    } catch (err) {
      toast.error("Gagal memperbarui email.");
    }
  };

  const updateUsername = async () => {
    try {
      await API.put("/account/update-username", { username });
      toast.success("Username berhasil diperbarui.");
    } catch (err) {
      toast.error("Gagal memperbarui username.");
    }
  };

  const updatePassword = async () => {
    try {
      await API.put("/account/update-password", {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmNewPassword,
      });

      toast.success("Password berhasil diperbarui.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      toast.error("Gagal memperbarui password.");
    }
  };

  if (loading || !user) {
    return (
      <AdminLayout>
        <div className="p-10 text-center">Memuat...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md space-y-12">

        {/* EMAIL */}
        <section>
          <h3 className="flex items-center gap-2 text-blue-700 font-semibold text-lg">
            <Mail size={20} /> Ubah Email
          </h3>

          <input
            className="mt-3 w-full border rounded-lg p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={updateEmail}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Save size={16} /> Simpan Email
          </button>
        </section>

        {/* USERNAME */}
        <section>
          <h3 className="flex items-center gap-2 text-indigo-700 font-semibold text-lg">
            <User size={20} /> Ubah Username
          </h3>

          <input
            className="mt-3 w-full border rounded-lg p-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <button
            onClick={updateUsername}
            className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Save size={16} /> Simpan Username
          </button>
        </section>

        {/* PASSWORD */}
        <section>
          <h3 className="flex items-center gap-2 text-red-700 font-semibold text-lg">
            <KeyRound size={20} /> Ganti Password
          </h3>

          <div className="space-y-3 mt-3">
            <input
              type="password"
              className="w-full border p-2 rounded-lg"
              placeholder="Password lama"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <input
              type="password"
              className="w-full border p-2 rounded-lg"
              placeholder="Password baru"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <input
              type="password"
              className="w-full border p-2 rounded-lg"
              placeholder="Konfirmasi password baru"
              value={confirmNewPassword}
              onChange={(e) =>
                setConfirmNewPassword(e.target.value)
              }
            />
          </div>

          <button
            onClick={updatePassword}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Save size={16} /> Simpan Password
          </button>
        </section>
      </div>
    </AdminLayout>
  );
}
