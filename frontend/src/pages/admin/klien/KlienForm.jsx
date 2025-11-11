import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

export default function KlienForm() {
  const [form, setForm] = useState({
    nik: "",
    nama: "",
    alamat: "",
    kelurahan: "",
    kecamatan_id: "",
    lks_id: "",
    jenis_kebutuhan: "",
    status_bantuan: "",
  });

  const [loading, setLoading] = useState(false);
  const [kecamatanList, setKecamatanList] = useState([]);
  const [lksList, setLksList] = useState([]);
  const navigate = useNavigate();

  // 🏙️ Ambil daftar kecamatan saat form dimuat
  useEffect(() => {
    api
      .get("/kecamatan")
      .then((res) => setKecamatanList(res.data.data))
      .catch((err) => console.error("Gagal ambil kecamatan:", err));
  }, []);

  // 🏢 Ambil daftar LKS berdasarkan kecamatan yang dipilih
  useEffect(() => {
    if (form.kecamatan_id) {
      api
        .get(`/lks/by-kecamatan/${form.kecamatan_id}`)
        .then((res) => setLksList(res.data.data))
        .catch((err) => console.error("Gagal ambil LKS:", err));
    } else {
      setLksList([]);
    }
  }, [form.kecamatan_id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/klien", form);
      alert("✅ Klien berhasil ditambahkan!");
      navigate("/admin/klien");
    } catch (error) {
      console.error(error);
      alert("❌ Gagal menambahkan klien");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Tambah Klien</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="nik"
          placeholder="NIK"
          className="border p-2 w-full"
          onChange={handleChange}
          required
        />
        <input
          name="nama"
          placeholder="Nama"
          className="border p-2 w-full"
          onChange={handleChange}
          required
        />
        <textarea
          name="alamat"
          placeholder="Alamat"
          className="border p-2 w-full"
          onChange={handleChange}
          required
        ></textarea>
        <input
          name="kelurahan"
          placeholder="Kelurahan"
          className="border p-2 w-full"
          onChange={handleChange}
          required
        />

        {/* Dropdown Kecamatan */}
        <select
          name="kecamatan_id"
          value={form.kecamatan_id}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        >
          <option value="">Pilih Kecamatan</option>
          {kecamatanList.map((kec) => (
            <option key={kec.id} value={kec.id}>
              {kec.nama}
            </option>
          ))}
        </select>

        {/* Dropdown LKS (dinamis berdasarkan kecamatan) */}
        {lksList.length > 0 && (
          <select
            name="lks_id"
            value={form.lks_id}
            onChange={handleChange}
            className="border p-2 w-full"
          >
            <option value="">Pilih Lembaga (LKS)</option>
            {lksList.map((lks) => (
              <option key={lks.id} value={lks.id}>
                {lks.nama}
              </option>
            ))}
          </select>
        )}

        {/* Jenis Kebutuhan */}
        <select
          name="jenis_kebutuhan"
          value={form.jenis_kebutuhan}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="">Pilih Jenis Kebutuhan</option>
          <option value="anak">Anak</option>
          <option value="disabilitas">Disabilitas</option>
          <option value="lansia">Lansia</option>
          <option value="fakir_miskin">Fakir Miskin</option>
        </select>

        {/* Status Bantuan */}
        <select
          name="status_bantuan"
          value={form.status_bantuan}
          onChange={handleChange}
          className="border p-2 w-full"
        >
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
