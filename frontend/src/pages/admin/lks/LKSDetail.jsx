import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../../components/AdminLayout";
import API from "../../../utils/api";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  ArrowLeftIcon,
  PrinterIcon,
  BuildingOffice2Icon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import VerificationBadge from "../../../components/shared/VerificationBadge";
import {
  showSuccess,
  showError,
  showInfo,
} from "../../../utils/toast"; // ✅ Import sistem toast kamu

// Marker Custom
const markerIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/854/854878.png", // marker biru lembut
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

const LKSDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lks, setLks] = useState(null);

  // 🔹 Ambil data LKS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`/lks/${id}`);
        setLks(res.data.data);
        showSuccess("Data LKS berhasil dimuat");
      } catch (err) {
        console.error("Gagal mengambil data:", err);
        showError("Gagal mengambil data LKS");
        navigate("/admin/lks");
      }
    };
    fetchData();
  }, [id, navigate]);

  // 🔹 Cetak PDF
  const printPDF = () => {
    showInfo("Membuka tampilan cetak PDF...");
    window.open(
      `${import.meta.env.VITE_API_BASE_URL}/lks/${id}/cetak-profil`,
      "_blank"
    );
  };

  if (!lks) return null;

  const display = (v) => v || "Belum diisi";
  const verif = lks.verifikasi_terbaru;

  const infoList = [
    { label: "Nama LKS", value: lks.nama },
    { label: "Akta Pendirian", value: lks.akta_pendirian },
    { label: "Jenis Layanan", value: lks.jenis_layanan },
    { label: "No Akta", value: lks.no_akta },
    { label: "Kecamatan", value: lks.kecamatan?.nama },
    { label: "Izin Operasional", value: lks.izin_operasional },
    { label: "Kelurahan / Desa", value: lks.kelurahan },
    { label: "Legalitas", value: lks.legalitas },
    { label: "Status", value: lks.status },
    { label: "Akreditasi", value: lks.status_akreditasi },
    { label: "Alamat", value: lks.alamat },
    { label: "No Sertifikat", value: lks.no_sertifikat },
    { label: "Koordinat", value: lks.koordinat },
    { label: "Tanggal Akreditasi", value: lks.tanggal_akreditasi },
    { label: "NPWP", value: lks.npwp },
    { label: "Sarana & Fasilitas", value: lks.sarana },
    { label: "Kontak Pengurus", value: lks.kontak_pengurus },
    { label: "Hasil Observasi", value: lks.hasil_observasi },
    { label: "Jumlah Pengurus", value: lks.jumlah_pengurus },
    { label: "Tindak Lanjut", value: lks.tindak_lanjut },
  ];

  let position = null;
  if (lks.koordinat && lks.koordinat.includes(",")) {
    const [lat, lng] = lks.koordinat.split(",").map(Number);
    position = [lat, lng];
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-2xl shadow-2xl rounded-3xl p-6 sm:p-10 border border-gray-100 transition-all duration-300">
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
                Data hasil inputan SIDALEKAS
              </p>
              {verif && (
                <div className="mt-3">
                  <span className="text-xs mr-2 text-gray-500">
                    Status Verifikasi:
                  </span>
                  <VerificationBadge status={verif.status} />
                </div>
              )}
            </div>
          </div>
          <div className="hidden print:block text-sm text-gray-400">
            Dicetak: {new Date().toLocaleDateString("id-ID")}
          </div>
        </div>

        {/* Detail Grid */}
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

          {/* Lokasi Peta */}
          {position && (
            <div className="sm:col-span-2 bg-gradient-to-tr from-gray-50 to-white rounded-2xl border border-gray-100 shadow-lg p-5 hover:shadow-xl transition-all duration-300">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                21. Lokasi LKS
                <MapPinIcon className="w-4 h-4 text-blue-500" />
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
                        {lks.nama}
                      </div>
                      <div className="text-xs text-gray-500">
                        {lks.alamat || "Alamat tidak tersedia"}
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
                <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-blue-300/30"></div>
              </div>
            </div>
          )}
        </div>

        {/* Tombol Aksi */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-12 gap-4 print:hidden">
          <button
            onClick={() => {
              showInfo("Kembali ke daftar LKS");
              navigate("/admin/lks");
            }}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Kembali ke Daftar
          </button>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={printPDF}
              className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-all"
            >
              <PrinterIcon className="h-4 w-4" /> Cetak Profil (PDF)
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default LKSDetail;
