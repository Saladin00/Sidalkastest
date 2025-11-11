import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/api";

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

  // 🏙️ Ambil daftar kecamatan dari API
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

        setForm({
          nik: k.nik || "",
          nama: k.nama || "",
          alamat: k.alamat || "",
          kelurahan: k.kelurahan || "",
          kecamatan_id: k.kecamatan_id || k.kecamatan?.id || "",
          lks_id: k.lks_id || "",
          jenis_kebutuhan: k.jenis_kebutuhan || "",
          status_bantuan: k.status_bantuan || "",
        });

        // Ambil daftar LKS sesuai kecamatan klien
        const kecId = k.kecamatan_id || k.kecamatan?.id;
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

  // 🔁 Jika user ganti kecamatan, ambil ulang daftar LKS
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
        setForm((f) => ({ ...f, lks_id: "" })); // reset pilihan LKS
      } catch (error) {
        console.error("Gagal ambil LKS:", error);
        setLksList([]);
      }
    };
    loadLks();
  }, [form.kecamatan_id]);

  // 🖊️ Handler input
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // 💾 Simpan data
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
    <div className="p-6 max-w-xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-bold mb-4">Edit Data Klien</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="nik"
          placeholder="NIK"
          value={form.nik}
          disabled
          className="border p-2 w-full bg-gray-100"
        />
        <input
          name="nama"
          placeholder="Nama"
          value={form.nama}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <textarea
          name="alamat"
          placeholder="Alamat"
          value={form.alamat}
          onChange={handleChange}
          className="border p-2 w-full"
        ></textarea>
        <input
          name="kelurahan"
          placeholder="Kelurahan"
          value={form.kelurahan}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        {/* 🏙️ Kecamatan */}
        <select
          name="kecamatan_id"
          value={form.kecamatan_id}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        >
          <option value="">Pilih Kecamatan</option>
          {kecamatanList.map((kec) => (
            <option key={kec.id} value={kec.id}>
              {kec.nama}
            </option>
          ))}
        </select>

        {/* 🏢 LKS */}
        {lksList.length > 0 ? (
          <select
            name="lks_id"
            value={form.lks_id}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="">Pilih Lembaga (LKS)</option>
            {lksList.map((lks) => (
              <option key={lks.id} value={lks.id}>
                {lks.nama}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-gray-500 text-sm italic">
            Pilih kecamatan terlebih dahulu untuk menampilkan daftar LKS.
          </p>
        )}

        {/* Jenis Kebutuhan */}
        <select
          name="jenis_kebutuhan"
          value={form.jenis_kebutuhan}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        >
          <option value="">Pilih Jenis Kebutuhan</option>
          <option value="anak">Anak</option>
          <option value="disabilitas">Disabilitas</option>
          <option value="lansia">Lansia</option>
          <option value="fakir_miskin">Fakir Miskin</option>
          <option value="lainnya">Lainnya</option>
        </select>

        {/* Status Bantuan */}
        <select
          name="status_bantuan"
          value={form.status_bantuan}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        >
          <option value="">Pilih Bantuan</option>
          <option value="PKH">PKH</option>
          <option value="BPNT">BPNT</option>
          <option value="BLT">BLT</option>
          <option value="lainnya">Lainnya</option>
        </select>

        {/* Tombol Aksi */}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={() => navigate("/admin/klien")}
          >
            Kembali
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
