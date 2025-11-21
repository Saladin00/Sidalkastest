import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDownTrayIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import api from "../../../utils/api";

export default function KlienForm() {
  const navigate = useNavigate();

  // tambahkan ini dari branch satunya
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

  // === GET KECAMATAN ===
  useEffect(() => {
    api.get("/kecamatan").then((res) => {
      setKecamatanList(res.data.data || []);
    });
  }, []);

  // === ADMIN: Dapat semua LKS ===
  useEffect(() => {
  if (role === "admin") {
    api.get("/lks").then((res) => {
      const raw = res.data?.data;
      setLksList(Array.isArray(raw) ? raw : raw?.data || []);
    });
  }
}, [role]);


  // === Filter LKS by Kecamatan (ADMIN ONLY) ===
  useEffect(() => {
    if (role !== "admin") return;

    if (form.kecamatan_id) {
      api
        .get(`/lks/by-kecamatan/${form.kecamatan_id}`)
        .then((res) => setLksList(res.data.data || []))
        .catch(() => setLksList([]));
    }
  }, [form.kecamatan_id, role]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
          <div>
            <label htmlFor="kecamatan_id" className={labelStyle}>
              5. Kecamatan
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
                <option key={kec.id} value={kec.id}>
                  {kec.nama}
                </option>
              ))}
            </select>
          </div>

          {role === "admin" && (
            <div>
              <label htmlFor="lks_id" className={labelStyle}>
                6. LKS
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

          <div>
            <label htmlFor="jenis_kebutuhan" className={labelStyle}>
              7. Jenis Kebutuhan
            </label>
            <select
              name="jenis_kebutuhan"
              id="jenis_kebutuhan"
              className={inputStyle}
              value={form.jenis_kebutuhan}
              onChange={handleChange}
            >
              <option value="">Pilih Jenis</option>
              <option value="anak">Anak</option>
              <option value="disabilitas">Disabilitas</option>
              <option value="lansia">Lansia</option>
              <option value="fakir_miskin">Fakir Miskin</option>
            </select>
          </div>

          <div>
            <label htmlFor="status_bantuan" className={labelStyle}>
              8. Status Bantuan
            </label>
            <select
              name="status_bantuan"
              id="status_bantuan"
              className={inputStyle}
              value={form.status_bantuan}
              onChange={handleChange}
            >
              <option value="">Pilih Bantuan</option>
              <option value="PKH">PKH</option>
              <option value="BPNT">BPNT</option>
              <option value="BLT">BLT</option>
            </select>
          </div>

          <div>
            <label htmlFor="status_pembinaan" className={labelStyle}>
              9. Status Pembinaan
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

        {/* === BUTTONS === */}
        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={() =>
              navigate(role === "admin" ? "/admin/klien" : "/lks/klien")
            }
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
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
