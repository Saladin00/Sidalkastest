// src/components/lks/DokumenUpload.jsx

import React, { useEffect, useState } from "react";
import API from "../../utils/api";

const DokumenUpload = ({ lksId }) => {
  const [dokumenList, setDokumenList] = useState([]);
  const [nama, setNama] = useState("");
  const [file, setFile] = useState(null);

  const loadDokumen = async () => {
    try {
      const res = await API.get(`/lks/${lksId}/dokumen`);
      setDokumenList(res.data);
    } catch (err) {
      console.error("Gagal ambil dokumen:", err);
    }
  };

  useEffect(() => {
    if (lksId) loadDokumen();
  }, [lksId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !nama) return alert("Isi nama dan pilih file dulu!");

    const formData = new FormData();
    formData.append("lks_id", lksId);
    formData.append("nama", nama);
    formData.append("file", file);

    try {
      await API.post("/lks/dokumen", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setNama("");
      setFile(null);
      loadDokumen();
    } catch (err) {
      console.error("Gagal upload:", err);
      alert("Upload gagal!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus dokumen ini?")) return;
    try {
      await API.delete(`/lks/dokumen/${id}`);
      loadDokumen();
    } catch (err) {
      console.error("Gagal hapus:", err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-10 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">📎 Upload Dokumen Pendukung</h3>

      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-center mb-6">
        <input
          type="text"
          placeholder="Nama Dokumen"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="px-4 py-2 border rounded w-1/3"
          required
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="px-4 py-2 border rounded w-1/3"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          📤 Upload
        </button>
      </form>

      <ul className="space-y-2">
        {dokumenList.map((doc) => (
          <li
            key={doc.id}
            className="flex justify-between items-center border-b pb-2"
          >
            <a
              href={`http://localhost:8000/storage/${doc.path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              📄 {doc.nama}
            </a>
            <button
              onClick={() => handleDelete(doc.id)}
              className="text-sm text-red-500 hover:underline"
            >
              🗑️ Hapus
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DokumenUpload;
