import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import LKSLayout from "../../components/LKSLayout";
import {
  Printer,
  Pencil,
  MapPin,
  UserCircle2,
  CheckCircle2,
  XCircle,
  Building2,
  Users2,
  Wrench,
  ClipboardList,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

const LKSProfileView = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const role = sessionStorage.getItem("role") || "Tidak diketahui";
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const namaAkun = user.name || "Pengguna LKS";
  const username = user.username || "-";

  useEffect(() => {
    API.get("/lks/profile-view")
      .then((res) => setData(res.data.data))
      .catch(() => alert("Gagal memuat data LKS"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <LKSLayout>
        <div className="p-10 text-center text-gray-600 text-lg animate-pulse">
          Memuat data profil...
        </div>
      </LKSLayout>
    );
  }

  if (!data) {
    return (
      <LKSLayout>
        <div className="p-10 text-center text-red-600 font-medium">
          Data profil LKS tidak ditemukan.
        </div>
      </LKSLayout>
    );
  }

  // --- Posisi peta ---
  let position = null;
  if (data.koordinat && data.koordinat.includes(",")) {
    const [lat, lng] = data.koordinat.split(",").map(Number);
    position = [lat, lng];
  }

  const display = (v) => v || "Belum diisi";

  const statusBadge =
    data.status === "aktif" ? (
      <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
        <CheckCircle2 size={14} /> AKTIF
      </span>
    ) : (
      <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
        <XCircle size={14} /> NONAKTIF
      </span>
    );

  return (
    <LKSLayout>
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* ======= HEADER ======= */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative">
          <div className="bg-white/20 p-3 rounded-full">
            <UserCircle2 className="w-20 h-20 text-white" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-3xl font-bold mb-1">{namaAkun}</h2>
            <p className="text-sm text-blue-100">
              Username: <span className="font-medium">{username}</span>
            </p>
            <p className="text-sm text-blue-100">
              Role: <span className="font-medium">{role.toUpperCase()}</span>
            </p>
          </div>

          <div className="absolute top-6 right-6">{statusBadge}</div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
            <button
              onClick={() => navigate("/lks/profile/edit")}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-blue-700 font-medium text-sm rounded-lg shadow hover:bg-blue-50 transition"
            >
              <Pencil size={16} /> Edit Profil
            </button>
            <a
              href={`${import.meta.env.VITE_API_BASE_URL}/lks/${data.id}/cetak-profil`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium text-sm rounded-lg shadow transition"
            >
              <Printer size={16} /> Cetak Profil (PDF)
            </a>
          </div>
        </div>

        {/* ======= KONTEN PROFIL ======= */}
        <div className="p-8 sm:p-10 space-y-12">
          {/* 📄 PROFIL UMUM */}
          <Section title="Profil Umum" icon={<Building2 className="text-blue-600 w-5 h-5" />}>
            <Grid>
              <Info label="1. Nama LKS" value={display(data.nama)} />
              <Info label="2. Jenis Layanan" value={display(data.jenis_layanan)} />
              <Info label="3. NPWP" value={display(data.npwp)} />
              <Info label="4. Akta Pendirian" value={display(data.akta_pendirian)} />
              <Info label="5. Legalitas" value={display(data.legalitas)} />
              <Info label="6. Izin Operasional" value={display(data.izin_operasional)} />
              <Info label="7. Status Akreditasi" value={display(data.status_akreditasi)} />
              <Info label="8. Tanggal Akreditasi" value={display(data.tanggal_akreditasi)} />
              <Info label="9. No Sertifikat" value={display(data.no_sertifikat)} />
            </Grid>
          </Section>

          {/* 📍 LOKASI */}
          <Section title="Lokasi LKS" icon={<MapPin className="text-red-600 w-5 h-5" />}>
            <Grid>
              <Info label="10. Kecamatan" value={display(data.kecamatan?.nama)} />
              <Info label="11. Kelurahan / Desa" value={display(data.kelurahan)} />
              <Info label="12. Alamat Lengkap" value={display(data.alamat)} />
              <Info label="13. Koordinat" value={display(data.koordinat)} />
            </Grid>

            {position && (
              <div className="mt-6 rounded-3xl border border-blue-100 shadow-lg overflow-hidden">
                <MapContainer center={position} zoom={14} scrollWheelZoom className="h-[400px] w-full">
                  <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
                  <Marker position={position} icon={markerIcon}>
                    <Popup>
                      <strong>{data.nama}</strong>
                      <br />
                      {data.alamat || "Alamat tidak tersedia"}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}
          </Section>

          {/* 👥 PENGURUS */}
          <Section title="Pengurus" icon={<Users2 className="text-purple-600 w-5 h-5" />}>
            <Grid>
              <Info label="14. Jumlah Pengurus" value={display(data.jumlah_pengurus)} />
              <Info label="15. Kontak Pengurus" value={display(data.kontak_pengurus)} />
            </Grid>
          </Section>

          {/* 🧱 SARANA */}
          <Section title="Sarana & Fasilitas" icon={<Wrench className="text-green-600 w-5 h-5" />}>
            <Grid>
              <Info label="16. Sarana & Fasilitas" value={display(data.sarana)} />
            </Grid>
          </Section>

          {/* 📊 MONITORING */}
          <Section title="Monitoring" icon={<ClipboardList className="text-pink-600 w-5 h-5" />}>
            <Grid>
              <Info label="17. Hasil Observasi" value={display(data.hasil_observasi)} />
              <Info label="18. Tindak Lanjut" value={display(data.tindak_lanjut)} />
            </Grid>
          </Section>
        </div>
      </div>
    </LKSLayout>
  );
};

// 🔹 Subkomponen Reusable
const Section = ({ title, icon, children }) => (
  <section className="space-y-4">
    <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
      {icon}
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    {children}
  </section>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{children}</div>
);

const Info = ({ label, value }) => (
  <div className="bg-gray-50 hover:bg-blue-50 transition border border-gray-200 rounded-xl p-4 shadow-sm">
    <p className="text-xs font-semibold text-gray-500 mb-1 uppercase">{label}</p>
    <p className="text-sm font-medium text-gray-800 leading-snug">{value}</p>
  </div>
);

export default LKSProfileView;
