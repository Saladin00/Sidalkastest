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
      .then((res) => setKecamatanList(res.data.data || []))
      .catch((err) => console.error("Gagal ambil kecamatan:", err));
  }, []);

  // 👤 Ambil data awal klien
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

        // Ambil LKS sesuai kecamatan awal
        if (kecId) {
          const lksRes = await api.get(`/lks/by-kecamatan/${kecId}`);
          setLksList(lksRes.data.data || []);
        }
      } catch (error) {
        console.error("Gagal mengambil klien:", error);
        alert("Data klien tidak ditemukan");
        navigate("/admin/klien");
      }
    };
    load();
  }, [id, navigate]);

  // 🔄 Ambil LKS ulang jika kecamatan berubah
  useEffect(() => {
    const loadLKS = async () => {
      if (!form.kecamatan_id) {
        setLksList([]);
        setForm((f) => ({ ...f, lks_id: "" }));
        return;
      }
      try {
        const res = await api.get(`/lks/by-kecamatan/${form.kecamatan_id}`);
        setLksList(res.data.data || []);

        // Reset lks_id agar tidak tertinggal
        setForm((f) => ({ ...f, lks_id: "" }));
      } catch (err) {
        console.error("Gagal ambil LKS:", err);
        setLksList([]);
      }
    };
    loadLKS();
  }, [form.kecamatan_id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 💾 Simpan perubahan
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/klien/${id}`, form);
      alert("Data klien berhasil diperbarui!");
      navigate("/admin/klien");
    } catch (error) {
      alert("Gagal memperbarui klien");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white"
        >
          <ArrowLeft size={14} /> Kembali
        </button>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold mb-4">Edit Data Klien</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* NIK */}
            <div>
              <label className="text-sm font-medium">NIK</label>
              <input
                name="nik"
                value={form.nik}
                disabled
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>

            {/* Nama */}
            <div>
              <label className="text-sm font-medium">Nama</label>
              <input
                name="nama"
                value={form.nama}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Alamat */}
            <div>
              <label className="text-sm font-medium">Alamat</label>
              <textarea
                name="alamat"
                value={form.alamat}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>

            {/* Kelurahan */}
            <div>
              <label className="text-sm font-medium">Kelurahan</label>
              <input
                name="kelurahan"
                value={form.kelurahan}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Kecamatan */}
            <div>
              <label className="text-sm font-medium">Kecamatan</label>
              <select
                name="kecamatan_id"
                value={form.kecamatan_id}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Pilih Kecamatan</option>
                {kecamatanList.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* LKS */}
            <div>
              <label className="text-sm font-medium">LKS</label>
              <select
                name="lks_id"
                value={form.lks_id}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                disabled={!form.kecamatan_id}
              >
                <option value="">Pilih LKS</option>
                {lksList.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Jenis Kebutuhan */}
            <div>
              <label className="text-sm font-medium">Jenis Kebutuhan</label>
              <select
                name="jenis_kebutuhan"
                value={form.jenis_kebutuhan}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Pilih Jenis Kebutuhan</option>
                <option value="anak">Anak</option>
                <option value="disabilitas">Disabilitas</option>
                <option value="lansia">Lansia</option>
                <option value="fakir_miskin">Fakir Miskin</option>
              </select>
            </div>

            {/* Status Bantuan */}
            <div>
              <label className="text-sm font-medium">Status Bantuan</label>
              <select
                name="status_bantuan"
                value={form.status_bantuan}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Pilih Bantuan</option>
                <option value="PKH">PKH</option>
                <option value="BPNT">BPNT</option>
                <option value="BLT">BLT</option>
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-emerald-600 text-white rounded shadow"
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
