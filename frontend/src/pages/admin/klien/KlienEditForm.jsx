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
    kecamatan: "",
    jenis_kebutuhan: "",
    status_bantuan: "",
  });

  const [loading, setLoading] = useState(false);

  // 🧩 Ambil data klien saat halaman dibuka
  useEffect(() => {
    const fetchKlien = async () => {
      try {
        const res = await api.get(`/klien/${id}`);
        const klien = res.data.data; // ✅ ambil data sesuai struktur backend
        setForm({
          nik: klien.nik || "",
          nama: klien.nama || "",
          alamat: klien.alamat || "",
          kelurahan: klien.kelurahan || "",
          kecamatan: klien.kecamatan || "",
          jenis_kebutuhan: klien.jenis_kebutuhan || "",
          status_bantuan: klien.status_bantuan || "",
        });
      } catch (error) {
        console.error("Gagal mengambil data klien:", error);
        alert("Data klien tidak ditemukan");
      }
    };
    fetchKlien();
  }, [id]);

  // 🧾 Simpan perubahan data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/klien/${id}`, form);
      alert("Data klien berhasil diperbarui!");
      navigate("/admin/klien");
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui data klien.");
    }
    setLoading(false);
  };

  // 🖊️ Handler input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Edit Data Klien</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="nik"
          placeholder="NIK"
          value={form.nik}
          onChange={handleChange}
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
        <input
          name="kecamatan"
          placeholder="Kecamatan"
          value={form.kecamatan}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <select
          name="jenis_kebutuhan"
          value={form.jenis_kebutuhan}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="">Pilih Jenis Kebutuhan</option>
          <option value="anak">Anak</option>
          <option value="disabilitas">Disabilitas</option>
          <option value="lansia">Lansia</option>
          <option value="fakir_miskin">Fakir Miskin</option>
          <option value="lainnya">Lainnya</option>
        </select>

        <select
          name="status_bantuan"
          value={form.status_bantuan}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="">Pilih Bantuan</option>
          <option value="PKH">PKH</option>
          <option value="BPNT">BPNT</option>
          <option value="BLT">BLT</option>
          <option value="lainnya">Lainnya</option>
        </select>

        <div className="flex justify-between mt-4">
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => navigate("/admin/klien")}
          >
            Kembali
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
