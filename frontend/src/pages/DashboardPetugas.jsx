// src/pages/DashboardPetugas.jsx
export default function DashboardPetugas() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Dashboard Petugas Lapangan</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="border rounded p-3 bg-white">
          Data verifikasi hari ini: <b>5</b>
        </div>
        <div className="border rounded p-3 bg-white">
          Pengaduan baru: <b>3</b>
        </div>
      </div>
    </div>
  );
}
