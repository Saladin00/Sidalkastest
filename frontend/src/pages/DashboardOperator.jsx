import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";

import {
  Users,
  Sparkles,
  Clock,
  Building2,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

import {
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";

import OperatorLayout from "../components/OperatorLayout";
import api from "../utils/api";

export default function DashboardOperator() {
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    lks_valid: 0,
    lks_proses: 0,
    lks_tidak_valid: 0,
    klien_aktif: 0,
    klien_nonaktif: 0,
  });

  // ==============================
  // FETCH DATA
  // ==============================
  const loadData = async () => {
    setLoading(true);

    try {
      const res = await api.get("/dashboard");
      const data = res.data;

      setStats({
        lks_valid: data.total_lks?.valid ?? 0,
        lks_proses: data.total_lks?.diproses ?? 0,
        lks_tidak_valid: data.total_lks?.nonaktif ?? 0,
        klien_aktif: data.total_klien?.aktif ?? 0,
        klien_nonaktif: data.total_klien?.nonaktif ?? 0,
      });
    } catch (err) {
      console.error("Gagal load dashboard operator:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update jam realtime
  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  // Chart data klien
  const chartData = [
    { label: "Aktif", total: stats.klien_aktif },
    { label: "Nonaktif", total: stats.klien_nonaktif },
  ];

  return (
    <OperatorLayout>
      <div className="min-h-screen w-full text-slate-700">
        {/* ===================== HEADER ===================== */}
        <header className="flex justify-between items-center px-5 md:px-10 py-5 bg-white shadow-sm rounded-b-2xl border-b">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Sparkles className="text-sky-500" size={22} />
              <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                Dashboard Operator Kecamatan
              </h1>
            </div>
            <p className="text-sm text-gray-500 ml-7">
              Monitoring data LKS dan Klien di wilayah kerja Anda
            </p>
          </div>

          <div className="flex items-center gap-2 text-slate-600 text-sm font-semibold">
            <Clock className="text-sky-500" size={18} />
            <span>{time.toLocaleTimeString("id-ID")}</span>
          </div>
        </header>

        {loading && (
          <p className="text-center text-gray-500 mt-4">Memuat data...</p>
        )}

        {/* ===================== STAT CARDS ===================== */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5 px-5 md:px-10 py-8">
          {[
            {
              title: "LKS Valid",
              value: stats.lks_valid,
              icon: Building2,
              color: "from-green-400 to-emerald-500",
            },
            {
              title: "LKS Diproses",
              value: stats.lks_proses,
              icon: Clock,
              color: "from-yellow-400 to-amber-500",
            },
            {
              title: "LKS Tidak Valid",
              value: stats.lks_tidak_valid,
              icon: ShieldCheck,
              color: "from-red-400 to-rose-500",
            },
            {
              title: "Klien Aktif",
              value: stats.klien_aktif,
              icon: Users,
              color: "from-sky-400 to-blue-500",
            },
            {
              title: "Klien Nonaktif",
              value: stats.klien_nonaktif,
              icon: Users,
              color: "from-orange-400 to-red-400",
            },
            {
              title: "Total Data",
              value:
                stats.lks_valid +
                stats.lks_proses +
                stats.lks_tidak_valid +
                stats.klien_aktif +
                stats.klien_nonaktif,
              icon: BarChart3,
              color: "from-indigo-400 to-sky-400",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className={`bg-gradient-to-br ${card.color} p-[2px] rounded-xl shadow`}
            >
              <div className="bg-white rounded-xl p-4 text-center hover:shadow-md transition">
                <card.icon className="text-slate-700 mb-2 mx-auto" size={26} />
                <p className="text-sm text-gray-600">{card.title}</p>
                <h2 className="text-3xl font-extrabold text-slate-800 mt-1">
                  <CountUp end={card.value} duration={1.5} separator="," />
                </h2>
              </div>
            </motion.div>
          ))}
        </section>

        {/* ===================== CHART ===================== */}
        <section className="px-5 md:px-10 pb-10">
          <motion.div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            <h3 className="flex items-center gap-2 text-slate-700 font-semibold text-lg mb-3">
              <BarChart3 className="text-sky-500" /> Perbandingan Klien Aktif & Nonaktif
            </h3>

            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fill: "#475569" }} />
                <YAxis tick={{ fill: "#475569" }} />
                <Tooltip />
                <Bar
                  dataKey="total"
                  radius={[10, 10, 0, 0]}
                  fill="url(#operatorGrad)"
                />
                <defs>
                  <linearGradient id="operatorGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </section>

        {/* ===================== FOOTER ===================== */}
        <footer className="py-6 text-center text-gray-500 text-sm border-t bg-white">
          © {new Date().getFullYear()} SIDALEKAS · Operator Dashboard
        </footer>
      </div>
    </OperatorLayout>
  );
}
