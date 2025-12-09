// src/pages/lks/LKSProfileEdit.jsx

import React, { useEffect, useState, useRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import LKSLayout from "../../components/LKSLayout";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import {
  BuildingOfficeIcon,
  MapPinIcon,
  UsersIcon,
  WrenchIcon,
  ChartBarIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ================= ICON MARKER =================
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// ================= MARKER INTERACT =================
const LocationMarker = ({ position, setPosition, setFormData }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setFormData((prev) => ({ ...prev, koordinat: `${lat},${lng}` }));
      toast.info("Lokasi diperbarui", { autoClose: 1200 });
    },
  });

  return <Marker position={position} icon={markerIcon} />;
};

// ================= INPUT COMPONENTS =================
const Field = memo(({ label, name, value, onChange, type = "text" }) => (
  <div className="space-y-1">
    <label className="block text-sm font-semibold text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
));

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
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      <textarea
        ref={ref}
        name={name}
        value={value || ""}
        rows={2}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none shadow-sm text-sm focus:ring-2 focus:ring-blue-500 outline-none"
      ></textarea>
    </div>
  );
});

// ================= SECTION HEADER =================
const SectionHeader = ({ icon: Icon, title, color }) => (
  <div className="flex items-center gap-2 mb-5">
    <Icon className={`h-6 w-6 text-${color}-600`} />
    <h2 className={`text-lg font-bold text-${color}-700`}>{title}</h2>
    <div className="flex-1 border-t border-gray-200 ml-2"></div>
  </div>
);

