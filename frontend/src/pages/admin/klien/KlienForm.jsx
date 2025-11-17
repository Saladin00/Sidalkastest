import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

export default function KlienForm() {
  const navigate = useNavigate();

  const role = sessionStorage.getItem("role");
  const loggedLKS = sessionStorage.getItem("lks_id");

  const [form, setForm] = useState({
    nik: "",
    nama: "",
    alamat: "",
    kelurahan: "",
    kecamatan_id: "",
    lks_id: role === "lks" ? loggedLKS : "",
    jenis_kebutuhan: "",
    status_bantuan: "",
    status_pembinaan: "",
  });

  const [kecamatanList, setKecamatanList] = useState([]);
  const [lksList, setLksList] = useState([]);
  const [loading, setLoading] = useState(false);

  // ===========================
  // GET LIST KECAMATAN
  // ===========================
  useEffect(() => {
    api.get("/kecamatan").then((res) => {
      setKecamatanList(res.data.data || []);
    });
  }, []);

  // ===========================
  // ADMIN → dapat semua LKS
  // ===========================
  useEffect(() => {
    if (role === "admin") {
      api.get("/lks").then((res) => {
        setLksList(res.data.data.data || []);
      });
    }
  }, [role]);

  // ===========================
  // ON CHANGE KECAMATAN (ADMIN ONLY)
  // ===========================
  useEffect(() => {
    if (role !== "admin") return; // LKS tidak perlu filter

    if (form.kecamatan_id) {
      api
        .get(`/lks/by-kecamatan/${form.kecamatan_id}`)
        .then((res) => setLksList(res.data.data || []))
        .catch(() => setLksList([]));
    }
  }, [form.kecamatan_id, role]);

  // ===========================
  // Handle Change Input
  // ===========================
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ===========================
  // Submit Form
  // ===========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/klien", form);
      alert("Klien berhasil ditambahkan!");

      if (role === "admin") navigate("/admin/klien");
      else navigate("/lks/klien");
    } catch (err) {
      alert("Gagal menambahkan klien");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded-xl">
      <h1 className="text-xl font-bold mb-4">Tambah Klien Baru</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* NIK */}
        <div>
          <label>NIK</label>
          <input
            className="w-full border p-2 rounded"
            name="nik"
            required
            onChange={handleChange}
          />
        </div>

        {/* Nama */}
        <div>
          <label>Nama</label>
          <input
            className="w-full border p-2 rounded"
            name="nama"
            required
            onChange={handleChange}
          />
        </div>

        {/* Alamat */}
        <div>
          <label>Alamat</label>
          <textarea
            className="w-full border p-2 rounded"
            name="alamat"
            required
            onChange={handleChange}
          />
        </div>

        {/* Kelurahan */}
        <div>
          <label>Kelurahan</label>
          <input
            className="w-full border p-2 rounded"
            name="kelurahan"
            required
            onChange={handleChange}
          />
        </div>

        {/* Kecamatan */}
        <div>
          <label>Kecamatan</label>
          <select
            name="kecamatan_id"
            className="w-full border p-2 rounded"
            required
            value={form.kecamatan_id}
            onChange={handleChange}
          >
            <option value="">Pilih Kecamatan</option>
            {kecamatanList.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama}
              </option>
            ))}
          </select>
        </div>

        {/* ===========================
             ADMIN: bisa pilih LKS
        =========================== */}
        {role === "admin" && (
          <div>
            <label>LKS</label>
            <select
              name="lks_id"
              className="w-full border p-2 rounded"
              required
              value={form.lks_id}
              onChange={handleChange}
            >
              <option value="">Pilih LKS</option>
              {lksList.map((lks) => (
                <option key={lks.id} value={lks.id}>
                  {lks.nama}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ===========================
             LKS: otomatis pakai lks_id sendiri
        =========================== */}
        {role === "lks" && (
          <input type="hidden" name="lks_id" value={loggedLKS} />
        )}

        {/* Jenis Kebutuhan */}
        <div>
          <label>Jenis Kebutuhan</label>
          <select
            name="jenis_kebutuhan"
            className="w-full border p-2 rounded"
            required
            onChange={handleChange}
          >
            <option value="">Pilih</option>
            <option value="anak">Anak</option>
            <option value="disabilitas">Disabilitas</option>
            <option value="lansia">Lansia</option>
            <option value="fakir_miskin">Fakir Miskin</option>
          </select>
        </div>

        {/* Status Bantuan */}
        <div>
          <label>Status Bantuan</label>
          <select
            name="status_bantuan"
            className="w-full border p-2 rounded"
            required
            onChange={handleChange}
          >
            <option value="">Pilih</option>
            <option value="PKH">PKH</option>
            <option value="BPNT">BPNT</option>
            <option value="BLT">BLT</option>
          </select>
        </div>

        {/* Status Pembinaan */}
        <div>
          <label>Status Pembinaan</label>
          <select
            name="status_pembinaan"
            value={form.status_pembinaan}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Pilih Status Pembinaan</option>
            <option value="aktif">Aktif</option>
            <option value="selesai">Selesai</option>
          </select>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-emerald-600 text-white rounded"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}
