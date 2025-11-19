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
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

// 🧭 Marker leaflet
const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [34, 34],
  iconAnchor: [17, 34],
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

// ✏️ Input umum
const Field = memo(({ label, name, value, onChange, placeholder, type = "text", index }) => (
  <div className="space-y-1">
    <label className="block text-sm font-semibold text-gray-700">
      {index && <span className="text-blue-600 font-bold mr-1">{index}.</span>}
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition"
    />
  </div>
));
Field.displayName = "Field";

// 🧾 Textarea otomatis
const AutoResizeTextarea = memo(({ label, name, value, onChange, placeholder, index }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [value]);
  return (
    <div className="space-y-1">
      <label className="block text-sm font-semibold text-gray-700">
        {index && <span className="text-blue-600 font-bold mr-1">{index}.</span>}
        {label}
      </label>
      <textarea
        ref={ref}
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        rows={2}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none shadow-sm transition"
      />
    </div>
  );
});
AutoResizeTextarea.displayName = "AutoResizeTextarea";

// 🏗️ Komponen utama
const LKSProfileEdit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState([-6.3264, 108.32]);
  const [kecamatanList, setKecamatanList] = useState([]);

  const [formData, setFormData] = useState({
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
    status_akreditasi: "",
    tanggal_akreditasi: "",
    no_sertifikat: "",
    jumlah_pengurus: "",
    sarana: "",
    hasil_observasi: "",
    tindak_lanjut: "",
    koordinat: "",
  });

  useEffect(() => {
    API.get("/kecamatan").then((res) => setKecamatanList(res.data.data));
    API.get("/lks/profile-view")
      .then((res) => {
        const data = res.data.data;
        setFormData((prev) => ({
          ...prev,
          ...data,
          jumlah_pengurus: data.jumlah_pengurus ?? "",
        }));
        if (data.koordinat) {
          const [lat, lng] = data.koordinat.split(",").map(Number);
          if (!isNaN(lat) && !isNaN(lng)) setPosition([lat, lng]);
        }
      })
      .catch(() => alert("Gagal memuat data untuk diedit"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put("/lks/me/update", formData);
      alert("✅ Perubahan berhasil disimpan!");
      navigate("/lks/profile", { replace: true });
    } catch (err) {
      console.error(err);
      alert("❌ Gagal menyimpan perubahan");
    }
    setLoading(false);
  };

  const SectionHeader = ({ icon: Icon, title, color }) => (
    <div className="flex items-center gap-2 mb-5">
      <Icon className={`h-6 w-6 text-${color}-600`} />
      <h2 className={`text-lg font-semibold text-${color}-700`}>{title}</h2>
      <div className="flex-1 border-t border-gray-200 ml-2"></div>
    </div>
  );

  let fieldIndex = 1;

  return (
    <LKSLayout>
      <form
        onSubmit={saveProfile}
        className="max-w-5xl mx-auto bg-white p-10 rounded-3xl shadow-2xl space-y-10 border border-gray-100"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <ClipboardDocumentCheckIcon className="h-8 w-8 text-blue-600" />
            Edit Profil Lembaga
          </h1>
        </div>

        {/* 🏢 PROFIL UMUM */}
        <section>
          <SectionHeader icon={BuildingOfficeIcon} title="Profil Umum" color="blue" />
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Nama LKS" index={fieldIndex++} name="nama" value={formData.nama} onChange={handleChange} />
            <Field label="Jenis Layanan" index={fieldIndex++} name="jenis_layanan" value={formData.jenis_layanan} onChange={handleChange} />
            <AutoResizeTextarea label="Alamat Lengkap" index={fieldIndex++} name="alamat" value={formData.alamat} onChange={handleChange} />

            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                <span className="text-blue-600 font-bold mr-1">{fieldIndex++}.</span> Kecamatan
              </label>
              <select
                name="kecamatan_id"
                value={formData.kecamatan_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition"
              >
                <option value="">Pilih Kecamatan</option>
                {kecamatanList.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama}
                  </option>
                ))}
              </select>
            </div>

            <Field label="Kelurahan / Desa" index={fieldIndex++} name="kelurahan" value={formData.kelurahan} onChange={handleChange} />
            <Field label="NPWP" index={fieldIndex++} name="npwp" value={formData.npwp} onChange={handleChange} />
            <Field label="Kontak Pengurus" index={fieldIndex++} name="kontak_pengurus" value={formData.kontak_pengurus} onChange={handleChange} />
            <Field label="Akta Pendirian" index={fieldIndex++} name="akta_pendirian" value={formData.akta_pendirian} onChange={handleChange} />
            <Field label="Legalitas" index={fieldIndex++} name="legalitas" value={formData.legalitas} onChange={handleChange} />
            <Field label="Izin Operasional" index={fieldIndex++} name="izin_operasional" value={formData.izin_operasional} onChange={handleChange} />
            <Field label="Status Akreditasi" index={fieldIndex++} name="status_akreditasi" value={formData.status_akreditasi} onChange={handleChange} />
            <Field type="date" label="Tanggal Akreditasi" index={fieldIndex++} name="tanggal_akreditasi" value={formData.tanggal_akreditasi} onChange={handleChange} />
            <Field label="No Sertifikat" index={fieldIndex++} name="no_sertifikat" value={formData.no_sertifikat} onChange={handleChange} />
          </div>
        </section>

        {/* 📍 LOKASI */}
        <section>
          <SectionHeader icon={MapPinIcon} title="Lokasi LKS" color="red" />
          <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100">
            <MapContainer center={position} zoom={13} className="h-80 z-0">
              <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
              <LocationMarker position={position} setPosition={setPosition} setFormData={setFormData} />
            </MapContainer>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Klik di peta untuk memperbarui lokasi. Koordinat:{" "}
            <strong>{formData.koordinat || "Belum dipilih"}</strong>
          </p>
        </section>

        {/* 👥 PENGURUS */}
        <section>
          <SectionHeader icon={UsersIcon} title="Pengurus" color="purple" />
          <Field label="Jumlah Pengurus" index={fieldIndex++} type="number" name="jumlah_pengurus" value={formData.jumlah_pengurus} onChange={handleChange} />
        </section>

        {/* 🧱 SARANA */}
        <section>
          <SectionHeader icon={WrenchIcon} title="Sarana & Prasarana" color="green" />
          <AutoResizeTextarea label="Sarana & Fasilitas" index={fieldIndex++} name="sarana" value={formData.sarana} onChange={handleChange} />
        </section>

        {/* 🧾 MONITORING */}
        <section>
          <SectionHeader icon={ChartBarIcon} title="Monitoring" color="pink" />
          <AutoResizeTextarea label="Hasil Observasi" index={fieldIndex++} name="hasil_observasi" value={formData.hasil_observasi} onChange={handleChange} />
          <AutoResizeTextarea label="Tindak Lanjut" index={fieldIndex++} name="tindak_lanjut" value={formData.tindak_lanjut} onChange={handleChange} />
        </section>

        {/* 🔘 TOMBOL */}
        <div className="flex justify-between items-center pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate("/lks/profile")}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium shadow-sm transition-all"
          >
            <ArrowLeftIcon className="h-4 w-4" /> Kembali
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-2.5 rounded-md font-semibold text-white shadow-md transition-all ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </LKSLayout>
  );
};

export default LKSProfileEdit;
