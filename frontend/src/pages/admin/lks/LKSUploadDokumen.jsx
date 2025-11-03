import React, { useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../../../components/AdminLayout";
import API from "../../../utils/api";

const LKSUploadDokumen = () => {
  const { id: lksId } = useParams(); // Ambil ID dari URL
  const [nama, setNama] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Pilih file terlebih dahulu!");

    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("file", file);

    try {
      const res = await API.post(`/lks/${lksId}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ " + res.data.message);
      setNama("");
      setFile(null);
    } catch (err) {
      console.error("Gagal upload dokumen:", err);
      setMessage("❌ Gagal upload dokumen");
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          📎 Upload Dokumen LKS
        </h2>

        {message && (
          <div
            className={`mb-4 text-sm px-4 py-2 rounded ${
              message.includes("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Dokumen
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: Akta Pendirian"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pilih File
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full"
              required
            />
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow transition"
            >
              📤 Upload Dokumen
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default LKSUploadDokumen;
