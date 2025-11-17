import React, { useEffect, useState, useRef } from "react";
import API from "../../utils/api";
import LKSLayout from "../../components/LKSLayout";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Marker
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

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

const LKSProfileEdit = () => {
  const [loading, setLoading] = useState(false);
  const [kecamatanList, setKecamatanList] = useState([]);
  const [position, setPosition] = useState([-6.3264, 108.32]);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama: "",
    jenis_layanan: "",
    alamat: "",
    kelurahan: "",
    kecamatan_id: "",
    npwp: "",
    kontak_pengurus: "",
    legalitas: "",
    status_akreditasi: "",
    no_sertifikat: "",
    tanggal_akreditasi: "",
    akta_pendirian: "",
    izin_operasional: "",
    jumlah_pengurus: "",
    sarana: "",
    hasil_observasi: "",
    tindak_lanjut: "",
    koordinat: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ======================== LOAD DATA ========================
  useEffect(() => {
    API.get("/kecamatan").then((res) => setKecamatanList(res.data.data));

    API.get("/lks/profile-view")
      .then((res) => {
        const data = res.data.data;

        // ⬅️ ⬅️ INI FIX TERBESAR:
        // Mengisi SEMUA FIELD secara otomatis
        setForm({
          ...form,
          ...data,
          jumlah_pengurus: data.jumlah_pengurus ?? "",
          status_akreditasi: data.status_akreditasi ?? "",
        });

        // Set posisi map
        if (data.koordinat) {
          const [lat, lng] = data.koordinat.split(",").map(Number);
          if (!isNaN(lat) && !isNaN(lng)) {
            setPosition([lat, lng]);
          }
        }
      })
      .catch(() => alert("Gagal memuat data untuk diedit"));
  }, []);

  // ======================== SAVE ========================
  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.put("/lks/me/update", form);
      alert("Perubahan berhasil disimpan!");

      // Redirect kembali ke halaman profile
      navigate("/lks/profile", { replace: true });

    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan perubahan");
    }

    setLoading(false);
  };

  return (
    <LKSLayout>
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md border">
        <h1 className="text-2xl font-bold text-center mb-6">Edit Profil LKS</h1>

        <form onSubmit={saveProfile} className="space-y-10">
          {/* ================= PROFIL UMUM ================= */}
          <section>
            <h2 className="text-lg font-semibold text-blue-700 mb-3">
              Profil Umum
            </h2>

            <div className="grid grid-cols-2 gap-5">
              <input
                type="text"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                placeholder="Nama LKS"
              />

              <input
                type="text"
                name="jenis_layanan"
                value={form.jenis_layanan}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                placeholder="Jenis Layanan"
              />

              <input
                type="text"
                name="alamat"
                value={form.alamat}
                onChange={handleChange}
                className="border p-2 rounded w-full col-span-2"
                placeholder="Alamat"
              />

              <input
                type="text"
                name="kelurahan"
                value={form.kelurahan}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                placeholder="Kelurahan"
              />

              <select
                name="kecamatan_id"
                value={form.kecamatan_id}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              >
                <option value="">Pilih Kecamatan</option>
                {kecamatanList.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="npwp"
                value={form.npwp || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                placeholder="NPWP"
              />

              <input
                type="text"
                name="kontak_pengurus"
                value={form.kontak_pengurus || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                placeholder="Kontak Pengurus"
              />
            </div>
          </section>

          {/* ================= LEGALITAS ================= */}
          <section>
            <h2 className="text-lg font-semibold text-green-700 mb-3">
              Legalitas & Akreditasi
            </h2>

            <div className="grid grid-cols-2 gap-5">
              <input
                type="text"
                name="legalitas"
                value={form.legalitas || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                placeholder="Legalitas"
              />

              <input
                type="text"
                name="akta_pendirian"
                value={form.akta_pendirian || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                placeholder="Akta Pendirian"
              />

              <input
                type="text"
                name="izin_operasional"
                value={form.izin_operasional || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                placeholder="Izin Operasional"
              />

              <input
                type="text"
                name="status_akreditasi"
                value={form.status_akreditasi || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                placeholder="Status Akreditasi"
              />

              <input
                type="text"
                name="no_sertifikat"
                value={form.no_sertifikat || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                placeholder="Nomor Sertifikat"
              />

              <input
                type="date"
                name="tanggal_akreditasi"
                value={form.tanggal_akreditasi || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
          </section>

          {/* ================= PENGURUS ================= */}
          <section>
            <h2 className="text-lg font-semibold text-purple-700 mb-3">
              Pengurus
            </h2>

            <input
              type="number"
              name="jumlah_pengurus"
              value={form.jumlah_pengurus}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="Jumlah Pengurus"
            />
          </section>

          {/* ================= SARANA ================= */}
          <section>
            <h2 className="text-lg font-semibold text-orange-700 mb-3">
              Sarana & Prasarana
            </h2>

            <textarea
              name="sarana"
              value={form.sarana || ""}
              onChange={handleChange}
              rows="3"
              className="border p-2 rounded w-full"
            />
          </section>

          {/* ================= MONITORING ================= */}
          <section>
            <h2 className="text-lg font-semibold text-pink-700 mb-3">
              Monitoring
            </h2>

            <textarea
              name="hasil_observasi"
              value={form.hasil_observasi || ""}
              onChange={handleChange}
              rows="3"
              className="border p-2 rounded w-full"
            />

            <textarea
              name="tindak_lanjut"
              value={form.tindak_lanjut || ""}
              onChange={handleChange}
              rows="3"
              className="border p-2 rounded w-full mt-3"
            />
          </section>

          {/* ================= LOKASI MAP ================= */}
          <section>
            <h2 className="text-lg font-semibold text-red-700 mb-3">Lokasi LKS</h2>

            <div className="h-72 shadow border rounded-lg overflow-hidden">
              <MapContainer
                center={position}
                zoom={15}
                className="h-full w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker
                  position={position}
                  setPosition={setPosition}
                  setForm={setForm}
                />
              </MapContainer>
            </div>

            <p className="mt-2 text-sm">
              <b>Koordinat:</b> {form.koordinat || "-"}
            </p>
          </section>

          <div className="text-right">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </LKSLayout>
  );
};

export default LKSProfileEdit;
