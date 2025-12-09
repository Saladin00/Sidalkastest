import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { showInfo, showSuccess, showError } from "../../../utils/toast";
import { ToastContainer } from "react-toastify";

const KlienEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [kecamatan, setKecamatan] = useState([]);

  const [form, setForm] = useState({
    nik: "",
    nama: "",
    jenis_kelamin: "",
    alamat: "",
    kelurahan: "",
    kecamatan_id: "",
    jenis_bantuan: "",
    kelompok_umur: "",
    status_pembinaan: "",
  });

  useEffect(() => {
    const loadData = async () => {
      const toastId = showInfo("Memuat data klien...");
      try {
        const [resKlien, resKec] = await Promise.all([
          api.get(`/klien/${id}`),
          api.get("/kecamatan"),
        ]);

        const k = resKlien.data.data;

        setForm({
          nik: k.nik || "",
          nama: k.nama || "",
          jenis_kelamin: k.jenis_kelamin || "",
          alamat: k.alamat || "",
          kelurahan: k.kelurahan || "",
          kecamatan_id: k.kecamatan_id || "",
          jenis_bantuan: k.jenis_bantuan || "",
          kelompok_umur: k.kelompok_umur || "",
          status_pembinaan: k.status_pembinaan || "",
        });

        setKecamatan(resKec.data.data || []);

        showSuccess("Data klien berhasil dimuat!");
      } catch (err) {
        console.error("❌ ERROR:", err);
        showError("Gagal memuat data klien!");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const toastId = showInfo("Menyimpan perubahan...");

    try {
      await api.put(`/klien/${id}`, form);
      showSuccess("Perubahan berhasil disimpan!");
      setTimeout(() => navigate("/lks/klien"), 1000);
    } catch (err) {
      console.error("❌ Update error:", err);
      showError("Gagal memperbarui data klien!");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Memuat data klien...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl border p-8 mt-4">
      <h1 className="text-2xl font-bold text-emerald-700 mb-2">Edit Data Klien</h1>
      <p className="text-gray-500 mb-6">Perbarui data klien sesuai kebutuhan.</p>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        {/* NIK */}
        <div>
          <label className="font-semibold text-gray-700 mb-1 block">NIK *</label>
          <input
            name="nik"
            value={form.nik}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Nama */}
        <div>
          <label className="font-semibold text-gray-700 mb-1 block">Nama *</label>
          <input
            name="nama"
            value={form.nama}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Jenis Kelamin */}
        <div>
          <label className="font-semibold text-gray-700 mb-1 block">Jenis Kelamin</label>
          <select
            name="jenis_kelamin"
            value={form.jenis_kelamin}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Pilih</option>
            <option value="laki-laki">Laki-laki</option>
            <option value="perempuan">Perempuan</option>
          </select>
        </div>

        {/* Kelurahan */}
        <div>
          <label className="font-semibold text-gray-700 mb-1 block">Kelurahan *</label>
          <input
            name="kelurahan"
            value={form.kelurahan}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Alamat */}
        <div>
          <label className="font-semibold text-gray-700 mb-1 block">Alamat *</label>
          <textarea
            name="alamat"
            rows={3}
            value={form.alamat}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Kecamatan */}
        <div>
          <label className="font-semibold text-gray-700 mb-1 block">Kecamatan *</label>
          <select
            name="kecamatan_id"
            value={form.kecamatan_id}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Pilih Kecamatan</option>
            {kecamatan.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama}
              </option>
            ))}
          </select>
        </div>

        {/* Jenis Bantuan */}
        <div>
          <label className="font-semibold text-gray-700 mb-1 block">Jenis Bantuan</label>
          <select
            name="jenis_bantuan"
            value={form.jenis_bantuan}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Pilih</option>
            <option value="PKH">PKH</option>
            <option value="BPNT">BPNT</option>
            <option value="BLT">BLT</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </div>

        {/* Kelompok Umur */}
        <div>
          <label className="font-semibold text-gray-700 mb-1 block">Kelompok Umur</label>
          <select
            name="kelompok_umur"
            value={form.kelompok_umur}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Pilih</option>
            <option value="balita">Balita</option>
            <option value="anak">Anak</option>
            <option value="remaja">Remaja</option>
            <option value="dewasa">Dewasa</option>
            <option value="lansia">Lansia</option>
          </select>
        </div>

        {/* Status Pembinaan */}
        <div>
          <label className="font-semibold text-gray-700 mb-1 block">Status Pembinaan</label>
          <select
            name="status_pembinaan"
            value={form.status_pembinaan}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Pilih</option>
            <option value="aktif">Aktif</option>
            <option value="selesai">Selesai</option>
          </select>
        </div>
      </form>

      <div className="flex justify-between mt-10">
        <button
          onClick={() => navigate("/lks/klien")}
          className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Kembali
        </button>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2"
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Simpan Perubahan
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default KlienEdit;
