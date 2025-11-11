// src/pages/DashboardPetugas.jsx
import React from "react";

export default function DashboardPetugas() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">
        Dashboard Petugas Lapangan
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="border rounded p-3 bg-white shadow-sm">
          Data verifikasi hari ini: <b>5</b>
        </div>
        <div className="border rounded p-3 bg-white shadow-sm">
          Pengaduan baru: <b>3</b>
        </div>
      </div>
    </div>
  );
}
