import React, { useState } from "react";
import api from "../../utils/api";
import { Loader2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await api.post("/forgot-password", { email });
      setMessage({ type: "success", text: res.data.message });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Gagal mengirim link reset password",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-center text-sky-700">
          Lupa Password
        </h2>

        {message && (
          <p
            className={`p-3 mb-4 rounded text-sm ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </p>
        )}

        <form onSubmit={submit}>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            required
            className="w-full border px-3 py-2 rounded mb-4"
            placeholder="Masukkan email akun"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 rounded flex justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Kirim Link Reset"}
          </button>
        </form>
      </div>
    </div>
  );
}
