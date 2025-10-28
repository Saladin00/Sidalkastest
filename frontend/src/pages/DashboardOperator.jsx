// src/pages/DashboardOperator.jsx

import OperatorLayout from "../components/OperatorLayout";

const DashboardOperator = () => {
  return (
    <OperatorLayout>
      <h2 className="text-xl font-bold mb-4">Dashboard Operator Kecamatan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 shadow rounded">
          <p>Jumlah LKS di wilayah ini: <strong>12</strong></p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <p>Jumlah Klien terdaftar: <strong>58</strong></p>
        </div>
      </div>
    </OperatorLayout>
  );
};

export default DashboardOperator;
