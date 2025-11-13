import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

export default function KlienForm() {
  const navigate = useNavigate();

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

  const [kecamatanList, setKecamatanList] = useState([]);
  const [lksList, setLksList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/kecamatan").then((res) => {
      setKecamatanList(res.data.data || []);
    });
  }, []);

  useEffect(() => {
    if (form.kecamatan_id) {
      api
        .get(`/lks/by-kecamatan/${form.kecamatan_id}`)
        .then((res) => setLksList(res.data.data || []))
        .catch(() => setLksList([]));
    } else {
      setLksList([]);
    }
  }, [form.kecamatan_id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/klien", form);
      alert("Klien berhasil ditambahkan!");
      navigate("/admin/klien");
    } catch (err) {
      alert("Gagal menambahkan klien");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded-xl">
      <h1 className="text-xl font-bold mb-4">Tambah Klien Baru</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label>NIK</label>
          <input
            className="w-full border p-2 rounded"
            name="nik"
            required
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Nama</label>
          <input
            className="w-full border p-2 rounded"
            name="nama"
            required
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Alamat</label>
          <textarea
            className="w-full border p-2 rounded"
            name="alamat"
            required
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Kelurahan</label>
          <input
            className="w-full border p-2 rounded"
            name="kelurahan"
            required
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Kecamatan</label>
          <select
            name="kecamatan_id"
            className="w-full border p-2 rounded"
            required
            onChange={handleChange}
          >
            <option value="">Pilih kecamatan</option>
            {kecamatanList.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>LKS</label>
          <select
            name="lks_id"
            className="w-full border p-2 rounded"
            required
            onChange={handleChange}
          >
            <option value="">Pilih LKS</option>
            {lksList.map((lks) => (
              <option key={lks.id} value={lks.id}>
                {lks.nama}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Jenis Kebutuhan</label>
          <select
            name="jenis_kebutuhan"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          >
            <option value="">Pilih</option>
            <option value="anak">Anak</option>
            <option value="disabilitas">Disabilitas</option>
            <option value="lansia">Lansia</option>
            <option value="fakir_miskin">Fakir Miskin</option>
          </select>
        </div>

        <div>
          <label>Status Bantuan</label>
          <select
            name="status_bantuan"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          >
            <option value="">Pilih</option>
            <option value="PKH">PKH</option>
            <option value="BPNT">BPNT</option>
            <option value="BLT">BLT</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-emerald-600 text-white rounded"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}
