import React, { useEffect, useState, useRef, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
const Field = memo(({ label, name, value, onChange, type = "text" }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
    />
  </div>
));
Field.displayName = "Field";

// 🧾 Textarea otomatis
const AutoResizeTextarea = memo(({ label, name, value, onChange }) => {
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

  const [dokumenFiles, setDokumenFiles] = useState([]);
  const [existingDocs, setExistingDocs] = useState([]);

  // 🔹 Ambil data awal
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resLks, resKec] = await Promise.all([
          API.get(`/lks/${id}`),
          API.get("/kecamatan"),
        ]);

        const lks = resLks.data.data ?? resLks.data;
        setFormData({
          nama: lks.nama ?? "",
          alamat: lks.alamat ?? "",
          jenis_layanan: lks.jenis_layanan ?? "",
          npwp: lks.npwp ?? "",
          kecamatan_id: lks.kecamatan?.id ?? "",
          kelurahan: lks.kelurahan ?? "",
          akta_pendirian: lks.akta_pendirian ?? "",
          izin_operasional: lks.izin_operasional ?? "",
          kontak_pengurus: lks.kontak_pengurus ?? "",
          status: lks.status ?? "aktif",
          legalitas: lks.legalitas ?? "",
          no_akta: lks.no_akta ?? "",
          status_akreditasi: lks.status_akreditasi ?? "",
          no_sertifikat: lks.no_sertifikat ?? "",
          tanggal_akreditasi: lks.tanggal_akreditasi ?? "",
          koordinat: lks.koordinat ?? "",
          jumlah_pengurus: lks.jumlah_pengurus ?? "",
          sarana: lks.sarana ?? "",
          hasil_observasi: lks.hasil_observasi ?? "",
          tindak_lanjut: lks.tindak_lanjut ?? "",
        });

        if (lks.koordinat) {
          const [lat, lng] = lks.koordinat.split(",").map(Number);
          if (!isNaN(lat) && !isNaN(lng)) setPosition([lat, lng]);
        }

        setExistingDocs(
          lks.dokumen
            ? Array.isArray(lks.dokumen)
              ? lks.dokumen
              : JSON.parse(lks.dokumen)
            : []
        );
        setDaftarKecamatan(resKec.data?.data || []);
      } catch (err) {
        console.error(" Gagal ambil data:", err);
        toast.error("Gagal memuat data LKS!");
      }
    };
    fetchData();
  }, [id]);

  // 🔹 Validasi dokumen
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      const allowed = ["application/pdf", "image/jpeg", "image/png"];
      const isValidType = allowed.includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024;
      if (!isValidType) toast.error(`❌ ${file.name} bukan PDF/JPG/PNG`);
      if (!isValidSize) toast.warning(`⚠️ ${file.name} melebihi 5 MB`);
      return isValidType && isValidSize;
    });
    setDokumenFiles(validFiles);
  };

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      dokumenFiles.forEach((file) => data.append("dokumen[]", file));
      await API.post(`/lks/${id}?_method=PUT`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Data berhasil diperbarui!");
      setTimeout(() => navigate("/admin/lks"), 1500);
    } catch (err) {
      console.error(" Gagal simpan:", err);
      toast.error("Gagal menyimpan data!");
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
        className="max-w-5xl mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-gray-100 space-y-10"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
          Edit Data Lembaga Kesejahteraan Sosial
        </h1>

        {/* 🏢 Profil Umum */}
        <section>
          <SectionHeader icon={BuildingOfficeIcon} title="Profil Umum" color="blue" />
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Nama LKS" name="nama" value={formData.nama} onChange={(e)=>setFormData({...formData,nama:e.target.value})}/>
            <Field label="Jenis Layanan" name="jenis_layanan" value={formData.jenis_layanan} onChange={(e)=>setFormData({...formData,jenis_layanan:e.target.value})}/>
            <AutoResizeTextarea label="Alamat" name="alamat" value={formData.alamat} onChange={(e)=>setFormData({...formData,alamat:e.target.value})}/>
            <div>
              <label className="block text-sm font-medium">Kecamatan</label>
              <select name="kecamatan_id" value={formData.kecamatan_id} onChange={(e)=>setFormData({...formData,kecamatan_id:e.target.value})} className="w-full border p-2 rounded-lg">
                <option value="">Pilih Kecamatan</option>
                {daftarKecamatan.map((k)=>(<option key={k.id} value={k.id}>{k.nama}</option>))}
              </select>
            </div>
            <Field label="Kelurahan" name="kelurahan" value={formData.kelurahan} onChange={(e)=>setFormData({...formData,kelurahan:e.target.value})}/>
            <Field label="NPWP" name="npwp" value={formData.npwp} onChange={(e)=>setFormData({...formData,npwp:e.target.value})}/>
            <Field label="Kontak Pengurus" name="kontak_pengurus" value={formData.kontak_pengurus} onChange={(e)=>setFormData({...formData,kontak_pengurus:e.target.value})}/>
          </div>
        </section>

        {/* 📍 Lokasi */}
        <section>
          <SectionHeader icon={MapPinIcon} title="Lokasi LKS" color="red" />
          <MapContainer center={position} zoom={13} className="h-72 rounded-xl border shadow">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker position={position} setPosition={setPosition} setFormData={setFormData}/>
          </MapContainer>
          <p className="text-sm text-gray-600 mt-2">
            Klik peta untuk ubah koordinat: <b>{formData.koordinat || "Belum dipilih"}</b>
          </p>
        </section>

        {/* 👥 Pengurus */}
        <section>
          <SectionHeader icon={UsersIcon} title="Pengurus" color="purple" />
          <Field type="number" label="Jumlah Pengurus" name="jumlah_pengurus" value={formData.jumlah_pengurus} onChange={(e)=>setFormData({...formData,jumlah_pengurus:e.target.value})}/>
        </section>

        {/* 🏗️ Sarana */}
        <section>
          <SectionHeader icon={WrenchIcon} title="Sarana & Prasarana" color="green" />
          <AutoResizeTextarea label="Sarana & Fasilitas" name="sarana" value={formData.sarana} onChange={(e)=>setFormData({...formData,sarana:e.target.value})}/>
        </section>

        {/* 📊 Monitoring */}
        <section>
          <SectionHeader icon={ChartBarIcon} title="Monitoring" color="pink" />
          <AutoResizeTextarea label="Hasil Observasi" name="hasil_observasi" value={formData.hasil_observasi} onChange={(e)=>setFormData({...formData,hasil_observasi:e.target.value})}/>
          <AutoResizeTextarea label="Tindak Lanjut" name="tindak_lanjut" value={formData.tindak_lanjut} onChange={(e)=>setFormData({...formData,tindak_lanjut:e.target.value})}/>
        </section>
        {/* 🔘 Tombol Aksi */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200 gap-3">
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium shadow-md transition">
            Kembali
          </button>
          <button type="submit" disabled={loading} className={`px-8 py-2.5 rounded-lg font-semibold text-white shadow-md transition-all ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"}`}>
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop />
    </AdminLayout>
  );
};

export default LKSEditForm;
