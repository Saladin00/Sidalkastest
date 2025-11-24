import React, { useEffect, useState, useRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../components/AdminLayout";
import API from "../../../utils/api";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  BuildingOfficeIcon,
  MapPinIcon,
  UsersIcon,
  WrenchIcon,
  ChartBarIcon,
  PaperClipIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

// ===============================
// LEAFLET MARKER
// ===============================
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// ===============================
// MAP INTERAKTIF
// ===============================
const LocationMarker = ({ position, setPosition, setForm }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setForm((prev) => ({ ...prev, koordinat: `${lat},${lng}` }));
    },
  });
  return <Marker position={position} icon={markerIcon} />;
};

// ===============================
// INPUT FIELD
// ===============================
const Field = memo(({ label, name, value, onChange, type = "text" }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-sky-500 outline-none"
    />
  </div>
));

// ===============================
// TEXTAREA AUTO-RESIZE
// ===============================
const AutoTextarea = memo(({ label, name, value, onChange }) => {
  const ref = useRef();
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [value]);
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <textarea
        ref={ref}
        name={name}
        value={value || ""}
        onChange={onChange}
        rows={2}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none shadow-sm text-sm focus:ring-2 focus:ring-sky-500 outline-none"
      />
    </div>
  );
});

// ===============================
// SECTION HEADER
// ===============================
const SectionHeader = ({ icon: Icon, title, color }) => (
  <div className="flex items-center gap-2 mb-5">
    <Icon className={`h-5 w-5 text-${color}-600`} />
    <h2 className={`text-lg font-semibold text-${color}-700`}>{title}</h2>
    <div className="flex-1 border-t border-gray-200 ml-2"></div>
  </div>
);

