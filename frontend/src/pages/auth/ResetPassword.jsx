import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../utils/api";
import { Loader2 } from "lucide-react";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const email = params.get("email");

  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await api.post("/reset-password", {
        token,
        email,
        password,
        password_confirmation,
      });

      setMessage({ type: "success", text: res.data.message });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Tidak dapat mereset password",
      });
    }

    setLoading(false);
  };

  if (!token || !email) {
    return (
      <p className="text-center mt-10 text-red-600 font-medium">
        Link reset password tidak valid.
      </p>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-center text-sky-700">
          Reset Password
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
          <label className="block text-sm mb-1">Password Baru</label>
          <input
            type="password"
            required
            className="w-full border px-3 py-2 rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="block text-sm mb-1">Konfirmasi Password</label>
          <input
            type="password"
            required
            className="w-full border px-3 py-2 rounded mb-4"
            value={password_confirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 rounded flex justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