// ================= MAIN =================
const LKSProfileEdit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [position, setPosition] = useState([-6.3264, 108.32]);
  const [kecamatanList, setKecamatanList] = useState([]);

  // ========== FIELD DISAMAKAN 100% DENGAN ADMIN ==========
  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    jenis_layanan: "",
    kecamatan_id: "",
    kelurahan: "",
    npwp: "",
    kontak_pengurus: "",
    legalitas: "",
    akta_pendirian: "",
    izin_operasional: "",
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

  // ================= LOAD DATA =================
  useEffect(() => {
    const loadData = async () => {
      try {
        const [kecRes, profileRes] = await Promise.all([
          API.get("/kecamatan"),
          API.get("/lks/profile-view"),
        ]);

        setKecamatanList(kecRes.data.data || []);
        const data = profileRes.data.data;

        setFormData((prev) => ({ ...prev, ...data }));

        if (data.koordinat) {
          const [lat, lng] = data.koordinat.split(",").map(Number);
          if (!isNaN(lat) && !isNaN(lng)) setPosition([lat, lng]);
        }
      } catch (err) {
        console.error(err);
        toast.error("Gagal memuat data!", { autoClose: 2000 });
      }
    };
    loadData();
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ================= SAVE =================
  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.put("/lks/me/update", formData);
      toast.success("Profil berhasil diperbarui!", { autoClose: 1500 });
      setTimeout(() => navigate("/lks/profile"), 800);
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan perubahan!", { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  // ================= RENDER =================
  return (
    <LKSLayout>
      <form
        onSubmit={saveProfile}
        className="max-w-5xl mx-auto bg-white p-10 rounded-2xl shadow-lg border border-gray-100 space-y-10"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-5">
          Edit Profil LKS
        </h1>

        {/* ================= PROFILE ================= */}
        <section>
          <SectionHeader icon={BuildingOfficeIcon} title="Profil Umum" color="blue" />

          <div className="grid md:grid-cols-2 gap-6">

            <Field label="Nama LKS" name="nama" value={formData.nama} onChange={handleChange} />

            {/* Jenis Layanan */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Jenis Layanan</label>
              <select
                name="jenis_layanan"
                value={formData.jenis_layanan}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">Pilih Jenis Layanan</option>
                <option value="anak">Anak</option>
                <option value="disabilitas">Disabilitas</option>
                <option value="lansia">Lansia</option>
                <option value="fakir miskin">Fakir Miskin</option>
                <option value="kesejahteraan sosial">Kesejahteraan Sosial</option>
                <option value="rehabilitasi sosial">Rehabilitasi Sosial</option>
              </select>
            </div>

            <AutoTextarea label="Alamat Lengkap" name="alamat" value={formData.alamat} onChange={handleChange} />

            {/* Kecamatan */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">Kecamatan</label>
              <select
                name="kecamatan_id"
                value={formData.kecamatan_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">Pilih Kecamatan</option>
                {kecamatanList.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama}
                  </option>
                ))}
              </select>
            </div>

            <Field label="Kelurahan" name="kelurahan" value={formData.kelurahan} onChange={handleChange} />
            <Field label="NPWP" name="npwp" value={formData.npwp} onChange={handleChange} />
            <Field label="Kontak Pengurus" name="kontak_pengurus" value={formData.kontak_pengurus} onChange={handleChange} />

            {/* Legalitas */}
            <Field label="Legalitas" name="legalitas" value={formData.legalitas} onChange={handleChange} />

            {/* Akta pendirian */}
            <Field label="Akta Pendirian" name="akta_pendirian" value={formData.akta_pendirian} onChange={handleChange} />

            <Field label="Izin Operasional" name="izin_operasional" value={formData.izin_operasional} onChange={handleChange} />
            <Field label="No Akta" name="no_akta" value={formData.no_akta} onChange={handleChange} />

            {/* Status Akreditasi */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Status Akreditasi</label>
              <select
                name="status_akreditasi"
                value={formData.status_akreditasi}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">Pilih Status</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>

            <Field label="No Sertifikat" name="no_sertifikat" value={formData.no_sertifikat} onChange={handleChange} />
            <Field type="date" label="Tanggal Akreditasi" name="tanggal_akreditasi" value={formData.tanggal_akreditasi} onChange={handleChange} />
          </div>
        </section>

        {/* ================= LOKASI ================= */}
        <section>
          <SectionHeader icon={MapPinIcon} title="Lokasi LKS" color="red" />

          <MapContainer center={position} zoom={13} className="h-72 rounded-xl border shadow">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker position={position} setPosition={setPosition} setFormData={setFormData} />
          </MapContainer>

          <p className="text-sm mt-2 text-gray-600">
            Koordinat: <strong>{formData.koordinat || "Belum dipilih"}</strong>
          </p>
        </section>

        {/* ================= PENGURUS ================= */}
        <section>
          <SectionHeader icon={UsersIcon} title="Pengurus" color="purple" />
          <Field
            type="number"
            label="Jumlah Pengurus"
            name="jumlah_pengurus"
            value={formData.jumlah_pengurus}
            onChange={handleChange}
          />
        </section>

        {/* ================= SARANA ================= */}
        <section>
          <SectionHeader icon={WrenchIcon} title="Sarana & Prasarana" color="green" />
          <AutoTextarea
            label="Sarana & Fasilitas"
            name="sarana"
            value={formData.sarana}
            onChange={handleChange}
          />
        </section>

        {/* ================= MONITORING ================= */}
        <section>
          <SectionHeader icon={ChartBarIcon} title="Monitoring" color="pink" />
          <AutoTextarea
            label="Hasil Observasi"
            name="hasil_observasi"
            value={formData.hasil_observasi}
            onChange={handleChange}
          />
          <AutoTextarea
            label="Tindak Lanjut"
            name="tindak_lanjut"
            value={formData.tindak_lanjut}
            onChange={handleChange}
          />
        </section>

        {/* ================= BUTTON ================= */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate("/lks/profile")}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium shadow-sm transition"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Kembali
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-2.5 rounded-lg font-semibold text-white shadow-md transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>

      <ToastContainer position="top-right" autoClose={2500} />
    </LKSLayout>
  );
};

export default LKSProfileEdit;
