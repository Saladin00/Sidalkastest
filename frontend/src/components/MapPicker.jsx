// src/components/MapPicker.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ✅ Atasi masalah marker bawaan tidak muncul
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const LocationMarker = ({ koordinat, setKoordinat }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setKoordinat(`${lat},${lng}`);
    },
  });

  if (!koordinat) return null;
  const [lat, lng] = koordinat.split(",").map(Number);

  return <Marker position={[lat, lng]} />;
};

const MapPicker = ({ koordinat, setKoordinat }) => {
  // 🧭 Ganti default ke Kabupaten Indramayu
  const defaultCenter = [-6.3262, 108.3242]; // Koordinat pusat Indramayu
  const center = koordinat ? koordinat.split(",").map(Number) : defaultCenter;

  return (
    <div className="border rounded shadow mt-2">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker koordinat={koordinat} setKoordinat={setKoordinat} />
      </MapContainer>
    </div>
  );
};

export default MapPicker;
