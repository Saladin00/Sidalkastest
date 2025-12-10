// src/components/public/StatsSection.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { Users, Building2, ShieldCheck } from "lucide-react";

export default function StatsSection() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Gagal ambil statistik:", err));
  }, []);

  if (!data) return null;

  const cards = [
    {
      title: "LKS Aktif",
      value: data.total_lks?.aktif ?? 0,
      icon: Building2,
      color: "from-sky-400 to-blue-500",
    },
    {
      title: "LKS Nonaktif",
      value: data.total_lks?.nonaktif ?? 0,
      icon: Building2,
      color: "from-red-400 to-rose-500",
    },
    {
      title: "Klien Aktif",
      value: data.total_klien?.aktif ?? 0,
      icon: Users,
      color: "from-green-400 to-emerald-500",
    },
    {
      title: "Klien Nonaktif",
      value: data.total_klien?.nonaktif ?? 0,
      icon: Users,
      color: "from-orange-400 to-red-400",
    },
    {
      title: "Petugas Sosial",
      value: data.total_petugas ?? 0,
      icon: ShieldCheck,
      color: "from-indigo-400 to-sky-400",
    },
  ];

  return (
    <section className="py-16 px-6 md:px-12 bg-gradient-to-br from-white to-cyan-50" id="statistik">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-800 mb-10">
        Statistik Sosial Daerah
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 max-w-6xl mx-auto">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className={`bg-gradient-to-br ${card.color} p-[2px] rounded-xl shadow-lg`}
          >
            <div className="bg-white rounded-xl p-4 text-center">
              <card.icon className="text-slate-700 mx-auto mb-2" size={28} />
              <p className="text-sm text-gray-500">{card.title}</p>
              <h3 className="text-3xl font-bold text-slate-800">
                <CountUp end={card.value} duration={2} />
              </h3>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
