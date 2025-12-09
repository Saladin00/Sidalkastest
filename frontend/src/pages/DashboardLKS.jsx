import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  Users,
  ShieldCheck,
  Sparkles,
  Clock,
  BarChart3,
  Activity,
  FolderKanban,
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

import LKSLayout from "../components/LKSLayout";
import api from "../utils/api";

export default function DashboardLKS() {
  const [time, setTime] = useState(new Date());

  const [stats, setStats] = useState({
    klien_aktif: 0,
    klien_nonaktif: 0,
    jenis_bantuan: [],
  });

  const [loading, setLoading] = useState(false);

  // =======================
  // LOAD DATA BACKEND
  // =======================
  const loadData = async () => {
    setLoading(true);

    try {
      const res = await api.get("/dashboard");
      const data = res.data;

      setStats({
        klien_aktif: data.jumlah_klien?.aktif ?? 0,
        klien_nonaktif: data.jumlah_klien?.tidak_aktif ?? 0,
        jenis_bantuan:
          data.jenis_bantuan?.map((j) => ({
            jenis: j.jenis_bantuan ?? "-",
            total: j.total ?? 0,
          })) ?? [],
      });
    } catch (err) {
      console.error("Gagal load dashboard LKS:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Jam berjalan real-time
  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <LKSLayout>
      <div className="min-h-screen w-full text-slate-700">
        {/* HEADER */}
        <header className="flex justify-between items-center px-5 md:px-10 py-5 bg-white shadow-sm rounded-b-2xl border-b">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Sparkles className="text-sky-500" size={22} />
              <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                Dashboard LKS
              </h1>
            </div>
            <p className="text-sm text-gray-500 ml-7">
              Selamat datang di Panel Dashboard Lembaga Kesejahteraan Sosial
            </p>
          </div>

          <div className="flex items-center gap-2 text-slate-600 text-sm font-semibold">
            <Clock className="text-sky-500" size={18} />
            <span>{time.toLocaleTimeString("id-ID")}</span>
          </div>
        </header>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-gray-500 mt-4">Memuat data...</p>
        )}

        {/* STAT CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 px-5 md:px-10 py-8">
          {[
            {
              title: "Klien Aktif",
              value: stats.klien_aktif,
              icon: Users,
              color: "from-green-400 to-emerald-500",
            },
            {
              title: "Klien Tidak Aktif",
              value: stats.klien_nonaktif,
              icon: Users,
              color: "from-orange-400 to-red-400",
            },
            {
              title: "Jenis Bantuan",
              value: stats.jenis_bantuan.length,
              icon: ShieldCheck,
              color: "from-sky-400 to-blue-500",
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

        {/* CHART: Jenis Bantuan */}
        <section className="px-5 md:px-10 pb-10">
          <motion.div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            <h3 className="flex items-center gap-2 text-slate-700 font-semibold text-lg mb-3">
              <BarChart3 className="text-sky-500" /> Distribusi Jenis Bantuan
            </h3>

            <p className="text-sm text-gray-500 mb-4">
              Statistik jenis bantuan yang sedang diterima klien.
            </p>

            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={stats.jenis_bantuan}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="jenis"
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 12, fill: "#475569" }}
                />
                <YAxis tick={{ fill: "#475569" }} />
                <Tooltip />
                <Bar
                  dataKey="total"
                  radius={[10, 10, 0, 0]}
                  fill="url(#gradLKS)"
                />
                <defs>
                  <linearGradient id="gradLKS" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </section>

        {/* TABLE: Jenis Bantuan */}
        <section className="px-5 md:px-10 pb-10">
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
                      <td className="p-2 border">{item.jenis}</td>
                      <td className="p-2 border text-center">{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-6 text-center text-gray-500 text-sm border-t bg-white">
          © {new Date().getFullYear()} SIDALEKAS · LKS Dashboard
        </footer>
      </div>
    </LKSLayout>
  );
}
