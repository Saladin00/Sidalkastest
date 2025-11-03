import AdminLayout from "../components/AdminLayout";

const DashboardAdmin = () => {
  return (
    <AdminLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Jumlah LKS Aktif</h2>
          <p className="text-2xl font-bold">24</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Jumlah Klien</h2>
          <p className="text-2xl font-bold">186</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Verifikasi Tertunda</h2>
          <p className="text-2xl font-bold">6</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardAdmin;
