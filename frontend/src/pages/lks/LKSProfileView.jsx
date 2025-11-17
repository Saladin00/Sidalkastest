import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import LKSLayout from "../../components/LKSLayout";
import { Printer, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Marker icon
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LKSProfileView = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const role = sessionStorage.getItem("role");

  useEffect(() => {
    API.get("/lks/profile-view")
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        console.error("ERROR:", err);
        alert("Gagal memuat data LKS");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <LKSLayout>
        <div className="p-5 text-center">Memuat data...</div>
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

  /** SAFE PARSE KOORDINAT */
  let mapPosition = [-6.3264, 108.32]; // fallback default
  if (data.koordinat) {
    const [lat, lng] = data.koordinat.split(",").map(Number);
    if (!isNaN(lat) && !isNaN(lng)) {
      mapPosition = [lat, lng];
    }
  }

  return (
    <LKSLayout>
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md border">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Detail Profil LKS</h1>

          <div className="flex items-center gap-3">

            {/* 🔵 EDIT */}
            {(role === "admin" || role === "lks") && (
              <button
                onClick={() => navigate("/lks/profile/edit")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow flex items-center gap-2 hover:bg-blue-700"
              >
                <Pencil size={18} /> Edit Profil
              </button>
            )}

            {/* 🔴 CETAK PDF */}
            <a
              href={`http://localhost:8000/api/lks/${data.id}/cetak-pdf`}
              target="_blank"
              rel="noopener"
              className="px-4 py-2 bg-red-600 text-white rounded-lg shadow flex items-center gap-2 hover:bg-red-700"
            >
              <Printer size={18} /> Cetak PDF
            </a>
          </div>
        </div>

        {/* ======================================= */}
        {/*               DATA DETAIL               */}
        {/* ======================================= */}
        <div className="space-y-6">

          {/* PROFIL UMUM */}
          <section>
            <h2 className="text-lg font-semibold text-blue-700 mb-2">Profil Umum</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><b>Nama LKS:</b> {data.nama || "-"}</p>
              <p><b>Jenis Layanan:</b> {data.jenis_layanan || "-"}</p>
              <p><b>Kecamatan:</b> {data.kecamatan?.nama || "-"}</p>
              <p><b>Kelurahan:</b> {data.kelurahan || "-"}</p>

              <p className="col-span-2">
                <b>Alamat:</b> {data.alamat || "-"}
              </p>
            </div>
          </section>

          {/* LEGALITAS */}
          <section>
            <h2 className="text-lg font-semibold text-green-700 mb-2">
              Legalitas & Akreditasi
            </h2>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><b>Legalitas:</b> {data.legalitas || "-"}</p>
              <p><b>Akta Pendirian:</b> {data.akta_pendirian || "-"}</p>
              <p><b>Izin Operasional:</b> {data.izin_operasional || "-"}</p>
              <p><b>Status Akreditasi:</b> {data.status_akreditasi || "-"}</p>
              <p><b>No Sertifikat:</b> {data.no_sertifikat || "-"}</p>
              <p><b>Tanggal Akreditasi:</b> {data.tanggal_akreditasi || "-"}</p>
            </div>
          </section>

          {/* PENGURUS */}
          <section>
            <h2 className="text-lg font-semibold text-purple-700 mb-2">
              Pengurus
            </h2>
            <p className="text-sm">
              <b>Jumlah Pengurus:</b> {data.jumlah_pengurus || "-"}
            </p>
          </section>

          {/* SARANA */}
          <section>
            <h2 className="text-lg font-semibold text-orange-700 mb-2">
              Sarana & Prasarana
            </h2>
            <p className="text-sm whitespace-pre-wrap">
              {data.sarana || "-"}
            </p>
          </section>

          {/* MONITORING */}
          <section>
            <h2 className="text-lg font-semibold text-pink-700 mb-2">Monitoring</h2>
            <p className="text-sm whitespace-pre-wrap">
              <b>Hasil Observasi:</b><br />
              {data.hasil_observasi || "-"}
            </p>

            <p className="text-sm whitespace-pre-wrap mt-3">
              <b>Tindak Lanjut:</b><br />
              {data.tindak_lanjut || "-"}
            </p>
          </section>

          {/* LOKASI */}
          <section>
            <h2 className="text-lg font-semibold text-red-700 mb-2">Lokasi LKS</h2>

            <div className="h-72 rounded-lg overflow-hidden shadow border">
              <MapContainer
                center={mapPosition}
                zoom={15}
                scrollWheelZoom={false}
                dragging={false}
                doubleClickZoom={false}
                className="h-full w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={mapPosition} icon={markerIcon} />
              </MapContainer>
            </div>

            <p className="text-sm text-gray-700 mt-2">
              <b>Koordinat:</b> {data.koordinat || "-"}
            </p>
          </section>
        </div>
      </div>
    </LKSLayout>
  );
};

export default LKSProfileView;
