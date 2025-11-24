import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { toast } from "react-toastify";
import {
  showInfo,
  showSuccess,
  showError,
} from "../../utils/toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const KlienEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
  });

  // 🔁 Ambil data klien + kecamatan (dengan notifikasi modern)
  useEffect(() => {
    const fetchData = async () => {
      toast.dismiss();
      const toastId = showInfo("Memuat data klien...");
      try {
        const [resKlien, resKec] = await Promise.all([
          api.get(`/klien/${id}`),
          api.get(`/kecamatan`),
        ]);

        const data = resKlien.data.data;

        setForm({
          nik: data.nik || "",
          nama: data.nama || "",
          alamat: data.alamat || "",
          kelurahan: data.kelurahan || "",
          kecamatan_id: data.kecamatan_id || "",
          jenis_kebutuhan: data.jenis_kebutuhan || "",
          status_bantuan: data.status_bantuan || "",
          status_pembinaan: data.status_pembinaan || "",
        });

        setKecamatan(resKec.data.data || []);

        toast.update(toastId, {
          render: "Data klien berhasil dimuat!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } catch (err) {
        console.error("❌ Gagal memuat data:", err);
        toast.update(toastId, {
          render: "Gagal memuat data klien!",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    const toastId = showInfo("Menyimpan perubahan...");
    setSaving(true);
    try {
      await api.put(`/klien/${id}`, form);
      toast.update(toastId, {
        render: "Klien berhasil diperbarui!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      setTimeout(() => navigate("/lks/klien"), 1000);
    } catch (err) {
      console.error("❌ Error update klien:", err);
      toast.update(toastId, {
        render: "Gagal memperbarui data klien!",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
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
    <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl border border-gray-100 p-8 mt-4">
      <h1 className="text-2xl font-bold text-emerald-700 mb-2">
        Edit Data Klien
      </h1>
      <p className="text-gray-500 mb-6">
        Perbarui data klien sesuai kebutuhan di bawah ini.
      </p>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {[
          { label: "NIK", name: "nik", type: "text", required: true },
          { label: "Nama", name: "nama", type: "text", required: true },
          { label: "Kelurahan", name: "kelurahan", type: "text" },
        ].map((f, i) => (
          <div key={i}>
            <label className="block font-semibold text-gray-700 mb-1">
              {i + 1}. {f.label}{" "}
              {f.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={f.type}
              name={f.name}
              value={form[f.name]}
              onChange={handleChange}
              required={f.required}
              placeholder={`Masukkan ${f.label.toLowerCase()}`}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>
        ))}

        {/* Alamat */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Alamat
          </label>
          <textarea
            name="alamat"
            value={form.alamat}
            onChange={handleChange}
            placeholder="Alamat lengkap"
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
          />
        </div>

        {/* Kecamatan */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Kecamatan
          </label>
          <select
            name="kecamatan_id"
            value={form.kecamatan_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            <option value="">Pilih Kecamatan</option>
            {kecamatan.map((kec) => (
              <option key={kec.id} value={kec.id}>
                {kec.nama}
              </option>
            ))}
          </select>
        </div>

        {/* Jenis Kebutuhan */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Jenis Kebutuhan
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
            Status Bantuan
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
            Status Pembinaan
          </label>
          <select
            name="status_pembinaan"
            value={form.status_pembinaan}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            <option value="">Pilih Status</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
        </div>
      </form>

      {/* Tombol Aksi */}
      <div className="flex justify-between mt-10">
        <button
          type="button"
          onClick={() => navigate("/lks/klien")}
          className="flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium shadow-md transition-all"
        >
          <ArrowLeft size={16} /> Kembali
        </button>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-sm font-medium transition disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin" size={16} /> Menyimpan...
            </>
          ) : (
            <>
              <Save size={16} /> Simpan Perubahan
            </>
          )}
        </button>
      </div>

      {/* Toast Container */}
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

export default KlienEdit;
