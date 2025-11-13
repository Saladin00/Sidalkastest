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
} from "@heroicons/react/24/outline";
import VerificationBadge from "../../../components/shared/VerificationBadge"; // ⬅️ pastikan path sesuai struktur proyekmu

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

        // FIX: Ambil data dari response dengan benar
        setLks(res.data.data);
      } catch (err) {
        console.error("gagal Mengambil data", err);
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

  const verif = lks.verifikasi_terbaru; // ⬅️ tambahkan relasi dari backend

  let position = null;
  if (koordinat && koordinat.includes(",")) {
    const [lat, lng] = koordinat.split(",").map(Number);
    position = [lat, lng];
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-10">
        {/* Header dengan badge verifikasi */}
        <div className="flex justify-between items-start border-b border-gray-300 pb-4 mb-8">
          <div className="flex items-center gap-3">
            <BuildingOffice2Icon className="h-7 w-7 text-blue-700" />
            <div>
              <h1 className="text-2xl font-bold text-blue-800">
                Profil Lembaga Kesejahteraan Sosial
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Data hasil inputan SIDALEKAS
              </p>
              {/* Badge status verifikasi */}
              {verif && (
                <div className="mt-2">
                  <span className="text-xs mr-2 text-gray-500">
                    Status Verifikasi:
                  </span>
                  <span className="align-middle">
                    <VerificationBadge status={verif.status} />
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="hidden print:block text-right text-sm text-gray-500">
            Dicetak pada: {new Date().toLocaleDateString("id-ID")}
          </div>
        </div>

        {/* Detail informasi LKS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 text-sm">
          <p>
            <strong>Nama LKS:</strong> {display(nama)}
          </p>
          <p>
            <strong>Akta Pendirian:</strong> {display(akta_pendirian)}
          </p>
          <p>
            <strong>Jenis Layanan:</strong> {display(jenis_layanan)}
          </p>
          <p>
            <strong>No Akta:</strong> {display(no_akta)}
          </p>
          <p>
            <strong>Kecamatan:</strong> {display(kecamatan?.nama)}
          </p>

          <p>
            <strong>Izin Operasional:</strong> {display(izin_operasional)}
          </p>
          <p>
            <strong>Kelurahan / Desa:</strong> {display(kelurahan)}
          </p>
          <p>
            <strong>Legalitas:</strong> {display(legalitas)}
          </p>
          <p>
            <strong>Status:</strong> {display(status)}
          </p>
          <p>
            <strong>Akreditasi:</strong> {display(status_akreditasi)}
          </p>
          <p>
            <strong>Alamat:</strong> {display(alamat)}
          </p>
          <p>
            <strong>No Sertifikat:</strong> {display(no_sertifikat)}
          </p>
          <p>
            <strong>Koordinat:</strong> {display(koordinat)}
          </p>
          <p>
            <strong>Tanggal Akreditasi:</strong> {display(tanggal_akreditasi)}
          </p>
          <p>
            <strong>NPWP:</strong> {display(npwp)}
          </p>
          <p>
            <strong>Sarana & Fasilitas:</strong> {display(sarana)}
          </p>
          <p>
            <strong>Kontak Pengurus:</strong> {display(kontak_pengurus)}
          </p>
          <p>
            <strong>Hasil Observasi:</strong> {display(hasil_observasi)}
          </p>
          <p>
            <strong>Jumlah Pengurus:</strong> {display(jumlah_pengurus)}
          </p>
          <p>
            <strong>Tindak Lanjut:</strong> {display(tindak_lanjut)}
          </p>
        </div>

        {/* Peta lokasi */}
        {position && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-2">Lokasi Peta</h2>
            <MapContainer
              center={position}
              zoom={13}
              className="h-72 rounded-lg z-0"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={position} icon={markerIcon} />
            </MapContainer>
          </div>
        )}

        {/* Tombol aksi */}
        <div className="flex justify-between items-center mt-10 print:hidden">
          <button
            onClick={() => navigate("/admin/lks")}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Kembali ke Daftar LKS
          </button>

          <div className="flex gap-2">
            {lks.verifikasi_terbaru && lks.verifikasi_terbaru.id ? (
              <button
                onClick={() =>
                  navigate(`/admin/verifikasi/${lks.verifikasi_terbaru.id}`)
                }
                className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Lihat / Review Verifikasi
              </button>
            ) : (
              <p className="text-gray-500 text-sm italic">
                Belum ada data verifikasi.
              </p>
            )}

            <button
              onClick={printPDF}
              className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md"
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
