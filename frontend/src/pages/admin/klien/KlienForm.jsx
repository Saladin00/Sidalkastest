import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { ArrowLeft, Save } from "lucide-react";

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

  // Ambil daftar kecamatan saat form dimuat
  useEffect(() => {
    api
      .get("/kecamatan")
      .then((res) => setKecamatanList(res.data.data))
      .catch((err) => console.error("Gagal ambil kecamatan:", err));
  }, []);

  // Ambil daftar LKS berdasarkan kecamatan yang dipilih
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
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
          >
            <ArrowLeft size={14} />
            Kembali
          </button>
          <h1 className="text-2xl  font-semibold text-gray-900">
            Tambah Klien Baru
          </h1>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NIK & Nama */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  NIK <span className="text-red-500">*</span>
                </label>
                <input
                  name="nik"
                  placeholder="Masukkan NIK"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  name="nama"
                  placeholder="Masukkan nama lengkap"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Alamat */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Alamat <span className="text-red-500">*</span>
              </label>
              <textarea
                name="alamat"
                placeholder="Tulis alamat lengkap klien"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                rows={3}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {/* Kelurahan & Kecamatan */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Kelurahan <span className="text-red-500">*</span>
                </label>
                <input
                  name="kelurahan"
                  placeholder="Masukkan kelurahan"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Kecamatan <span className="text-red-500">*</span>
                </label>
                <select
                  name="kecamatan_id"
                  value={form.kecamatan_id}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                >
                  <option value="">Pilih kecamatan</option>
                  {kecamatanList.map((kec) => (
                    <option key={kec.id} value={kec.id}>
                      {kec.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LKS & Jenis Kebutuhan */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Lembaga (LKS)
                </label>
                <select
                  name="lks_id"
                  value={form.lks_id}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  disabled={!form.kecamatan_id || lksList.length === 0}
                >
                  {!form.kecamatan_id && (
                    <option value="">
                      Pilih kecamatan terlebih dahulu
                    </option>
                  )}
                  {form.kecamatan_id && lksList.length === 0 && (
                    <option value="">Tidak ada LKS di kecamatan ini</option>
                  )}
                  {form.kecamatan_id &&
                    lksList.length > 0 && (
                      <>
                        <option value="">Pilih Lembaga (LKS)</option>
                        {lksList.map((lks) => (
                          <option key={lks.id} value={lks.id}>
                            {lks.nama}
                          </option>
                        ))}
                      </>
                    )}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Jenis Kebutuhan
                </label>
                <select
                  name="jenis_kebutuhan"
                  value={form.jenis_kebutuhan}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="">Pilih jenis kebutuhan</option>
                  <option value="anak">Anak</option>
                  <option value="disabilitas">Disabilitas</option>
                  <option value="lansia">Lansia</option>
                  <option value="fakir_miskin">Fakir Miskin</option>
                </select>
              </div>
            </div>

            {/* Status Bantuan */}
            <div className="w-full md:w-1/2 space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Status Bantuan
              </label>
              <select
                name="status_bantuan"
                value={form.status_bantuan}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="">Pilih bantuan</option>
                <option value="PKH">PKH</option>
                <option value="BPNT">BPNT</option>
                <option value="BLT">BLT</option>
              </select>
            </div>

            {/* Actions */}
            <div className="pt-3 flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Save size={16} />
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/klien")}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
