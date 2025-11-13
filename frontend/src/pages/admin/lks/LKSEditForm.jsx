import React, { useEffect, useState, useRef, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../../components/AdminLayout";
import API from "../../../utils/api";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  BuildingOfficeIcon,
  MapPinIcon,
  UsersIcon,
  WrenchIcon,
  ChartBarIcon,
  PaperClipIcon,
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
const Field = memo(({ label, name, value, onChange, placeholder, type = "text" }) => (
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
));
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

const LKSEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState([-6.3264, 108.32]);
  const [daftarKecamatan, setDaftarKecamatan] = useState([]);

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
    status: "aktif",
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
  const [existingDocs, setExistingDocs] = useState([]);

  // Ambil data LKS & kecamatan
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resLks, resKec] = await Promise.all([
          API.get(`/lks/${id}`),
          API.get("/kecamatan"),
        ]);

        const lks = resLks.data;
        setFormData((prev) => ({
          ...prev,
          ...lks,
          kecamatan_id: lks.kecamatan_id || "",
          status: lks.status || "aktif",
        }));

        if (lks.koordinat) {
          const [lat, lng] = lks.koordinat.split(",").map(Number);
          setPosition([lat, lng]);
        }

        if (lks.dokumen) {
          const parsed = Array.isArray(lks.dokumen)
            ? lks.dokumen
            : JSON.parse(lks.dokumen);
          setExistingDocs(parsed);
        }

        setDaftarKecamatan(resKec.data?.data || []);
      } catch (err) {
        console.error("❌ Gagal ambil data:", err);
        alert("Gagal memuat data LKS!");
      }
    };
    fetchData();
  }, [id]);

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
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== undefined && formData[key] !== null)
          data.append(key, formData[key]);
      });
      dokumenFiles.forEach((file) => data.append("dokumen[]", file));

      await API.post(`/lks/${id}?_method=PUT`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Data berhasil diperbarui!");
      navigate("/admin/lks");
    } catch (err) {
      console.error("❌ Error simpan:", err);
      if (err.response) {
        console.group("⚠️ DETAIL ERROR LARAVEL 422");
        console.log("Status:", err.response.status);
        console.log("Data:", JSON.stringify(err.response.data, null, 2));
        console.groupEnd();
        alert("Gagal menyimpan. Periksa console untuk detail error.");
      } else {
        alert("Server tidak merespons.");
      }
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
          Edit Data Lembaga Kesejahteraan Sosial
        </h1>

        {/* 🏢 Profil Umum */}
        <section>
          <SectionHeader icon={BuildingOfficeIcon} title="Profil Umum" color="blue" />
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Nama LKS *" name="nama" value={formData.nama} onChange={handleChange} />
            <Field label="Jenis Layanan *" name="jenis_layanan" value={formData.jenis_layanan} onChange={handleChange} />
            <AutoResizeTextarea label="Alamat Lengkap *" name="alamat" value={formData.alamat} onChange={handleChange} />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kecamatan *</label>
              <select
                name="kecamatan_id"
                value={formData.kecamatan_id}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">Pilih Kecamatan</option>
                {daftarKecamatan.map((kec) => (
                  <option key={kec.id} value={kec.id}>
                    {kec.nama}
                  </option>
                ))}
              </select>
            </div>

            <Field label="Kelurahan / Desa *" name="kelurahan" value={formData.kelurahan} onChange={handleChange} />
            <Field label="NPWP" name="npwp" value={formData.npwp} onChange={handleChange} />
            <Field label="Kontak Pengurus" name="kontak_pengurus" value={formData.kontak_pengurus} onChange={handleChange} />
            <Field label="Akta Pendirian" name="akta_pendirian" value={formData.akta_pendirian} onChange={handleChange} />
            <Field label="Izin Operasional" name="izin_operasional" value={formData.izin_operasional} onChange={handleChange} />
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

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
            required
          >
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* 👥 Pengurus */}
        <section>
          <SectionHeader icon={UsersIcon} title="Pengurus" color="purple" />
          <Field label="Jumlah Pengurus" name="jumlah_pengurus" type="number" value={formData.jumlah_pengurus} onChange={handleChange} />
        </section>

        {/* 🏗️ Sarana */}
        <section>
          <SectionHeader icon={WrenchIcon} title="Sarana & Prasarana" color="green" />
          <AutoResizeTextarea label="Sarana & Fasilitas" name="sarana" value={formData.sarana} onChange={handleChange} />
        </section>

        {/* 📝 Monitoring */}
        <section>
          <SectionHeader icon={ChartBarIcon} title="Monitoring" color="pink" />
          <AutoResizeTextarea label="Hasil Observasi" name="hasil_observasi" value={formData.hasil_observasi} onChange={handleChange} />
          <AutoResizeTextarea label="Tindak Lanjut" name="tindak_lanjut" value={formData.tindak_lanjut} onChange={handleChange} />
        </section>

        {/* 📎 Dokumen */}
        <section>
          <SectionHeader icon={PaperClipIcon} title="Dokumen Pendukung" color="gray" />
          {existingDocs?.length > 0 && (
            <ul className="list-disc pl-5 text-sm text-gray-600 mb-3">
              {existingDocs.map((file, idx) => (
                <li key={idx}>
                  <a href={file.url || file} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {file.name || `Dokumen ${idx + 1}`}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer p-2 bg-gray-50 hover:bg-gray-100 transition"
          />
        </section>

        {/* SIMPAN */}
        <div className="text-right pt-6 border-t">
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
    </AdminLayout>
  );
};

export default LKSEditForm;
