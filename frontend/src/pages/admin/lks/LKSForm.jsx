import React, { useEffect, useState, useRef, memo } from "react";
import LKSLayout from "../../../components/LKSLayout";
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

// ===============================
// LEAFLET MARKER
// ===============================
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// ===============================
// MAP CLICK
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
    <label className="text-sm font-medium">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full px-3 py-2 border rounded-lg shadow-sm text-sm"
    />
  </div>
));

// ===============================
// AUTOSIZE TEXTAREA
// ===============================
const AutoTextarea = memo(({ label, name, value, onChange }) => {
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = ref.current.scrollHeight + "px";
  }, [value]);

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <textarea
        ref={ref}
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full px-3 py-2 border rounded-lg resize-none shadow-sm text-sm"
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
    <div className="flex-1 border-t ml-2"></div>
  </div>
);

// ==================================================
//                 MAIN PAGE
// ==================================================
const LKSProfile = () => {
  const [loading, setLoading] = useState(false);
  const [daftarKecamatan, setDaftarKecamatan] = useState([]);
  const [existingDocs, setExistingDocs] = useState([]);
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
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    setDokumenBaru(Array.from(e.target.files));
  };

  // ===============================
  // LOAD INITIAL DATA
  // ===============================
  useEffect(() => {
    API.get("/kecamatan").then((r) => setDaftarKecamatan(r.data.data));

    API.get("/lks/me")
      .then((r) => {
        const data = r.data.data;
        setForm(data);

        if (data.dokumen) setExistingDocs(JSON.parse(data.dokumen));

        if (data.koordinat) {
          const [lat, lng] = data.koordinat.split(",").map(Number);
          setPosition([lat, lng]);
        }
      })
      .catch(() => alert("Gagal memuat profil LKS"));
  }, []);

  // ===============================
  // SAVE PROFILE
  // ===============================
  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let payload = new FormData();
      Object.keys(form).forEach((key) =>
        payload.append(key, form[key] ?? "")
      );

      dokumenBaru.forEach((file) => {
        payload.append("dokumen[]", file);
      });

      await API.post("/lks/me/update?_method=PUT", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Profil berhasil diperbarui!");
    } catch (err) {
      alert("Gagal menyimpan perubahan");
    }

    setLoading(false);
  };

  return (
    <LKSLayout>
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md border">
        <h1 className="text-2xl font-bold text-center mb-6">
          Profil Lembaga Kesejahteraan Sosial (LKS)
        </h1>

        <form onSubmit={saveProfile} className="space-y-10">

          {/* ================= PROFILE UMUM ================= */}
          <section>
            <SectionHeader
              icon={BuildingOfficeIcon}
              title="Profil Umum"
              color="blue"
            />

            <div className="grid md:grid-cols-2 gap-6">
              <Field label="Nama LKS" name="nama" value={form.nama} onChange={handleChange} />

              <Field
                label="Jenis Layanan"
                name="jenis_layanan"
                value={form.jenis_layanan}
                onChange={handleChange}
              />

              <AutoTextarea
                label="Alamat"
                name="alamat"
                value={form.alamat}
                onChange={handleChange}
              />

              <div>
                <label className="text-sm font-medium">Kecamatan</label>
                <select
                  name="kecamatan_id"
                  value={form.kecamatan_id || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">Pilih Kecamatan</option>
                  {daftarKecamatan.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.nama}
                    </option>
                  ))}
                </select>
              </div>

              <Field label="Kelurahan" name="kelurahan" value={form.kelurahan} onChange={handleChange} />

              <Field label="NPWP" name="npwp" value={form.npwp} onChange={handleChange} />

              <Field
                label="Kontak Pengurus"
                name="kontak_pengurus"
                value={form.kontak_pengurus}
                onChange={handleChange}
              />

              <Field label="Legalitas" name="legalitas" value={form.legalitas} onChange={handleChange} />

              <Field
                label="Status Akreditasi"
                name="status_akreditasi"
                value={form.status_akreditasi}
                onChange={handleChange}
              />

              <Field label="No Sertifikat" name="no_sertifikat" value={form.no_sertifikat} onChange={handleChange} />

              <Field
                type="date"
                label="Tanggal Akreditasi"
                name="tanggal_akreditasi"
                value={form.tanggal_akreditasi}
                onChange={handleChange}
              />

              <Field label="Akta Pendirian" name="akta_pendirian" value={form.akta_pendirian} onChange={handleChange} />

              <Field
                label="Izin Operasional"
                name="izin_operasional"
                value={form.izin_operasional}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* ================= PETA ================= */}
          <section>
            <SectionHeader icon={MapPinIcon} title="Lokasi LKS" color="red" />

            <MapContainer
              center={position}
              zoom={13}
              className="h-72 rounded-xl border shadow"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker
                position={position}
                setPosition={setPosition}
                setForm={setForm}
              />
            </MapContainer>

            <p className="text-sm mt-2">
              Koordinat: <b>{form.koordinat || "Belum dipilih"}</b>
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
            <SectionHeader
              icon={WrenchIcon}
              title="Sarana & Prasarana"
              color="green"
            />

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

          {/* ================= DOKUMEN ================= */}
          <section>
            <SectionHeader
              icon={PaperClipIcon}
              title="Dokumen Pendukung"
              color="gray"
            />

            {existingDocs.length > 0 && (
              <ul className="list-disc pl-5 text-sm text-gray-600 mb-3">
                {existingDocs.map((doc, i) => (
                  <li key={i}>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {doc.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}

            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="mt-1"
            />

            <p className="text-xs text-gray-500">Upload PDF / JPG / PNG</p>
          </section>

          {/* ================= SAVE BUTTON ================= */}
          <div className="text-right">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </LKSLayout>
  );
};

export default LKSProfile;
