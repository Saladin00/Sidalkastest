import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import LKSLayout from "../../components/LKSLayout";
import { Printer, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BuildingOffice2Icon } from "@heroicons/react/24/outline";

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

const LKSProfileView = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const role = sessionStorage.getItem("role");

  useEffect(() => {
    API.get("/lks/profile-view")
      .then((res) => setData(res.data.data))
      .catch((err) => {
        console.error("ERROR:", err);
        alert("Gagal memuat data LKS");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <LKSLayout>
        <div className="p-5 text-center text-gray-600">Memuat data...</div>
      </LKSLayout>
    );
  }

  if (!data) {
    return (
      <LKSLayout>
        <div className="p-5 text-center text-red-600">
          Data LKS tidak ditemukan
        </div>
      </LKSLayout>
    );
  }

  // --- Map Position ---
  let position = null;
  if (data.koordinat && data.koordinat.includes(",")) {
    const [lat, lng] = data.koordinat.split(",").map(Number);
    position = [lat, lng];
  }

  const display = (v) => v || "Belum diisi";

  const infoList = [
    { label: "Nama LKS", value: data.nama },
    { label: "Jenis Layanan", value: data.jenis_layanan },
    { label: "Akta Pendirian", value: data.akta_pendirian },
    { label: "Legalitas", value: data.legalitas },
    { label: "Izin Operasional", value: data.izin_operasional },
    { label: "Status Akreditasi", value: data.status_akreditasi },
    { label: "Tanggal Akreditasi", value: data.tanggal_akreditasi },
    { label: "No Sertifikat", value: data.no_sertifikat },
    { label: "NPWP", value: data.npwp },
    { label: "Kecamatan", value: data.kecamatan?.nama },
    { label: "Kelurahan / Desa", value: data.kelurahan },
    { label: "Alamat", value: data.alamat },
    { label: "Jumlah Pengurus", value: data.jumlah_pengurus },
    { label: "Sarana & Fasilitas", value: data.sarana },
    { label: "Hasil Observasi", value: data.hasil_observasi },
    { label: "Tindak Lanjut", value: data.tindak_lanjut },
  ];

  return (
    <LKSLayout>
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-2xl shadow-2xl rounded-3xl p-6 sm:p-10 border border-gray-100">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-6 mb-10 gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="p-3 bg-gradient-to-tr from-blue-100 to-indigo-100 rounded-2xl shadow-sm">
              <BuildingOffice2Icon className="h-9 w-9 text-blue-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Profil Lembaga Kesejahteraan Sosial
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Data hasil inputan oleh LKS
              </p>
            </div>
          </div>

          {/* Tombol kanan atas */}
          <div className="flex flex-col sm:flex-row gap-3">
            {(role === "admin" || role === "lks") && (
              <button
                onClick={() => navigate("/lks/profile/edit")}
                className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
              >
                <Pencil size={16} /> Edit Profil
              </button>
            )}
            <a
              href={`${
                import.meta.env.VITE_API_BASE_URL
              }/lks/${data.id}/cetak-profil`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-sm transition-all"
            >
              <Printer size={16} /> Cetak Profil (PDF)
            </a>
          </div>
        </div>

        {/* Grid Detail */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {infoList.map((item, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-gray-50 to-white hover:from-blue-50 hover:to-white transition-all duration-300 rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md"
            >
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                {i + 1}. {item.label}
              </p>
              <p className="text-[15px] font-medium text-gray-800 leading-snug">
                {display(item.value)}
              </p>
            </div>
          ))}

          {/* Map */}
          {position && (
            <div className="sm:col-span-2 bg-gradient-to-tr from-gray-50 to-white rounded-2xl border border-gray-100 shadow-lg p-5 hover:shadow-xl transition-all duration-300">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Lokasi LKS
              </h2>
              <div className="relative rounded-2xl overflow-hidden border border-blue-100 shadow-inner">
                <MapContainer
                  center={position}
                  zoom={14}
                  scrollWheelZoom={false}
                  className="h-80 w-full rounded-2xl z-0"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
                  <Marker position={position} icon={markerIcon}>
                    <Popup>
                      <div className="text-sm font-semibold text-gray-800">
                        {data.nama}
                      </div>
                      <div className="text-xs text-gray-500">
                        {data.alamat || "Alamat tidak tersedia"}
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </LKSLayout>
  );
};

export default LKSProfileView;
