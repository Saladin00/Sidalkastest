import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  Sparkles,
  ClipboardList,
  ClipboardCheck,
  Clock,
  BarChart3,
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

export default function DashboardPetugas() {
  const [time, setTime] = useState(new Date());
  const [stats, setStats] = useState({
    verifikasi_menunggu: 0,
    verifikasi_selesai: 0,
  });

  // Fetch data dari backend
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8000/api/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (data.role !== "petugas") return;

        setStats({
          verifikasi_menunggu: data.verifikasi_menunggu ?? 0,
          verifikasi_selesai: data.verifikasi_selesai ?? 0,
        });
      })
      .catch(console.error);
  }, []);

  // Clock real-time
  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  const chartData = [
    { label: "Menunggu Survei", total: stats.verifikasi_menunggu },
    { label: "Selesai Disurvei", total: stats.verifikasi_selesai },
  ];

  return (
    <div className="min-h-screen w-full text-slate-700">

      {/* HEADER */}
      <header className="flex justify-between items-center px-6 md:px-10 py-5 bg-white shadow-sm rounded-b-2xl border-b">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Sparkles className="text-sky-500" size={22} />
            <h1 className="text-xl md:text-2xl font-bold text-slate-800">
              Dashboard Petugas Lapangan
            </h1>
          </div>
          <p className="text-sm text-gray-500 ml-7">
            Monitoring tugas survei & verifikasi lapangan
          </p>
        </div>

        <div className="flex items-center gap-2 text-slate-600 text-sm font-semibold">
          <Clock className="text-sky-500" size={18} />
          <span>{time.toLocaleTimeString("id-ID")}</span>
        </div>
      </header>

      {/* CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 px-6 md:px-10 py-8">
        {[
          {
            title: "Menunggu Survei",
            value: stats.verifikasi_menunggu,
            icon: ClipboardList,
            color: "from-yellow-400 to-amber-500",
          },
          {
            title: "Selesai Disurvei",
            value: stats.verifikasi_selesai,
            icon: ClipboardCheck,
            color: "from-green-400 to-emerald-500",
          },
          {
            title: "Total Tugas",
            value:
              stats.verifikasi_menunggu + stats.verifikasi_selesai,
            icon: BarChart3,
            color: "from-sky-400 to-blue-600",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className={`bg-gradient-to-br ${card.color} p-[2px] rounded-xl shadow`}
          >
            <div className="bg-white rounded-xl p-5 text-center hover:shadow-md transition">
              <card.icon className="text-slate-700 mb-3 mx-auto" size={28} />
              <p className="text-sm text-gray-600">{card.title}</p>
              <h2 className="text-3xl font-extrabold text-slate-800 mt-1">
                <CountUp end={card.value} duration={1.5} separator="," />
              </h2>
            </div>
          </motion.div>
        ))}
      </section>

      {/* CHART */}
      <section className="px-6 md:px-10 pb-10">
        <motion.div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          <h3 className="flex items-center gap-2 text-slate-700 font-semibold text-lg mb-4">
            <BarChart3 className="text-sky-500" /> Progress Verifikasi Lapangan
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
                fill="url(#gradPetugas)"
              />
              <defs>
                <linearGradient id="gradPetugas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.7} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 text-center text-gray-500 text-sm border-t bg-white">
        © {new Date().getFullYear()} SIDALEKAS · Dashboard Petugas Lapangan
      </footer>
    </div>
  );
}
