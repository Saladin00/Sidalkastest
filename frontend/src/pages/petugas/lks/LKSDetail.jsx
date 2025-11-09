import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../utils/api";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  ArrowLeftIcon,
  MapPinIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import VerificationBadge from "../../../components/shared/VerificationBadge"; // ⬅️ pastikan path sesuai struktur proyekmu

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function LKSPetugasDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lks, setLks] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get(`/lks/${id}`);
        setLks(res.data);
      } catch (err) {
        alert("Gagal memuat data LKS");
        navigate("/petugas/lks");
      }
    };
    load();
  }, [id, navigate]);

  const display = (v) => v || "-";

  if (!lks)
    return (
      <div className="p-6 text-center text-gray-500">Memuat data...</div>
    );

  const verif = lks.verifikasi_terbaru; // ⬅️ ambil relasi dari backend

  let position = null;
  if (lks.koordinat && lks.koordinat.includes(",")) {
    const [lat, lng] = lks.koordinat.split(",").map(Number);
    position = [lat, lng];
  }

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-sm border border-gray-200 rounded-2xl p-8 md:p-10">
      {/* Header */}
      <div className="border-b pb-4 mb-6">
        <h1 className="text-xl font-bold text-blue-700">Detail LKS</h1>
        {/* Badge status verifikasi */}
        {verif && (
          <div className="mt-2">
            <span className="text-xs mr-2 text-gray-500">
              Status Verifikasi:
            </span>
            <VerificationBadge status={verif.status} />
          </div>
        )}
      </div>

      {/* Profil Umum */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <ClipboardDocumentListIcon className="h-5 w-5 text-blue-700" />
          <h2 className="font-semibold text-blue-700">Profil Umum</h2>
        </div>
        <div className="border-l-4 border-blue-200 pl-4 grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm">
          <p>
            <strong>Nama LKS:</strong> {display(lks.nama)}
          </p>
          <p>
            <strong>Jenis Layanan:</strong> {display(lks.jenis_layanan)}
          </p>
          <p>
            <strong>Alamat:</strong> {display(lks.alamat)}
          </p>
          <p>
            <strong>Kecamatan:</strong> {display(lks.kecamatan)}
          </p>
          <p>
            <strong>Koordinat:</strong> {display(lks.koordinat)}
          </p>
        </div>
      </section>

      {/* Peta Lokasi */}
      {position && (
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <MapPinIcon className="h-5 w-5 text-blue-700" />
            <h2 className="font-semibold text-blue-700">Peta Lokasi</h2>
          </div>
          <MapContainer
            center={position}
            zoom={13}
            className="h-64 rounded-md border"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={position} icon={markerIcon} />
          </MapContainer>
        </section>
      )}

      {/* Tombol Aksi Dinamis */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => navigate("/petugas/lks")}
          className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md"
        >
          <ArrowLeftIcon className="h-4 w-4" /> Kembali
        </button>

        {!verif ? (
          <button
            onClick={() => navigate(`/petugas/verifikasi/${id}/form`)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Verifikasi Lapangan
          </button>
        ) : (
          <button
            onClick={() => navigate(`/petugas/verifikasi/${verif.id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Lihat Hasil Verifikasi
          </button>
        )}
      </div>
    </div>
  );
}
