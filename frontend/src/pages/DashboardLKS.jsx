// src/pages/DashboardLKS.jsx

import LKSLayout from "../components/LKSLayout";

const DashboardLKS = () => {
  return (
    <LKSLayout>
      <h2 className="text-xl font-bold mb-4">Dashboard Lembaga (LKS)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 shadow rounded">
          <p>Jumlah Klien aktif: <strong>22</strong></p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <p>Laporan terakhir: <strong>20 Okt 2025</strong></p>
        </div>
      </div>
    </LKSLayout>
  );
};

export default DashboardLKS;
