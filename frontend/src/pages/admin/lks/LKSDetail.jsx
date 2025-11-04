import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../../components/AdminLayout";
import API from "../../../utils/api";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ArrowLeftIcon, PrinterIcon } from "@heroicons/react/24/outline";

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

  let position = null;
  if (koordinat && koordinat.includes(",")) {
    const [lat, lng] = koordinat.split(",").map(Number);
    position = [lat, lng];
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-10">
        <h1 className="text-2xl font-bold text-blue-800 flex items-center gap-2 mb-1">
          <span>📄</span> Profil Lembaga Kesejahteraan Sosial
        </h1>
        <p className="text-gray-500 mb-8">Data lengkap hasil inputan SIDALEKAS</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 text-sm">
          <p><strong>Nama LKS:</strong> {display(nama)}</p>
          <p><strong>Akta Pendirian:</strong> {display(akta_pendirian)}</p>
          <p><strong>Jenis Layanan:</strong> {display(jenis_layanan)}</p>
          <p><strong>No Akta:</strong> {display(no_akta)}</p>
          <p><strong>Kecamatan:</strong> {display(kecamatan)}</p>
          <p><strong>Izin Operasional:</strong> {display(izin_operasional)}</p>
          <p><strong>Kelurahan / Desa:</strong> {display(kelurahan)}</p>
          <p><strong>Legalitas:</strong> {display(legalitas)}</p>
          <p><strong>Status:</strong> {display(status)}</p>
          <p><strong>Akreditasi:</strong> {display(status_akreditasi)}</p>
          <p><strong>Alamat:</strong> {display(alamat)}</p>
          <p><strong>No Sertifikat:</strong> {display(no_sertifikat)}</p>
          <p><strong>Koordinat:</strong> {display(koordinat)}</p>
          <p><strong>Tanggal Akreditasi:</strong> {display(tanggal_akreditasi)}</p>
          <p><strong>NPWP:</strong> {display(npwp)}</p>
          <p><strong>Sarana & Fasilitas:</strong> {display(sarana)}</p>
          <p><strong>Kontak Pengurus:</strong> {display(kontak_pengurus)}</p>
          <p><strong>Hasil Observasi:</strong> {display(hasil_observasi)}</p>
          <p><strong>Jumlah Pengurus:</strong> {display(jumlah_pengurus)}</p>
          <p><strong>Tindak Lanjut:</strong> {display(tindak_lanjut)}</p>
        </div>

        {position && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-2">Lokasi Peta</h2>
            <MapContainer center={position} zoom={13} className="h-72 rounded-lg z-0">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={position} icon={markerIcon} />
            </MapContainer>
          </div>
        )}

        <div className="flex justify-between items-center mt-10">
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
