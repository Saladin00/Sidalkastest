import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { toast } from "react-toastify";
import { showSuccess, showError } from "../../../utils/toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LKSKlienForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [metaLKS, setMetaLKS] = useState({});

  const [form, setForm] = useState({
    nik: "",
    nama: "",
    alamat: "",
    kelurahan: "",
    jenis_kebutuhan: "",
    status_bantuan: "",
    status_pembinaan: "",
  });

  // Ambil meta LKS
  useEffect(() => {
    const fetchMetaLKS = async () => {
      const lksId = sessionStorage.getItem("lks_id");
      if (!lksId) return;

      try {
        const res = await api.get(`/lks/${lksId}`);
        setMetaLKS(res.data.data || {});
      } catch (err) {
        console.error("❌ Gagal memuat meta LKS:", err);
        showError("Gagal memuat informasi LKS!");
      }
    };
    fetchMetaLKS();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    setLoading(true);

    // ==========================
    // 🔥 VALIDASI FRONTEND
    // ==========================

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

    // Backend akan otomatis mengisi:
    // - lks_id (dari user login)
    // - kecamatan_id (dari lks->kecamatan)
    // jadi kita TIDAK boleh mengirim kecamatan_id & lks_id

    try {
      await api.post("/klien", form);

      showSuccess("Klien berhasil ditambahkan!");
      setTimeout(() => navigate("/lks/klien"), 1000);
    } catch (err) {
      console.error("❌ VALIDATION ERROR:", err.response?.data);
      showError(
        err.response?.data?.message ||
          "Gagal menyimpan data klien! Periksa kembali input."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl border border-gray-100 p-8 mt-4">
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
            1. NIK <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="nik"
            placeholder="Masukkan NIK (16 digit)"
            value={form.nik}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            required
          />
        </div>

        {/* Nama */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            2. Nama <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nama"
            placeholder="Masukkan nama lengkap"
            value={form.nama}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            required
          />
        </div>

        {/* Kelurahan */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            3. Kelurahan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="kelurahan"
            placeholder="Contoh: Sukamaju"
            value={form.kelurahan}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            required
          />
        </div>

        {/* Alamat */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            4. Alamat <span className="text-red-500">*</span>
          </label>
          <textarea
            name="alamat"
            placeholder="Alamat lengkap"
            value={form.alamat}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
            required
          />
        </div>

        {/* Kecamatan (otomatis) */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            5. Kecamatan (otomatis)
          </label>
          <input
            type="text"
            value={
              metaLKS.kecamatan
                ? metaLKS.kecamatan.nama
                : "Memuat kecamatan..."
            }
            disabled
            className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-gray-600"
          />
        </div>

        {/* Jenis Kebutuhan */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            6. Jenis Kebutuhan
          </label>
          <select
            name="jenis_kebutuhan"
            value={form.jenis_kebutuhan}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            <option value="">Pilih Jenis</option>
            <option value="anak">Anak</option>
            <option value="lansia">Lansia</option>
            <option value="disabilitas">Disabilitas</option>
            <option value="fakir_miskin">Fakir Miskin</option>
          </select>
        </div>

        {/* Status Bantuan */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            7. Status Bantuan
          </label>
          <select
            name="status_bantuan"
            value={form.status_bantuan}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            <option value="">Pilih Bantuan</option>
            <option value="BPNT">BPNT</option>
            <option value="PKH">PKH</option>
            <option value="BLT">BLT</option>
          </select>
        </div>

        {/* Status Pembinaan */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            8. Status Pembinaan
          </label>
          <select
            name="status_pembinaan"
            value={form.status_pembinaan}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            <option value="">Pilih Status</option>
            <option value="aktif">Aktif</option>
            <option value="selesai">Selesai</option>
          </select>
        </div>
      </form>

      {/* Tombol Aksi */}
      <div className="flex justify-between mt-10">
        <button
          type="button"
          onClick={() => navigate("/lks/klien")}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium transition"
        >
          <ArrowLeft size={16} /> Kembali
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-sm font-medium transition disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={16} /> Menyimpan...
            </>
          ) : (
            <>
              <Save size={16} /> Simpan
            </>
          )}
        </button>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar
        newestOnTop
        theme="light"
      />
    </div>
  );
};

export default LKSKlienForm;
