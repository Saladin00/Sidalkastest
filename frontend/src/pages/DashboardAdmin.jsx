import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  ShieldCheck,
  Building2,
  Activity,
  Sparkles,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// 🎨 Warna gradasi keren kekinian
const gradients = {
  blue: "from-sky-500 via-cyan-400 to-sky-300",
  green: "from-emerald-500 via-teal-400 to-lime-300",
  orange: "from-amber-400 via-orange-500 to-rose-400",
};

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    lks: 24,
    klien: 186,
    verifikasi: 6,
  });

  const [chartData, setChartData] = useState([
    { bulan: "Jan", klien: 40 },
    { bulan: "Feb", klien: 65 },
    { bulan: "Mar", klien: 80 },
    { bulan: "Apr", klien: 110 },
    { bulan: "Mei", klien: 130 },
    { bulan: "Jun", klien: 150 },
  ]);

  // efek animasi dummy realtime naik turun
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prev) =>
        prev.map((d) => ({
          ...d,
          klien: Math.max(20, d.klien + (Math.random() * 20 - 10)),
        }))
      );
      setStats((prev) => ({
        ...prev,
        klien: prev.klien + Math.floor(Math.random() * 5 - 2),
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    {
      title: "LKS Aktif",
      value: stats.lks,
      icon: <Building2 size={26} />,
      gradient: gradients.blue,
      glow: "shadow-[0_0_30px_3px_rgba(56,189,248,0.5)]",
    },
    {
      title: "Jumlah Klien",
      value: stats.klien,
      icon: <Users size={26} />,
      gradient: gradients.green,
      glow: "shadow-[0_0_30px_3px_rgba(52,211,153,0.5)]",
    },
    {
      title: "Verifikasi Tertunda",
      value: stats.verifikasi,
      icon: <ShieldCheck size={26} />,
      gradient: gradients.orange,
      glow: "shadow-[0_0_30px_3px_rgba(251,146,60,0.5)]",
    },
  ];

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="space-y-10"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="flex items-center gap-2 text-3xl font-bold bg-gradient-to-r from-sky-500 to-emerald-400 bg-clip-text text-transparent drop-shadow-sm">
            <Sparkles className="text-yellow-400 animate-pulse" /> Dashboard
            Administrator
          </h2>
          <p className="text-sm text-slate-500">
            Data diperbarui otomatis setiap 2,5 detik 🔄
          </p>
        </div>

        {/* Cards Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ scale: 1.05, rotate: 0.5 }}
              className={`relative overflow-hidden bg-gradient-to-br ${card.gradient} text-white rounded-2xl p-6 ${card.glow} shadow-lg backdrop-blur-lg`}
            >
              {/* Layer efek cahaya */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-40" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">{card.title}</p>
                  <motion.h3
                    key={card.value}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-4xl font-bold mt-1 tracking-tight drop-shadow-md"
                  >
                    {card.value}
                  </motion.h3>
                </div>
                <div className="bg-white/25 p-3 rounded-xl shadow-inner backdrop-blur-md">
                  {card.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart Modern */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="relative bg-white/90 backdrop-blur-2xl border border-slate-200 rounded-2xl shadow-xl p-6 overflow-hidden"
        >
          {/* Cahaya neon glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-emerald-50 opacity-60 blur-2xl" />
          <div className="relative flex items-center gap-2 mb-4">
            <Activity className="text-sky-600 animate-pulse" size={22} />
            <h3 className="text-lg font-semibold text-slate-700">
              Tren Pertumbuhan Klien (Realtime Simulation)
            </h3>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="colorKlien" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="10%" stopColor="#38bdf8" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
              <XAxis dataKey="bulan" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  background: "rgba(255,255,255,0.95)",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              />
              <Line
                type="monotone"
                dataKey="klien"
                stroke="url(#colorKlien)"
                strokeWidth={4}
                dot={{
                  r: 6,
                  fill: "#38bdf8",
                  strokeWidth: 2,
                  stroke: "#fff",
                }}
                activeDot={{
                  r: 10,
                  fill: "#0ea5e9",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-slate-400 text-sm mt-10">
          © {new Date().getFullYear()} — <span className="font-semibold">SIDALEKAS</span> Dashboard Admin
        </p>
      </motion.div>
    </AdminLayout>
  );
};

export default DashboardAdmin;
