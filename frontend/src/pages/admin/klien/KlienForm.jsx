import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

export default function KlienForm() {
  const [form, setForm] = useState({
    nik: "",
    nama: "",
    alamat: "",
    kelurahan: "",
    kecamatan: "",
    jenis_kebutuhan: "",
    status_bantuan: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ gunakan hook navigate

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/klien", form);
      alert("Klien berhasil ditambahkan!");
      navigate("/admin/klien"); // ✅ arahkan ke halaman klien list
    } catch (error) {
      console.error(error);
      alert("Gagal menambahkan klien");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Tambah Klien</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="nik" placeholder="NIK" className="border p-2 w-full" onChange={handleChange} />
        <input name="nama" placeholder="Nama" className="border p-2 w-full" onChange={handleChange} />
        <textarea name="alamat" placeholder="Alamat" className="border p-2 w-full" onChange={handleChange}></textarea>
        <input name="kelurahan" placeholder="Kelurahan" className="border p-2 w-full" onChange={handleChange} />
        <input name="kecamatan" placeholder="Kecamatan" className="border p-2 w-full" onChange={handleChange} />

        <select name="jenis_kebutuhan" className="border p-2 w-full" onChange={handleChange}>
          <option value="">Pilih Jenis Kebutuhan</option>
          <option value="anak">Anak</option>
          <option value="disabilitas">Disabilitas</option>
          <option value="lansia">Lansia</option>
          <option value="fakir_miskin">Fakir Miskin</option>
        </select>

        <select name="status_bantuan" className="border p-2 w-full" onChange={handleChange}>
          <option value="">Pilih Bantuan</option>
          <option value="PKH">PKH</option>
          <option value="BPNT">BPNT</option>
          <option value="BLT">BLT</option>
        </select>

        <button
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}
