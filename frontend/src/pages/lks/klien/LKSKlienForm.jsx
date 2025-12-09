import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { showSuccess, showError } from "../../../utils/toast";
import { ToastContainer } from "react-toastify";

const LKSKlienForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Data meta LKS (diambil dari origin/main)
  const [metaLKS, setMetaLKS] = useState({});

  const [form, setForm] = useState({
    nik: "",
    nama: "",
    jenis_kelamin: "",
    alamat: "",
    kelurahan: "",
    jenis_bantuan: "",
    kelompok_umur: "",
    status_pembinaan: "",
  });

  // Ambil data LKS (origin/main)
  useEffect(() => {
    const fetchMetaLKS = async () => {
      const lksId = sessionStorage.getItem("lks_id");
      if (!lksId) return;

      try {
        const res = await api.get(`/lks/${lksId}`);
        setMetaLKS(res.data.data || {});
      } catch (err) {
        showError("Gagal memuat informasi LKS!");
      }
    };
    fetchMetaLKS();
  }, []);

  // Change handler
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // VALIDASI FRONTEND (HEAD version)
    if (form.nik.length !== 16) {
      showError("NIK harus 16 digit!");
      setLoading(false);
      return;
    }

    if (!form.nama.trim()) {
      showError("Nama wajib diisi!");
      setLoading(false);
      return;
    }

    if (!form.kelurahan.trim()) {
      showError("Kelurahan wajib diisi!");
      setLoading(false);
      return;
    }

    if (!form.alamat.trim()) {
      showError("Alamat wajib diisi!");
      setLoading(false);
      return;
    }

    try {
      await api.post("/klien", form);
      showSuccess("Klien berhasil ditambahkan!");
      setTimeout(() => navigate("/lks/klien"), 1000);
    } catch (err) {
      showError("Gagal menyimpan data klien!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl border p-8 mt-4">
      <h1 className="text-2xl font-bold text-emerald-700 mb-2">
        Tambah Data Klien
      </h1>
      <p className="text-gray-500 mb-6">
        Lengkapi form berikut untuk menambahkan data klien baru.
      </p>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* NIK */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            NIK *
          </label>
          <input
            type="number"
            name="nik"
            value={form.nik}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2"
            placeholder="16 digit"
          />
        </div>

        {/* Nama */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Nama *
          </label>
          <input
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Jenis Kelamin */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Jenis Kelamin
          </label>
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
          <label className="block font-semibold text-gray-700 mb-1">
            Kelurahan *
          </label>
          <input
            type="text"
            name="kelurahan"
            value={form.kelurahan}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        {/* Alamat */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Alamat *
          </label>
          <textarea
            name="alamat"
            value={form.alamat}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            rows={3}
            required
          />
        </div>

        {/* Kecamatan otomatis (origin/main) */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Kecamatan (otomatis)
          </label>
          <input
            type="text"
            value={metaLKS.kecamatan?.nama || "Memuat..."}
            disabled
            className="w-full border bg-gray-100 rounded-lg px-3 py-2"
          />
        </div>

        {/* Jenis Bantuan */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Jenis Bantuan
          </label>
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
          <label className="block font-semibold text-gray-700 mb-1">
            Kelompok Umur
          </label>
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
          <label className="block font-semibold text-gray-700 mb-1">
            Status Pembinaan
          </label>
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

      {/* Buttons */}
      <div className="flex justify-between mt-10">
        <button
          onClick={() => navigate("/lks/klien")}
          className="flex items-center gap-2 px-5 py-2 bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={16} /> Kembali
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white rounded-lg"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Simpan
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default LKSKlienForm;
