// src/pages/DashboardPetugas.jsx

import PetugasLayout from "../components/PetugasLayout";

const DashboardPetugas = () => {
  return (
    <PetugasLayout>
      <h2 className="text-xl font-bold mb-4">Dashboard Petugas Lapangan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 shadow rounded">
          <p>Data verifikasi hari ini: <strong>5</strong></p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <p>Pengaduan baru: <strong>3</strong></p>
        </div>
      </div>
    </PetugasLayout>
  );
};

export default DashboardPetugas;