// ===============================
// MAIN COMPONENT
// ===============================
const LKSForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [daftarKecamatan, setDaftarKecamatan] = useState([]);
  const [dokumenBaru, setDokumenBaru] = useState([]);
  const [position, setPosition] = useState([-6.3264, 108.32]);

  const [form, setForm] = useState({
    nama: "",
    alamat: "",
    jenis_layanan: "",
    npwp: "",
    kecamatan_id: "",
    kelurahan: "",
    akta_pendirian: "",
    izin_operasional: "",
    kontak_pengurus: "",
    legalitas: "",
    no_akta: "",
    status_akreditasi: "",
    no_sertifikat: "",
    tanggal_akreditasi: "",
    koordinat: "",
    jumlah_pengurus: "",
    sarana: "",
    hasil_observasi: "",
    tindak_lanjut: "",
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // ===============================
  // VALIDASI FILE UPLOAD
  // ===============================
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      const allowed = ["application/pdf", "image/jpeg", "image/png"];
      const isValidType = allowed.includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024;

      if (!isValidType) toast.error(` ${file.name} bukan PDF/JPG/PNG`);
      if (!isValidSize) toast.warning(` ${file.name} melebihi 5 MB`);

      return isValidType && isValidSize;
    });
    setDokumenBaru(validFiles);
  };

  // ===============================
  // LOAD KECAMATAN
  // ===============================
  useEffect(() => {
    API.get("/kecamatan")
      .then((r) => setDaftarKecamatan(r.data.data))
      .catch(() => toast.error("Gagal memuat daftar kecamatan"));
  }, []);

  // ===============================
  // SIMPAN DATA
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = new FormData();
      Object.keys(form).forEach((key) => payload.append(key, form[key] ?? ""));
      dokumenBaru.forEach((file) => payload.append("dokumen[]", file));

      await API.post("/lks", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(" LKS baru berhasil ditambahkan!");
      setTimeout(() => navigate("/admin/lks"), 1500);
    } catch (err) {
      console.error(" Gagal menyimpan LKS:", err);
      toast.error("Gagal menambah data LKS. Silakan periksa kembali input Anda.");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-sky-700 mb-8">
          Tambah Lembaga Kesejahteraan Sosial (LKS)
        </h1>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* ================= PROFILE ================= */}
          <section>
            <SectionHeader
              icon={BuildingOfficeIcon}
              title="Profil Umum"
              color="blue"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Nama LKS" name="nama" value={form.nama} onChange={handleChange} />
              <Field label="Jenis Layanan" name="jenis_layanan" value={form.jenis_layanan} onChange={handleChange} />
              <AutoTextarea label="Alamat Lengkap" name="alamat" value={form.alamat} onChange={handleChange} />

              <div>
                <label className="text-sm font-medium text-gray-700">Kecamatan</label>
                <select
                  name="kecamatan_id"
                  value={form.kecamatan_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                >
                  <option value="">Pilih Kecamatan</option>
                  {daftarKecamatan.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.nama}
                    </option>
                  ))}
                </select>
              </div>

              <Field label="Kelurahan / Desa" name="kelurahan" value={form.kelurahan} onChange={handleChange} />
              <Field label="NPWP" name="npwp" value={form.npwp} onChange={handleChange} />
              <Field label="Kontak Pengurus" name="kontak_pengurus" value={form.kontak_pengurus} onChange={handleChange} />
              <Field label="Legalitas" name="legalitas" value={form.legalitas} onChange={handleChange} />
              <Field label="Status Akreditasi" name="status_akreditasi" value={form.status_akreditasi} onChange={handleChange} />
              <Field label="No Sertifikat" name="no_sertifikat" value={form.no_sertifikat} onChange={handleChange} />
              <Field type="date" label="Tanggal Akreditasi" name="tanggal_akreditasi" value={form.tanggal_akreditasi} onChange={handleChange} />
              <Field label="Akta Pendirian" name="akta_pendirian" value={form.akta_pendirian} onChange={handleChange} />
              <Field label="Izin Operasional" name="izin_operasional" value={form.izin_operasional} onChange={handleChange} />
            </div>
          </section>

          {/* ================= PETA ================= */}
          <section>
            <SectionHeader icon={MapPinIcon} title="Lokasi LKS" color="red" />
            <MapContainer
              center={position}
              zoom={13}
              className="h-72 rounded-xl border shadow z-0"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker position={position} setPosition={setPosition} setForm={setForm} />
            </MapContainer>
            <p className="text-sm mt-2 text-gray-600">
              Klik pada peta untuk menentukan lokasi LKS. <br />
              <strong>Koordinat:</strong> {form.koordinat || "Belum dipilih"}
            </p>
          </section>

          {/* ================= PENGURUS ================= */}
          <section>
            <SectionHeader icon={UsersIcon} title="Pengurus" color="purple" />
            <Field
              label="Jumlah Pengurus"
              name="jumlah_pengurus"
              type="number"
              value={form.jumlah_pengurus}
              onChange={handleChange}
            />
          </section>

          {/* ================= SARANA ================= */}
          <section>
            <SectionHeader icon={WrenchIcon} title="Sarana & Prasarana" color="green" />
            <AutoTextarea
              label="Sarana & Fasilitas"
              name="sarana"
              value={form.sarana}
              onChange={handleChange}
            />
          </section>

          {/* ================= MONITORING ================= */}
          <section>
            <SectionHeader icon={ChartBarIcon} title="Monitoring" color="pink" />
            <AutoTextarea
              label="Hasil Observasi"
              name="hasil_observasi"
              value={form.hasil_observasi}
              onChange={handleChange}
            />
            <AutoTextarea
              label="Tindak Lanjut"
              name="tindak_lanjut"
              value={form.tindak_lanjut}
              onChange={handleChange}
            />
          </section>


          {/* ================= BUTTONS ================= */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200 gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/lks")}
              className="flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium shadow-md transition"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Kembali
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-2.5 rounded-lg font-semibold text-white shadow-md transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {loading ? "Menyimpan..." : "Simpan Data"}
            </button>
          </div>
        </form>
      </div>

      {/* TOAST CONTAINER */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop />
    </AdminLayout>
  );
};

export default LKSForm;
