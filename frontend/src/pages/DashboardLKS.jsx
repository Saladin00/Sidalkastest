import React, { useEffect, useState } from "react";
import LKSLayout from "../components/LKSLayout";
import api from "../utils/api";
import { Users, Activity, FolderKanban } from "lucide-react";

const DashboardLKS = () => {
  const [stats, setStats] = useState({
    klien_aktif: 0,
    klien_selesai: 0,
    jenis_bantuan: [],
  });

  const [loading, setLoading] = useState(false);

  // ============================
  // LOAD DATA BACKEND
  // ============================
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/dashboard");
      const data = res.data;

      setStats({
        klien_aktif: data.jumlah_klien?.aktif ?? 0,
        klien_selesai: data.jumlah_klien?.tidak_aktif ?? 0,
        jenis_bantuan: data.jenis_bantuan ?? [],
      });
    } catch (err) {
      console.error("Gagal load dashboard LKS:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // ============================
  // CARD COMPONENT
  // ============================
  const Card = ({ title, value, icon: Icon, color }) => (
    <div className={`p-5 rounded-xl shadow bg-white border-l-4 ${color}`}>
      <div className="flex items-center gap-3">
        <Icon size={28} className="text-sky-600" />
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
        </div>
      </div>
    </div>
  );

  return (
    <LKSLayout>
      <h2 className="text-2xl font-bold mb-6 text-slate-800">
        Dashboard Lembaga Kesejahteraan Sosial (LKS)
      </h2>

      {loading && <p className="text-gray-500 mb-4">Memuat data...</p>}

      {/* STATISTIK LKS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card
          title="Klien Aktif"
          value={stats.klien_aktif}
          icon={Users}
          color="border-emerald-500"
        />

        <Card
          title="Klien selesai"
          value={stats.klien_selesai}
          icon={Activity}
          color="border-red-500"
        />
      </div>

      {/* TABEL JENIS BANTUAN */}
      <div className="bg-white rounded-xl shadow p-6 border">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-800">
          <FolderKanban size={20} /> Rekap Jenis Bantuan Klien
        </h3>

        {stats.jenis_bantuan.length === 0 ? (
          <p className="text-gray-400 italic text-center py-4">
            Belum ada data jenis bantuan.
          </p>
        ) : (
          <table className="w-full text-sm border rounded">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-2 border">Jenis Bantuan</th>
                <th className="p-2 border text-center">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {stats.jenis_bantuan.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-2 border">{item.jenis_bantuan || "-"}</td>
                  <td className="p-2 border text-center">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-slate-500 mt-10 text-sm">
        © {new Date().getFullYear()} LKS – Sistem Informasi SIDALEKAS
      </div>
    </LKSLayout>
  );
};

export default DashboardLKS;
