import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../../components/AdminLayout";
import API from "../../../utils/api";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ArrowLeftIcon, PrinterIcon, MapPinIcon, BuildingOffice2Icon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";

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
        setLks(res.data);
      } catch (err) {
        alert("Gagal mengambil data");
        navigate("/admin/lks");
      }
    };
    fetchData();
  }, [id, navigate]);

  const printPDF = () => {
    window.open(`${import.meta.env.VITE_API_BASE_URL}/lks/${id}/cetak-profil`, "_blank");
  };

  const display = (value) => value || "-";

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

  let position = null;
  if (koordinat && koordinat.includes(",")) {
    const [lat, lng] = koordinat.split(",").map(Number);
    position = [lat, lng];
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto bg-white shadow-sm border border-gray-200 rounded-2xl p-8 md:p-12 font-sans text-gray-800 print:shadow-none print:border-none print:p-0">

        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-300 pb-4 mb-8">
          <div className="flex items-center gap-2">
            <BuildingOffice2Icon className="h-7 w-7 text-blue-700" />
            <div>
              <h1 className="text-2xl font-bold text-blue-800">Profil Lembaga Kesejahteraan Sosial</h1>
              <p className="text-sm text-gray-500 mt-1">Data hasil inputan SIDALEKAS</p>
            </div>
          </div>
          <div className="hidden print:block text-right text-sm text-gray-500">
            Dicetak pada: {new Date().toLocaleDateString("id-ID")}
          </div>
        </div>

        {/* Profil Section */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardDocumentListIcon className="h-5 w-5 text-blue-700" />
            <h2 className="text-lg font-semibold text-blue-700">Profil Umum</h2>
          </div>
          <div className="border-l-4 border-blue-200 pl-4 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 text-sm leading-relaxed">
            <p><strong>Nama LKS:</strong> {display(nama)}</p>
            <p><strong>Status:</strong> {display(status)}</p>
            <p><strong>Jenis Layanan:</strong> {display(jenis_layanan)}</p>
            <p><strong>Alamat:</strong> {display(alamat)}</p>
            <p><strong>Kecamatan:</strong> {display(kecamatan)}</p>
            <p><strong>Kelurahan / Desa:</strong> {display(kelurahan)}</p>
            <p><strong>Koordinat:</strong> {display(koordinat)}</p>
            <p><strong>NPWP:</strong> {display(npwp)}</p>
            <p><strong>Kontak Pengurus:</strong> {display(kontak_pengurus)}</p>
            <p><strong>Jumlah Pengurus:</strong> {display(jumlah_pengurus)}</p>
          </div>
        </section>

        {/* Pembatas */}
        <hr className="border-t border-gray-300 my-8" />

        {/* Legalitas Section */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardDocumentListIcon className="h-5 w-5 text-blue-700" />
            <h2 className="text-lg font-semibold text-blue-700">Legalitas & Akreditasi</h2>
          </div>
          <div className="border-l-4 border-blue-200 pl-4 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 text-sm leading-relaxed">
            <p><strong>Akta Pendirian:</strong> {display(akta_pendirian)}</p>
            <p><strong>No Akta:</strong> {display(no_akta)}</p>
            <p><strong>Izin Operasional:</strong> {display(izin_operasional)}</p>
            <p><strong>Legalitas:</strong> {display(legalitas)}</p>
            <p><strong>Akreditasi:</strong> {display(status_akreditasi)}</p>
            <p><strong>No Sertifikat:</strong> {display(no_sertifikat)}</p>
            <p><strong>Tanggal Akreditasi:</strong> {display(tanggal_akreditasi)}</p>
          </div>
        </section>

        {/* Pembatas */}
        <hr className="border-t border-gray-300 my-8" />

        {/* Sarana & Observasi Section */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardDocumentListIcon className="h-5 w-5 text-blue-700" />
            <h2 className="text-lg font-semibold text-blue-700">Sarana & Monitoring</h2>
          </div>
          <div className="border-l-4 border-blue-200 pl-4 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 text-sm leading-relaxed">
            <p><strong>Sarana & Fasilitas:</strong> {display(sarana)}</p>
            <p><strong>Hasil Observasi:</strong> {display(hasil_observasi)}</p>
            <p><strong>Tindak Lanjut:</strong> {display(tindak_lanjut)}</p>
          </div>
        </section>

        {/* Pembatas */}
        <hr className="border-t border-gray-300 my-8" />

        {/* Map Section */}
        {position && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <MapPinIcon className="h-5 w-5 text-blue-700" />
              <h2 className="text-lg font-semibold text-blue-700">Lokasi Peta</h2>
            </div>
            <MapContainer
              center={position}
              zoom={13}
              className="h-72 rounded-lg border border-gray-300 print:hidden"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={position} icon={markerIcon} />
            </MapContainer>
          </section>
        )}

        {/* Buttons */}
        <div className="flex justify-between items-center mt-10 print:hidden">
          <button
            onClick={() => navigate("/admin/lks")}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Kembali ke Daftar LKS
          </button>
          <button
            onClick={printPDF}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md"
          >
            <PrinterIcon className="h-4 w-4" /> Cetak Profil (PDF)
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default LKSDetail;
