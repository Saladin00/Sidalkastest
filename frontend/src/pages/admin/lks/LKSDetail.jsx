import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../../components/AdminLayout";
import API from "../../../utils/api";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  ArrowLeftIcon,
  PrinterIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  IdentificationIcon,
  PhoneIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import VerificationBadge from "../../../components/shared/VerificationBadge";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LKSDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lks, setLks] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`/lks/${id}`);
        setLks(res.data.data);
      } catch (err) {
        console.error("Gagal Mengambil data", err);
        alert("Gagal mengambil data");
        navigate("/admin/lks");
      }
    };
    fetchData();
  }, [id, navigate]);

  const printPDF = () => {
    window.open(
      `${import.meta.env.VITE_API_BASE_URL}/lks/${id}/cetak-profil`,
      "_blank"
    );
  };

  const display = (value) => value || "Belum diisi";
  if (!lks) return null;

  const {
    nama,
    jenis_layanan,
    kecamatan,
    kelurahan,
    status,
    alamat,
    koordinat,
    npwp,
    kontak_pengurus,
    jumlah_pengurus,
    akta_pendirian,
    izin_operasional,
    legalitas,
    no_akta,
    status_akreditasi,
    no_sertifikat,
    tanggal_akreditasi,
    sarana,
    hasil_observasi,
    tindak_lanjut,
  } = lks;

  const verif = lks.verifikasi_terbaru;

  let position = null;
  if (koordinat && koordinat.includes(",")) {
    const [lat, lng] = koordinat.split(",").map(Number);
    position = [lat, lng];
  }

  const infoList = [
    { label: "Nama LKS", value: nama, icon: BuildingOffice2Icon },
    { label: "Akta Pendirian", value: akta_pendirian, icon: ClipboardDocumentListIcon },
    { label: "Jenis Layanan", value: jenis_layanan, icon: ClipboardDocumentListIcon },
    { label: "No Akta", value: no_akta, icon: IdentificationIcon },
    { label: "Kecamatan", value: kecamatan?.nama, icon: MapPinIcon },
    { label: "Izin Operasional", value: izin_operasional, icon: ClipboardDocumentListIcon },
    { label: "Kelurahan / Desa", value: kelurahan, icon: MapPinIcon },
    { label: "Legalitas", value: legalitas, icon: ClipboardDocumentListIcon },
    { label: "Status", value: status, icon: IdentificationIcon },
    { label: "Akreditasi", value: status_akreditasi, icon: ClipboardDocumentListIcon },
    { label: "Alamat", value: alamat, icon: MapPinIcon },
    { label: "No Sertifikat", value: no_sertifikat, icon: IdentificationIcon },
    { label: "Koordinat", value: koordinat, icon: MapPinIcon },
    { label: "Tanggal Akreditasi", value: tanggal_akreditasi, icon: ClipboardDocumentListIcon },
    { label: "NPWP", value: npwp, icon: IdentificationIcon },
    { label: "Sarana & Fasilitas", value: sarana, icon: ClipboardDocumentListIcon },
    { label: "Kontak Pengurus", value: kontak_pengurus, icon: PhoneIcon },
    { label: "Hasil Observasi", value: hasil_observasi, icon: ClipboardDocumentListIcon },
    { label: "Jumlah Pengurus", value: jumlah_pengurus, icon: IdentificationIcon },
    { label: "Tindak Lanjut", value: tindak_lanjut, icon: ClipboardDocumentListIcon },
  ];

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-100">

        {/* Header */}
        <div className="flex justify-between items-start border-b pb-5 mb-8">
          <div className="flex items-center gap-3">
            <BuildingOffice2Icon className="h-8 w-8 text-blue-700" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Profil Lembaga Kesejahteraan Sosial
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Data hasil inputan SIDALEKAS
              </p>

              {verif && (
                <div className="mt-2">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {infoList.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <span className="text-sm font-semibold text-gray-400 w-6 shrink-0">
                {index + 1}.
              </span>

              <item.icon className="h-5 w-5 text-blue-600 mt-0.5" />

              <div>
                <p className="text-xs uppercase text-gray-500 tracking-wide">
                  {item.label}
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {display(item.value)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Map */}
        {position && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <MapPinIcon className="h-5 w-5 text-blue-700" />
              Lokasi LKS
            </h2>

            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <MapContainer
                center={position}
                zoom={13}
                className="h-72 w-full z-0"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={position} icon={markerIcon} />
              </MapContainer>
            </div>
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="flex justify-between items-center mt-10 print:hidden">
          <button
            onClick={() => navigate("/admin/lks")}
            className="flex items-center gap-2 px-5 py-2.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Kembali ke Daftar
          </button>

          <div className="flex gap-2">
            {lks.verifikasi_terbaru && lks.verifikasi_terbaru.id ? (
              <button
                onClick={() =>
                  navigate(`/admin/verifikasi/${lks.verifikasi_terbaru.id}`)
                }
                className="flex items-center gap-2 px-5 py-2.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              >
                Review Verifikasi
              </button>
            ) : (
              <p className="text-gray-500 text-sm italic">
                Belum ada data verifikasi.
              </p>
            )}

            <button
              onClick={printPDF}
              className="flex items-center gap-2 px-5 py-2.5 text-sm text-white bg-green-600 hover:bg-green-700 rounded-lg transition"
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
