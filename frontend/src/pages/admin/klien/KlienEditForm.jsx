import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import {
  showSuccess,
  showError,
  showInfo,
} from "../../../utils/toast";
import { ArrowDownTrayIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";

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
    status_pembinaan: "",
  });

  const [loading, setLoading] = useState(false);
  const [kecamatanList, setKecamatanList] = useState([]);
  const [lksList, setLksList] = useState([]);

  useEffect(() => {
    api.get("/kecamatan").then((res) => setKecamatanList(res.data.data || []));
  }, []);

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
          status_pembinaan: k.status_pembinaan || "",
        });

        if (kecId) {
          const lksRes = await api.get(`/lks/by-kecamatan/${kecId}`);
          setLksList(lksRes.data.data || []);
        }
      } catch (err) {
        showError("Data klien tidak ditemukan!");
        navigate("/admin/klien");
      }
    };
    load();
  }, [id, navigate]);

  useEffect(() => {
    const loadLKS = async () => {
      if (!form.kecamatan_id) {
        setLksList([]);
        return;
      }
      try {
        const res = await api.get(`/lks/by-kecamatan/${form.kecamatan_id}`);
        setLksList(res.data.data || []);
        showInfo("Daftar LKS diperbarui berdasarkan kecamatan");
      } catch {
        setLksList(Array.isArray(raw) ? raw : raw?.data || []);
        showError("Gagal memuat daftar LKS berdasarkan kecamatan");
      }
    };
    loadLKS();
  }, [form.kecamatan_id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
  await api.put(`/klien/${id}`, form);
  showSuccess("Data klien berhasil diperbarui!");
  setTimeout(() => navigate("/admin/klien"), 1200);
} catch (error) {
  console.error("❌ Error saat update:", error);
  showError("Gagal memperbarui data klien. Periksa kembali input Anda.");
}
  };

  const fields = [
    { label: "1. NIK", name: "nik", type: "text", disabled: true },
    { label: "2. Nama", name: "nama", type: "text" },
    { label: "3. Kelurahan", name: "kelurahan", type: "text" },
    { label: "4. Alamat", name: "alamat", type: "textarea" },
  ];

  // ⚠️ RETURN di DALAM fungsi — di sinilah tempat yang benar
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-md p-6 sm:p-10 border border-gray-100 mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-700 mb-2 text-center">
          Edit Data Klien
        </h1>
        <p className="text-gray-500 text-center text-sm sm:text-base">
          Perbarui informasi klien dengan benar dan lengkap
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* === BASIC FIELDS === */}
          <div>
            <h2 className="text-lg font-bold text-gray-700 mb-4 border-l-4 border-emerald-600 pl-3">
              Informasi Utama
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map((f) => (
                <div key={f.name} className="flex flex-col gap-1">
                  <label htmlFor={f.name} className="text-sm font-semibold text-gray-700">
                    {f.label}
                  </label>

                  {f.type === "textarea" ? (
                    <textarea
                      id={f.name}
                      name={f.name}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition text-sm"
                      value={form[f.name]}
                      onChange={handleChange}
                      required
                    />
                  ) : (
                    <input
                      id={f.name}
                      name={f.name}
                      type="text"
                      disabled={f.disabled}
                      className={`w-full px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition 
                      ${f.disabled ? "bg-gray-100 border-gray-300 cursor-not-allowed" : "border-gray-300"}`}
                      value={form[f.name]}
                      onChange={handleChange}
                      required={!f.disabled}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* === SELECT FIELDS === */}
          <div>
            <h2 className="text-lg font-bold text-gray-700 mb-4 border-l-4 border-emerald-600 pl-3">
              Informasi Tambahan
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kecamatan */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">5. Kecamatan</label>
                <select
                  name="kecamatan_id"
                  value={form.kecamatan_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  required
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
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">6. LKS</label>
                <select
                  name="lks_id"
                  value={form.lks_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  required
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
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">7. Jenis Kebutuhan</label>
                <select
                  name="jenis_kebutuhan"
                  value={form.jenis_kebutuhan}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="">Pilih Jenis</option>
                  <option value="anak">Anak</option>
                  <option value="disabilitas">Disabilitas</option>
                  <option value="lansia">Lansia</option>
                  <option value="fakir_miskin">Fakir Miskin</option>
                </select>
              </div>

              {/* Status Bantuan */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">8. Status Bantuan</label>
                <select
                  name="status_bantuan"
                  value={form.status_bantuan}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="">Pilih Bantuan</option>
                  <option value="PKH">PKH</option>
                  <option value="BPNT">BPNT</option>
                  <option value="BLT">BLT</option>
                </select>
              </div>

              {/* Status Pembinaan */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">9. Status Pembinaan</label>
                <select
                  name="status_pembinaan"
                  value={form.status_pembinaan}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="">Pilih Status</option>
                  <option value="aktif">Aktif</option>
                  <option value="selesai">Selesai</option>
                </select>
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate("/admin/klien")}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Kembali
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg text-white shadow-md transition 
              ${loading ? "bg-emerald-300 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"}`}
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
