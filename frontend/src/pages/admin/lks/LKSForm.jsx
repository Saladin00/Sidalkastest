import React, { useState, useRef, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../components/AdminLayout";
import API from "../../../utils/api";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
  MapPinIcon,
  UsersIcon,
  WrenchIcon,
  ChartBarIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline";

// 🧭 Marker bawaan leaflet
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// 📍 Marker interaktif
const LocationMarker = ({ position, setPosition, setFormData }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setFormData((prev) => ({ ...prev, koordinat: `${lat},${lng}` }));
    },
  });
  return <Marker position={position} icon={markerIcon} />;
};

// 🧾 Komponen Textarea otomatis menyesuaikan tinggi
const AutoResizeTextarea = memo(({ label, name, value, onChange, placeholder, desc }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [value]);
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <textarea
        ref={ref}
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        rows={2}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none shadow-sm"
      />
      {desc && <p className="text-xs text-gray-400">{desc}</p>}
    </div>
  );
});
AutoResizeTextarea.displayName = "AutoResizeTextarea";

// ✏️ Input umum
const Field = memo(({ label, name, value, onChange, placeholder, desc, type = "text" }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
    />
    {desc && <p className="text-xs text-gray-400">{desc}</p>}
  </div>
));
Field.displayName = "Field";

const LKSForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState([-6.3264, 108.32]);

  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    jenis_layanan: "",
    npwp: "",
    kecamatan: "",
    kelurahan: "",
    akta_pendirian: "",
    izin_operasional: "",
    kontak_pengurus: "",
    status: "Aktif",
    legalitas: "Sudah",
    no_akta: "",
    status_akreditasi: "Belum",
    no_sertifikat: "",
    tanggal_akreditasi: "",
    koordinat: "",
    jumlah_pengurus: "",
    sarana: "",
    hasil_observasi: "",
    tindak_lanjut: "",
  });

  const [dokumenFiles, setDokumenFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setDokumenFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key] || ""));
      dokumenFiles.forEach((file) => data.append("dokumen[]", file));

      const response = await API.post("/lks", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(response.data.message || "✅ Data berhasil disimpan!");
      navigate("/admin/lks");
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        alert("⚠️ Gagal menyimpan data:\n" + JSON.stringify(errors, null, 2));
      } else alert("❌ Gagal menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  const SectionHeader = ({ icon: Icon, title, color }) => (
    <div className="flex items-center gap-2 mb-5">
      <Icon className={`h-5 w-5 text-${color}-600`} />
      <h2 className={`text-lg font-semibold text-${color}-700`}>{title}</h2>
      <div className="flex-1 border-t border-gray-200 ml-2"></div>
    </div>
  );

  return (
    <AdminLayout>
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg space-y-10 border border-gray-100"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Formulir Lembaga Kesejahteraan Sosial
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">
          Lengkapi data di bawah ini sesuai informasi lembaga. Kolom bertanda * wajib diisi.
        </p>

        {/* 🏢 PROFIL UMUM */}
        <section>
          <SectionHeader icon={BuildingOfficeIcon} title="Profil Umum" color="blue" />
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Nama LKS *" name="nama" value={formData.nama} onChange={handleChange} placeholder="Contoh: Panti Asuhan Harapan Kita" />
            <Field label="Jenis Layanan *" name="jenis_layanan" value={formData.jenis_layanan} onChange={handleChange} placeholder="Anak / Lansia / Disabilitas" />
            <AutoResizeTextarea label="Alamat Lengkap *" name="alamat" value={formData.alamat} onChange={handleChange} placeholder="Jl. Contoh No.123, Kec. X, Kab. Indramayu" />
            <Field label="Kecamatan *" name="kecamatan" value={formData.kecamatan} onChange={handleChange} placeholder="Contoh: Indramayu" />
            <Field label="Kelurahan / Desa *" name="kelurahan" value={formData.kelurahan} onChange={handleChange} placeholder="Contoh: Karanganyar" />
            <Field label="NPWP" name="npwp" value={formData.npwp} onChange={handleChange} placeholder="Nomor NPWP lembaga" />
            <Field label="Kontak Pengurus" name="kontak_pengurus" value={formData.kontak_pengurus} onChange={handleChange} placeholder="081234567890" />
            <Field label="Akta Pendirian" name="akta_pendirian" value={formData.akta_pendirian} onChange={handleChange} placeholder="No. akta resmi" />
            <Field label="Izin Operasional" name="izin_operasional" value={formData.izin_operasional} onChange={handleChange} placeholder="Nomor izin dari dinas" />
          </div>
        </section>

        {/* ⚖️ LEGALITAS */}
        <section>
          <SectionHeader icon={ClipboardDocumentListIcon} title="Legalitas & Akreditasi" color="yellow" />
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Status Legalitas</label>
              <select
                name="legalitas"
                value={formData.legalitas}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              >
                <option value="Sudah">Sudah</option>
                <option value="Belum">Belum</option>
              </select>
            </div>

            <Field label="Nomor Akta / Izin" name="no_akta" value={formData.no_akta} onChange={handleChange} placeholder="No. 123/AKT/2025" />

            <div>
              <label className="block text-sm font-medium text-gray-700">Status Akreditasi</label>
              <select
                name="status_akreditasi"
                value={formData.status_akreditasi}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="Belum">Belum</option>
              </select>
            </div>

            <Field label="Nomor Sertifikat Akreditasi" name="no_sertifikat" value={formData.no_sertifikat} onChange={handleChange} placeholder="No. Sertifikat" />
            <Field label="Tanggal Akreditasi" name="tanggal_akreditasi" type="date" value={formData.tanggal_akreditasi} onChange={handleChange} />
          </div>
        </section>

        {/* 📍 LOKASI */}
        <section>
          <SectionHeader icon={MapPinIcon} title="Lokasi LKS" color="red" />
          <MapContainer center={position} zoom={13} className="h-72 rounded-lg border shadow-sm z-0">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker position={position} setPosition={setPosition} setFormData={setFormData} />
          </MapContainer>
          <p className="text-sm text-gray-500 mt-2">
            Klik di peta untuk menentukan lokasi. Koordinat:{" "}
            <strong>{formData.koordinat || "Belum dipilih"}</strong>
          </p>
        </section>

        {/* 👥 PENGURUS */}
        <section>
          <SectionHeader icon={UsersIcon} title="Pengurus" color="purple" />
          <Field label="Jumlah Pengurus" name="jumlah_pengurus" type="number" value={formData.jumlah_pengurus} onChange={handleChange} placeholder="Contoh: 8" />
        </section>

        {/* 🏗️ SARANA */}
        <section>
          <SectionHeader icon={WrenchIcon} title="Sarana & Prasarana" color="green" />
          <AutoResizeTextarea label="Sarana & Fasilitas" name="sarana" value={formData.sarana} onChange={handleChange} placeholder="Contoh: ruang tidur, ruang belajar, kendaraan operasional" />
        </section>

        {/* 📝 MONITORING */}
        <section>
          <SectionHeader icon={ChartBarIcon} title="Monitoring" color="pink" />
          <AutoResizeTextarea label="Hasil Observasi" name="hasil_observasi" value={formData.hasil_observasi} onChange={handleChange} placeholder="Catatan hasil observasi petugas" />
          <AutoResizeTextarea label="Tindak Lanjut" name="tindak_lanjut" value={formData.tindak_lanjut} onChange={handleChange} placeholder="Langkah perbaikan atau rekomendasi" />
        </section>

        {/* 📎 DOKUMEN */}
        <section>
          <SectionHeader icon={PaperClipIcon} title="Dokumen Pendukung" color="gray" />
          <div className="space-y-2">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer p-2 bg-gray-50 hover:bg-gray-100 transition"
            />
            <p className="text-xs text-gray-400">Unggah file (.pdf / .jpg / .png)</p>
          </div>
        </section>

        {/* SUBMIT */}
        <div className="text-right pt-6 border-t">
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-2.5 rounded-md font-semibold text-white shadow-md transition-all ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Menyimpan..." : "Simpan Data"}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default LKSForm;
