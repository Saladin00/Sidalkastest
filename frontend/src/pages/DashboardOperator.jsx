// src/pages/DashboardOperator.jsx

import React, { useEffect, useState } from "react";
import OperatorLayout from "../components/OperatorLayout";
import {
  Users,
  Building2,
  Activity,
  Clock,
  ShieldCheck,
} from "lucide-react";
import api from "../utils/api";

const DashboardOperator = () => {
  const [stats, setStats] = useState({
    lks_valid: 0,
    lks_proses: 0,
    lks_tidak_valid: 0,
    klien_aktif: 0,
    klien_nonaktif: 0,
  });

  const [loading, setLoading] = useState(false);

  // ==============================
  // FETCH DATA DARI BACKEND
  // ==============================
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/dashboard"); // operator akan otomatis diarahkan oleh backend
      const data = res.data;

      setStats({
        lks_valid: data.total_lks?.valid ?? 0,
        lks_proses: data.total_lks?.diproses ?? 0,
        lks_tidak_valid: data.total_lks?.nonaktif ?? 0,
        klien_aktif: data.total_klien?.aktif ?? 0,
        klien_nonaktif: data.total_klien?.nonaktif ?? 0,
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // ==============================
  // CARD COMPONENT
  // ==============================
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
    <OperatorLayout>
      <h2 className="text-2xl font-bold mb-6 text-slate-800">
        Dashboard Operator Kecamatan
      </h2>

      {loading && (
        <p className="text-center text-gray-600 mb-4">Memuat data...</p>
      )}

      {/* GRID CARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        <Card
          title="LKS Valid (Aktif)"
          value={stats.lks_valid}
          icon={Building2}
          color="border-green-500"
        />

        <Card
          title="LKS Diproses"
          value={stats.lks_proses}
          icon={Clock}
          color="border-yellow-500"
        />

        <Card
          title="LKS Tidak Valid"
          value={stats.lks_tidak_valid}
          icon={ShieldCheck}
          color="border-red-500"
        />

        <Card
          title="Klien Aktif"
          value={stats.klien_aktif}
          icon={Users}
          color="border-emerald-500"
        />

        <Card
          title="Klien Nonaktif"
          value={stats.klien_nonaktif}
          icon={Users}
          color="border-orange-500"
        />

      </div>
    </OperatorLayout>
  );
};

export default DashboardOperator;
