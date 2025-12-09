import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDownTrayIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import api from "../../../utils/api";
import { showSuccess, showError } from "../../../utils/toast";

export default function KlienForm() {
  const navigate = useNavigate();

  const role = sessionStorage.getItem("role");
  const loggedLKS = sessionStorage.getItem("lks_id");

  const [form, setForm] = useState({
    nik: "",
    nama: "",
    jenis_kelamin: "",
    alamat: "",
    kelurahan: "",
    kecamatan_id: "",
    lks_id: role === "lks" ? loggedLKS : "",
    jenis_bantuan: "",
    kelompok_umur: "",
    status_pembinaan: "",
  });

  const [kecamatanList, setKecamatanList] = useState([]);
  const [lksList, setLksList] = useState([]);
  const [loading, setLoading] = useState(false);

  // GET KECAMATAN
  useEffect(() => {
    api.get("/kecamatan").then((res) => {
      const data = res.data.data || [];
      setKecamatanList(data);
    });
  }, []);

  // GET SEMUA LKS (ADMIN)
  useEffect(() => {
    if (role === "admin") {
      api
        .get("/lks")
        .then((res) => {
          const raw = res.data?.data;
          setLksList(Array.isArray(raw) ? raw : raw?.data || []);
        })
        .catch(() => showError("Gagal memuat data LKS"));
    }
  }, [role]);

  // FILTER LKS BERDASARKAN KECAMATAN
  useEffect(() => {
    if (role !== "admin") return;
    if (!form.kecamatan_id) return;

    api
      .get(`/lks/by-kecamatan/${form.kecamatan_id}`)
      .then((res) => {
        const data = res.data.data || [];
        setLksList(data);
      })
      .catch((err) => {
        console.error("ERR FILTER LKS:", err);
        setLksList([]);
      });
  }, [form.kecamatan_id, role]);

  // FIX VALUE ":1" → "1"
  const handleChange = (e) => {
    let value = e.target.value;

    if (e.target.name === "kecamatan_id" && value.includes(":")) {
      value = value.split(":")[0];
    }

    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/klien", form);
      showSuccess("Klien berhasil ditambahkan!");

      setTimeout(() => {
        navigate(role === "admin" ? "/admin/klien" : "/lks/klien");
      }, 1200);
    } catch (err) {
      console.error("❌ Error:", err);
      showError("Gagal menambahkan klien.");
    }
  };

  const inputStyle =
    "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition placeholder-gray-400 text-sm";
  const labelStyle = "block font-medium text-sm text-gray-700 mb-1";
  const sectionStyle = "grid md:grid-cols-2 gap-6";

  const fields = [
    { label: "1. NIK", name: "nik", placeholder: "Masukkan NIK (16 digit)", type: "text", maxLength: 16 },
    { label: "2. Nama", name: "nama", placeholder: "Masukkan nama lengkap", type: "text" },
    { label: "3. Kelurahan", name: "kelurahan", placeholder: "Contoh: Sukamaju", type: "text" },
    { label: "4. Alamat", name: "alamat", placeholder: "Alamat lengkap", type: "textarea" },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-2xl font-semibold text-emerald-700 mb-6">
        Tambah Data Klien
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* === Basic Fields === */}
        <div className={sectionStyle}>
          {fields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className={labelStyle}>
                {field.label}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  rows={3}
                  placeholder={field.placeholder}
                  className={inputStyle}
                  required
                  onChange={handleChange}
                />
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  maxLength={field.maxLength}
                  className={inputStyle}
                  required
                  onChange={handleChange}
                />
              )}
            </div>
          ))}
        </div>

        {/* === Select Fields === */}
        <div className={sectionStyle}>
          
          {/* Jenis Kelamin */}
          <div>
            <label htmlFor="jenis_kelamin" className={labelStyle}>
              5. Jenis Kelamin
            </label>
            <select
              name="jenis_kelamin"
              id="jenis_kelamin"
              className={inputStyle}
              value={form.jenis_kelamin}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="laki-laki">Laki-laki</option>
              <option value="perempuan">Perempuan</option>
            </select>
          </div>

          {/* Kecamatan */}
          <div>
            <label htmlFor="kecamatan_id" className={labelStyle}>
              6. Kecamatan
            </label>
            <select
              name="kecamatan_id"
              id="kecamatan_id"
              className={inputStyle}
              required
              value={form.kecamatan_id}
              onChange={handleChange}
            >
              <option value="">Pilih Kecamatan</option>
              {kecamatanList.map((kec) => (
                <option key={kec.id} value={String(kec.id).split(":")[0]}>
                  {kec.nama}
                </option>
              ))}
            </select>
          </div>

          {/* LKS (Admin Only) */}
          {role === "admin" && (
            <div>
              <label htmlFor="lks_id" className={labelStyle}>
                7. LKS
              </label>
              <select
                name="lks_id"
                id="lks_id"
                className={inputStyle}
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

          {/* Jenis Bantuan */}
          <div>
            <label htmlFor="jenis_bantuan" className={labelStyle}>
              8. Jenis Bantuan
            </label>
            <select
              name="jenis_bantuan"
              id="jenis_bantuan"
              className={inputStyle}
              value={form.jenis_bantuan}
              onChange={handleChange}
            >
              <option value="">Pilih Bantuan</option>
              <option value="BPNT">BPNT</option>
              <option value="PKH">PKH</option>
              <option value="BLT">BLT</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>

          {/* Kelompok Umur */}
          <div>
            <label htmlFor="kelompok_umur" className={labelStyle}>
              9. Kelompok Umur
            </label>
            <select
              name="kelompok_umur"
              id="kelompok_umur"
              className={inputStyle}
              value={form.kelompok_umur}
              onChange={handleChange}
            >
              <option value="">Pilih Kelompok</option>
              <option value="balita">Balita</option>
              <option value="anak">Anak</option>
              <option value="remaja">Remaja</option>
              <option value="dewasa">Dewasa</option>
              <option value="lansia">Lansia</option>
            </select>
          </div>

          {/* Status Pembinaan */}
          <div>
            <label htmlFor="status_pembinaan" className={labelStyle}>
              10. Status Pembinaan
            </label>
            <select
              name="status_pembinaan"
              id="status_pembinaan"
              className={inputStyle}
              value={form.status_pembinaan}
              onChange={handleChange}
            >
              <option value="">Pilih Status</option>
              <option value="aktif">Aktif</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
        </div>

        {/* BUTTON */}
        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={() =>
              navigate(role === "admin" ? "/admin/klien" : "/lks/klien")
            }
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Kembali
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-md text-white shadow transition ${
              loading
                ? "bg-emerald-300 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
