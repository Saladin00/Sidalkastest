// src/pages/admin/lks/tabs/TabLokasi.jsx
import React, { useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: -6.914864, // Bandung
  lng: 107.608238,
};

const TabLokasi = ({ form, setForm }) => {
  const [marker, setMarker] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>🗺️ Memuat peta...</div>;

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const koordinat = `${lat.toFixed(6)},${lng.toFixed(6)}`;
    setForm({ ...form, koordinat });
    setMarker({ lat, lng });
  };

  const center = marker || defaultCenter;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-700">
        📍 Pilih Lokasi LKS di Peta
      </h3>

      <div className="rounded-lg overflow-hidden border shadow">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          onClick={handleMapClick}
        >
          {marker && <Marker position={marker} />}
        </GoogleMap>
      </div>

      {form.koordinat && (
        <p className="mt-3 text-sm text-gray-700">
          Koordinat dipilih: <strong>{form.koordinat}</strong>
        </p>
      )}
    </div>
  );
};

export default TabLokasi;
