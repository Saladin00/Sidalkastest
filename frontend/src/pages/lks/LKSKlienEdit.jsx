import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";

const KlienEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [kecamatan, setKecamatan] = useState([]);

  const [form, setForm] = useState({
    nik: "",
    nama: "",
    alamat: "",
    kelurahan: "",
    kecamatan_id: "",
    jenis_kebutuhan: "",
    status_bantuan: "",
    status_pembinaan: "",
    lks_id: "",
  });

  // 📌 Ambil detail klien + kecamatan
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resKlien, resKec] = await Promise.all([
          api.get(`/klien/${id}`),
          api.get(`/kecamatan`),
        ]);

        setForm({
          nik: resKlien.data.data.nik || "",
          nama: resKlien.data.data.nama || "",
          alamat: resKlien.data.data.alamat || "",
          kelurahan: resKlien.data.data.kelurahan || "",
          kecamatan_id: resKlien.data.data.kecamatan_id || "",
          jenis_kebutuhan: resKlien.data.data.jenis_kebutuhan || "",
          status_bantuan: resKlien.data.data.status_bantuan || "",
          status_pembinaan: resKlien.data.data.status_pembinaan || "",
        });

        setKecamatan(resKec.data.data);
      } catch (err) {
        console.error("❌ Gagal memuat data:", err);
        alert("Gagal memuat data klien.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 🔄 Handler Form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 💾 Submit Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/klien/${id}`, form);
      alert("✅ Klien berhasil diperbarui!");
      navigate("/lks/klien");
    } catch (err) {
      console.error("❌ Error update klien:", err);
      alert("Gagal memperbarui klien.");
    }
  };

  if (loading)
    return <div className="p-4 text-center text-gray-500">Memuat data...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-slate-700">
        Edit Data Klien
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium">NIK *</label>
          <input
            type="text"
            name="nik"
            value={form.nik}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Nama *</label>
          <input
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Alamat *</label>
          <textarea
            name="alamat"
            value={form.alamat}
            onChange={handleChange}
            className="input"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium">Kelurahan *</label>
          <input
            type="text"
            name="kelurahan"
            value={form.kelurahan}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        {/* Kecamatan */}
        <div>
          <label className="block text-sm font-medium">Kecamatan *</label>
          <select
            name="kecamatan_id"
            className="input"
            value={form.kecamatan_id}
            onChange={handleChange}
            required
          >
            <option value="">Pilih Kecamatan</option>
            {kecamatan.map((kec) => (
              <option key={kec.id} value={kec.id}>
                {kec.nama}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Jenis Kebutuhan</label>
          <select
            name="jenis_kebutuhan"
            className="input"
            value={form.jenis_kebutuhan}
            onChange={handleChange}
          >
            <option value="">Pilih Jenis Kebutuhan</option>
            <option value="anak">Anak</option>
            <option value="disabilitas">Disabilitas</option>
            <option value="lansia">Lansia</option>
            <option value="fakir_miskin">Fakir Miskin</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Status Bantuan</label>
          <select
            name="status_bantuan"
            className="input"
            value={form.status_bantuan}
            onChange={handleChange}
          >
            <option value="">Pilih Status Bantuan</option>
            <option value="BPNT">BPNT</option>
            <option value="PKH">PKH</option>
            <option value="BLT">BLT</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </div>

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

        {/* BUTTONS */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => navigate("/lks/klien")}
            className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Kembali
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
};

export default KlienEdit;
