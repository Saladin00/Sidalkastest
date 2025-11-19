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

// 🧭 Marker leaflet
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

// ✏️ Input umum
const Field = memo(
  ({ label, name, value, onChange, placeholder, type = "text" }) => (
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
    </div>
  )
);
Field.displayName = "Field";

// 🧾 Textarea otomatis
const AutoResizeTextarea = memo(({ label, name, value, onChange, placeholder }) => {
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
    no_sertifikat: "",
    tanggal_akreditasi: "",
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
          status_akreditasi: data.status_akreditasi ?? "",
        }));
        if (data.koordinat) {
          const [lat, lng] = data.koordinat.split(",").map(Number);
          if (!isNaN(lat) && !isNaN(lng)) {
            setPosition([lat, lng]);
          }
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
      alert("Perubahan berhasil disimpan!");
      navigate("/lks/profile", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan perubahan");
    }
    setLoading(false);
  };

  const SectionHeader = ({ icon: Icon, title, color }) => (
    <div className="flex items-center gap-2 mb-5">
      <Icon className={`h-5 w-5 text-${color}-600`} />
      <h2 className={`text-lg font-semibold text-${color}-700`}>{title}</h2>
      <div className="flex-1 border-t border-gray-200 ml-2"></div>
    </div>
  );

  return (
    <LKSLayout>
      <form
        onSubmit={saveProfile}
        className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg space-y-10 border border-gray-100"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Edit Profil Lembaga Kesejahteraan Sosial
        </h1>

        {/* 🏢 Profil Umum */}
        <section>
          <SectionHeader icon={BuildingOfficeIcon} title="Profil Umum" color="blue" />
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Nama LKS" name="nama" value={formData.nama} onChange={handleChange} />
            <Field label="Jenis Layanan" name="jenis_layanan" value={formData.jenis_layanan} onChange={handleChange} />
            <AutoResizeTextarea label="Alamat Lengkap" name="alamat" value={formData.alamat} onChange={handleChange} />

            <div>
              <label className="block mb-1 text-sm font-medium">Kecamatan</label>
              <select
                name="kecamatan_id"
                value={formData.kecamatan_id}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              >
                <option value="">Pilih Kecamatan</option>
                {kecamatanList.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama}
                  </option>
                ))}
              </select>
            </div>

            <Field label="Kelurahan / Desa" name="kelurahan" value={formData.kelurahan} onChange={handleChange} />
            <Field label="NPWP" name="npwp" value={formData.npwp} onChange={handleChange} />
            <Field label="Kontak Pengurus" name="kontak_pengurus" value={formData.kontak_pengurus} onChange={handleChange} />
          </div>
        </section>

        {/* 📍 Lokasi */}
        <section>
          <SectionHeader icon={MapPinIcon} title="Lokasi LKS" color="red" />
          <MapContainer center={position} zoom={13} className="h-72 rounded-lg border shadow-sm z-0">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker position={position} setPosition={setPosition} setFormData={setFormData} />
          </MapContainer>
          <p className="text-sm text-gray-500 mt-2">
            Klik di peta untuk memperbarui lokasi. Koordinat:{" "}
            <strong>{formData.koordinat || "Belum dipilih"}</strong>
          </p>
        </section>

        {/* 👥 Pengurus */}
        <section>
          <SectionHeader icon={UsersIcon} title="Pengurus" color="purple" />
          <Field
            label="Jumlah Pengurus"
            name="jumlah_pengurus"
            type="number"
            value={formData.jumlah_pengurus}
            onChange={handleChange}
          />
        </section>

        {/* 🏗️ Sarana */}
        <section>
          <SectionHeader icon={WrenchIcon} title="Sarana & Prasarana" color="green" />
          <AutoResizeTextarea label="Sarana & Fasilitas" name="sarana" value={formData.sarana} onChange={handleChange} />
        </section>

        {/* 📝 Monitoring */}
        <section>
          <SectionHeader icon={ChartBarIcon} title="Monitoring" color="pink" />
          <AutoResizeTextarea
            label="Hasil Observasi"
            name="hasil_observasi"
            value={formData.hasil_observasi}
            onChange={handleChange}
          />
          <AutoResizeTextarea
            label="Tindak Lanjut"
            name="tindak_lanjut"
            value={formData.tindak_lanjut}
            onChange={handleChange}
          />
        </section>

        {/* Tombol bawah */}
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
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
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
