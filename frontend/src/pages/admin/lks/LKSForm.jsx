import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../components/AdminLayout";
import API from "../../../utils/api";
import MapPicker from "../../../components/MapPicker"; // ✅ Pilih lokasi

const LKSForm = () => {
  const navigate = useNavigate();

  // 🔹 State untuk data form
  const [form, setForm] = useState({
    nama: "",
    jenis_layanan: "",
    kecamatan: "",
    status: "Aktif",
    koordinat: "", // ✅ Tambahan koordinat
  });

  // 🔹 State untuk dokumen upload
  const [files, setFiles] = useState({
    akta: null,
    izin: null,
    sertifikat: null,
  });

  const [loading, setLoading] = useState(false);

  // 🔹 Handle perubahan input teks
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Handle perubahan file upload
  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  // 🔹 Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Gunakan FormData agar bisa mengirim file + teks
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });
      Object.keys(files).forEach((key) => {
        if (files[key]) {
          formData.append(key, files[key]);
        }
      });

      const res = await API.post("/lks", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(`✅ ${res.data.message}`);
      navigate("/admin/lks");
    } catch (err) {
      console.error("Error simpan LKS:", err.response?.data || err.message);
      alert("❌ Gagal menyimpan LKS. Pastikan semua data valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-lg shadow border max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Tambah LKS Baru</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nama LKS */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Nama LKS</label>
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Jenis Layanan */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Jenis Layanan</label>
            <input
              type="text"
              name="jenis_layanan"
              value={form.jenis_layanan}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Kecamatan */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Kecamatan</label>
            <input
              type="text"
              name="kecamatan"
              value={form.kecamatan}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>

          {/* Map Picker */}
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Lokasi (Koordinat)
            </label>
            <MapPicker
              koordinat={form.koordinat}
              setKoordinat={(val) => setForm({ ...form, koordinat: val })}
            />
            {form.koordinat && (
              <p className="text-xs text-gray-500 mt-2">
                Koordinat: {form.koordinat}
              </p>
            )}
          </div>

          {/* Upload Dokumen */}
          <div className="md:col-span-2 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">📎 Dokumen Pendukung</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Akta Pendirian</label>
                <input
                  type="file"
                  name="akta"
                  onChange={handleFileChange}
                  className="w-full text-sm border rounded-lg p-2"
                  accept=".pdf,.jpg,.png"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Izin Operasional</label>
                <input
                  type="file"
                  name="izin"
                  onChange={handleFileChange}
                  className="w-full text-sm border rounded-lg p-2"
                  accept=".pdf,.jpg,.png"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Sertifikat Akreditasi</label>
                <input
                  type="file"
                  name="sertifikat"
                  onChange={handleFileChange}
                  className="w-full text-sm border rounded-lg p-2"
                  accept=".pdf,.jpg,.png"
                />
              </div>
            </div>
          </div>

          {/* Tombol Simpan */}
          <div className="md:col-span-2 text-right mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg font-semibold text-white shadow transition duration-200 ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Menyimpan..." : "Simpan LKS"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default LKSForm;
