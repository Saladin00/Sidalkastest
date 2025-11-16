import React, { useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const LKSKlienForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nik: "",
    nama: "",
    alamat: "",
    kelurahan: "",
    jenis_kebutuhan: "",
    status_bantuan: "",
    status_pembinaan: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const lksId = sessionStorage.getItem("lks_id"); // ⬅ ambil dari login LKS

      if (!lksId) {
        alert("Gagal: lks_id tidak ditemukan. Pastikan LKS sudah login.");
        setLoading(false);
        return;
      }

      await api.post("/klien", {
        ...form,
        lks_id: lksId, // ⬅ kunci sinkronisasi dengan admin
      });

      alert("Klien berhasil ditambahkan!");
      navigate("/lks/klien");
    } catch (err) {
      console.error("Gagal menyimpan klien:", err);
      alert("Gagal menyimpan klien, periksa kembali data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-slate-700 mb-4">
        Tambah Klien Baru
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NIK */}
        <div>
          <label className="font-medium">NIK *</label>
          <input
            type="text"
            name="nik"
            value={form.nik}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        {/* Nama */}
        <div>
          <label className="font-medium">Nama *</label>
          <input
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        {/* Alamat */}
        <div>
          <label className="font-medium">Alamat</label>
          <textarea
            name="alamat"
            value={form.alamat}
            onChange={handleChange}
            className="w-full border rounded p-2"
          ></textarea>
        </div>

        {/* Kelurahan */}
        <div>
          <label className="font-medium">Kelurahan</label>
          <input
            type="text"
            name="kelurahan"
            value={form.kelurahan}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Jenis Kebutuhan */}
        <div>
          <label className="font-medium">Jenis Kebutuhan</label>
          <select
            name="jenis_kebutuhan"
            value={form.jenis_kebutuhan}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">Pilih Jenis Kebutuhan</option>
            <option value="anak">Anak</option>
            <option value="disabilitas">Disabilitas</option>
            <option value="lansia">Lansia</option>
            <option value="fakir_miskin">Fakir Miskin</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </div>

        {/* Status Bantuan */}
        <div>
          <label className="font-medium">Status Bantuan</label>
          <select
            name="status_bantuan"
            value={form.status_bantuan}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">Pilih Status Bantuan</option>
            <option value="BPNT">BPNT</option>
            <option value="PKH">PKH</option>
            <option value="BLT">BLT</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </div>

        {/* Status Pembinaan */}
        <div>
          <label className="font-medium">Status Pembinaan</label>
          <select
            name="status_pembinaan"
            value={form.status_pembinaan}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">Pilih Status Pembinaan</option>
            <option value="aktif">Aktif</option>
            <option value="selesai">Selesai</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-sky-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
          disabled={loading}
        >
          {loading && <Loader2 className="animate-spin" />}
          Simpan
        </button>
      </form>
    </div>
  );
};

export default LKSKlienForm;
