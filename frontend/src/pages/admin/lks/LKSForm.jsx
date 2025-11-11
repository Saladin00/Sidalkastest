import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../components/AdminLayout";
import API from "../../../utils/api";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 🧭 Ikon marker bawaan leaflet
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// 📍 Komponen Marker interaktif untuk pilih lokasi
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

// 🧾 FORM UTAMA
const LKSForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState([-6.3264, 108.32]);
  const [daftarKecamatan, setDaftarKecamatan] = useState([]);

  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    jenis_layanan: "",
    kecamatan_id: "",
    kelurahan: "",
    npwp: "",
    koordinat: "",
  });

  // 🔹 Ambil daftar kecamatan dari backend
  useEffect(() => {
    API.get("/kecamatan")
      .then((res) => setDaftarKecamatan(res.data?.data || []))
      .catch(() => alert("❌ Gagal memuat data kecamatan"));
  }, []);

  // 🔹 Handler input form
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // 🔹 Submit ke backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) =>
        data.append(key, formData[key] || "")
      );

      await API.post("/lks", data);
      alert("✅ Data LKS berhasil disimpan!");
      navigate("/admin/lks");
    } catch (err) {
      console.error(err);
      alert("❌ Gagal menyimpan data LKS.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Tambah Lembaga Kesejahteraan Sosial (LKS)
        </h1>
        <p className="text-sm text-gray-500 mb-8 text-center">
          Lengkapi form di bawah ini untuk menambahkan data LKS baru.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama LKS *
            </label>
            <input
              name="nama"
              placeholder="Masukkan nama lembaga"
              value={formData.nama}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Jenis Layanan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jenis Layanan *
            </label>
            <select
              name="jenis_layanan"
              value={formData.jenis_layanan}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">Pilih Jenis Layanan</option>
              <option value="Anak">Anak</option>
              <option value="Disabilitas">Disabilitas</option>
              <option value="Lansia">Lansia</option>
              <option value="Fakir Miskin">Fakir Miskin</option>
              <option value="Kesejahteraan Sosial">Kesejahteraan Sosial</option>
              <option value="Rehabilitasi Sosial">Rehabilitasi Sosial</option>
            </select>
          </div>

          {/* Alamat */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat Lengkap *
            </label>
            <textarea
              name="alamat"
              placeholder="Jl. Contoh No.123, Kecamatan X, Kabupaten Indramayu"
              value={formData.alamat}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Kecamatan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kecamatan *
            </label>
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

          {/* Kelurahan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kelurahan / Desa *
            </label>
            <input
              name="kelurahan"
              placeholder="Nama kelurahan atau desa"
              value={formData.kelurahan}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* NPWP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NPWP (opsional)
            </label>
            <input
              name="npwp"
              placeholder="Masukkan NPWP LKS"
              value={formData.npwp}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Peta Lokasi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lokasi di Peta (klik untuk memilih titik)
            </label>
            <MapContainer
              center={position}
              zoom={13}
              className="h-72 rounded-lg border shadow-sm z-0"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker
                position={position}
                setPosition={setPosition}
                setFormData={setFormData}
              />
            </MapContainer>
            <p className="text-sm text-gray-500 mt-2">
              Koordinat:{" "}
              <strong>{formData.koordinat || "Belum dipilih"}</strong>
            </p>
          </div>

          {/* Tombol Simpan */}
          <div className="text-right pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate("/admin/lks")}
              className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500 mr-3"
            >
              Kembali
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded font-semibold text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Menyimpan..." : "Simpan Data"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default LKSForm;
