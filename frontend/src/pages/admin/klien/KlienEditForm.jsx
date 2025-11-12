import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { ArrowLeft, Save } from "lucide-react";

export default function KlienEditForm() {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(false);
  const [kecamatanList, setKecamatanList] = useState([]);
  const [lksList, setLksList] = useState([]);

  // 🏙️ Ambil daftar kecamatan
  useEffect(() => {
    api
      .get("/kecamatan")
      .then((res) => setKecamatanList(res.data?.data || []))
      .catch((err) => console.error("Gagal ambil kecamatan:", err));
  }, []);

  // 👤 Ambil data klien saat halaman dibuka
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/klien/${id}`);
        const k = res.data.data;

        const kecId = k.kecamatan_id || k.kecamatan?.id || "";

        setForm({
          nik: k.nik || "",
          nama: k.nama || "",
          alamat: k.alamat || "",
          kelurahan: k.kelurahan || "",
          kecamatan_id: kecId,
          lks_id: k.lks_id || "",
          jenis_kebutuhan: k.jenis_kebutuhan || "",
          status_bantuan: k.status_bantuan || "",
        });

        // muat LKS untuk kecamatan awal
        if (kecId) {
          const lksRes = await api.get(`/lks/by-kecamatan/${kecId}`);
          setLksList(lksRes.data?.data || []);
        }
      } catch (error) {
        console.error("Gagal mengambil data klien:", error);
        alert("Data klien tidak ditemukan");
        navigate("/admin/klien");
      }
    };
    load();
  }, [id, navigate]);

  // 🔁 kalau kecamatan diganti, ambil ulang daftar LKS
  useEffect(() => {
    const loadLks = async () => {
      if (!form.kecamatan_id) {
        setLksList([]);
        setForm((f) => ({ ...f, lks_id: "" }));
        return;
      }
      try {
        const res = await api.get(`/lks/by-kecamatan/${form.kecamatan_id}`);
        setLksList(res.data?.data || []);
        setForm((f) => ({ ...f, lks_id: "" }));
      } catch (error) {
        console.error("Gagal ambil LKS:", error);
        setLksList([]);
      }
    };
    loadLks();
  }, [form.kecamatan_id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 💾 Simpan perubahan
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/klien/${id}`, form);
      alert("✅ Data klien berhasil diperbarui!");
      navigate("/admin/klien");
    } catch (error) {
      console.error(error);
      alert("❌ Gagal memperbarui data klien.");
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
          <h1 className="text-2xl font-semibold text-gray-900">
            Edit Data Klien
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
                  value={form.nik}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-slate-300 bg-gray-100 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-400">
                  NIK tidak dapat diubah.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  name="nama"
                  placeholder="Masukkan nama lengkap"
                  value={form.nama}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                value={form.alamat}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                rows={3}
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
                  value={form.kelurahan}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
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
