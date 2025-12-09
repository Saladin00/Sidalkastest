// src/pages/admin/klien/KlienEditForm.jsx

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
    jenis_kelamin: "",
    alamat: "",
    kelurahan: "",
    kecamatan_id: "",
    lks_id: "",
    jenis_bantuan: "",
    kelompok_umur: "",
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
          nik: k.nik,
          nama: k.nama,
          jenis_kelamin: k.jenis_kelamin,
          alamat: k.alamat,
          kelurahan: k.kelurahan,
          kecamatan_id: kecId,
          lks_id: k.lks_id,
          jenis_bantuan: k.jenis_bantuan,
          kelompok_umur: k.kelompok_umur,
          status_pembinaan: k.status_pembinaan,
        });

        if (kecId) {
          const lksRes = await api.get(`/lks/by-kecamatan/${kecId}`);
          setLksList(lksRes.data.data || []);
        }
      } catch {
        showError("Data klien tidak ditemukan!");
        navigate("/admin/klien");
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    if (!form.kecamatan_id) return;

    api
      .get(`/lks/by-kecamatan/${form.kecamatan_id}`)
      .then((res) => setLksList(res.data.data || []))
      .catch(() => showError("Gagal memuat daftar LKS berdasarkan kecamatan"));
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
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "1. NIK", name: "nik", type: "text", disabled: true },
    { label: "2. Nama", name: "nama", type: "text" },
    { label: "3. Jenis Kelamin", name: "jenis_kelamin", type: "select" },
    { label: "4. Kelurahan", name: "kelurahan", type: "text" },
    { label: "5. Alamat", name: "alamat", type: "textarea" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="bg-white rounded-2xl shadow-md p-6 sm:p-10 border border-gray-100 mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-700 mb-2 text-center">
          Edit Data Klien
        </h1>
        <p className="text-gray-500 text-center text-sm sm:text-base">
          Perbarui informasi klien dengan benar dan lengkap
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-10">

          {/* INFORMASI UTAMA */}
          <h2 className="text-lg font-bold text-gray-700 mb-4 border-l-4 border-emerald-600 pl-3">
            Informasi Utama
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NIK, Nama, dsb */}
            <div>
              <label className="text-sm font-semibold text-gray-700">NIK</label>
              <input
                disabled
                name="nik"
                value={form.nik}
                className="w-full px-4 py-2 border rounded-lg bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Nama</label>
              <input
                name="nama"
                value={form.nama}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Jenis Kelamin
              </label>
              <select
                name="jenis_kelamin"
                value={form.jenis_kelamin}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="laki-laki">Laki-laki</option>
                <option value="perempuan">Perempuan</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Kelurahan
              </label>
              <input
                name="kelurahan"
                value={form.kelurahan}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                Alamat
              </label>
              <textarea
                name="alamat"
                value={form.alamat}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* INFORMASI TAMBAHAN */}
          <h2 className="text-lg font-bold text-gray-700 mb-4 border-l-4 border-emerald-600 pl-3">
            Informasi Tambahan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Kecamatan */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Kecamatan
              </label>
              <select
                name="kecamatan_id"
                value={form.kecamatan_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
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
            <div>
              <label className="text-sm font-semibold text-gray-700">LKS</label>
              <select
                name="lks_id"
                value={form.lks_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
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

            {/* Jenis Bantuan */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Jenis Bantuan
              </label>
              <select
                name="jenis_bantuan"
                value={form.jenis_bantuan}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
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
              <label className="text-sm font-semibold text-gray-700">
                Kelompok Umur
              </label>
              <select
                name="kelompok_umur"
                value={form.kelompok_umur}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Pilih Kelompok Umur</option>
                <option value="balita">Balita</option>
                <option value="anak">Anak</option>
                <option value="remaja">Remaja</option>
                <option value="dewasa">Dewasa</option>
                <option value="lansia">Lansia</option>
              </select>
            </div>

            {/* Status Pembinaan */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Status Pembinaan
              </label>
              <select
                name="status_pembinaan"
                value={form.status_pembinaan}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="aktif">Aktif</option>
                <option value="selesai">Selesai</option>
              </select>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate("/admin/klien")}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm"
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
