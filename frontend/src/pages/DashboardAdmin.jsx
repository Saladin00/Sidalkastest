import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import {
  Users,
  ShieldCheck,
  Building2,
  Sparkles,
  MapPin,
  Clock,
  BarChart3,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function AutoZoom({ locations }) {
  const map = useMap();
  const indexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % locations.length;
      const loc = locations[indexRef.current];
      map.flyTo([loc.lat, loc.lng], 11, { duration: 2.5 });
    }, 8000);

    return () => clearInterval(interval);
  }, [map, locations]);

  return null;
}

const DashboardAdmin = () => {
  const [time, setTime] = useState(new Date());

  const [stats, setStats] = useState({
    lks_aktif: 0,
    lks_diproses: 0,
    lks_nonaktif: 0,
    klien_aktif: 0,
    klien_nonaktif: 0,
    total_petugas: 0,
  });

  const [kecamatanData, setKecamatanData] = useState([]);

  const [chartData, setChartData] = useState([
    { bulan: "Jan", klien: 420 },
    { bulan: "Feb", klien: 470 },
    { bulan: "Mar", klien: 530 },
    { bulan: "Apr", klien: 590 },
    { bulan: "Mei", klien: 640 },
    { bulan: "Jun", klien: 700 },
  ]);

  const [locations] = useState([
    { name: "Indramayu", lat: -6.3272, lng: 108.3251 },
    { name: "Lohbener", lat: -6.3305, lng: 108.29 },
    { name: "Sindang", lat: -6.325, lng: 108.36 },
    { name: "Jatibarang", lat: -6.475, lng: 108.33 },
    { name: "Kertasemaya", lat: -6.53, lng: 108.35 },
    { name: "Karangampel", lat: -6.38, lng: 108.45 },
    { name: "Anjatan", lat: -6.33, lng: 108.12 },
  ]);

  // ============================================================
  // FETCH DATA API
  // ============================================================
  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      console.error("Token tidak ditemukan! Anda harus login.");
      return;
    }

    fetch("http://localhost:8000/api/dashboard", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then(async (res) => {
        if (res.status === 401) {
          console.error("Unauthorized! Token salah atau expired.");
          return;
        }

        const data = await res.json();
        console.log("API DASHBOARD:", data);

        // ====== AMANKAN DATA DARI BACKEND ======
        setStats({
          lks_aktif: data.total_lks?.aktif ?? 0,
          lks_diproses: data.total_lks?.diproses ?? 0,
          lks_nonaktif: data.total_lks?.nonaktif ?? 0,
          klien_aktif: data.total_klien?.aktif ?? 0,
          klien_nonaktif: data.total_klien?.nonaktif ?? 0,
          total_petugas: data.total_petugas ?? 0,
        });

        // Per Kecamatan
        setKecamatanData(
          (data.per_kecamatan ?? []).map((k) => ({
            nama: k.nama ?? "-",
            jumlah: (k.aktif ?? 0) + (k.diproses ?? 0) + (k.nonaktif ?? 0),
          }))
        );
      })
      .catch((err) => console.error(err));
  }, []);

  // Realtime clock
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Chart animation
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prev) =>
        prev.map((d) => ({
          ...d,
          klien: Math.max(300, d.klien + (Math.random() * 20 - 10)),
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Background animation
  const bgControls = useAnimation();
  useEffect(() => {
    const animate = async () => {
      while (true) {
        await bgControls.start({
          background:
            "linear-gradient(135deg, #e0f2fe, #ecfdf5, #f0f9ff, #e9d5ff)",
          transition: { duration: 8 },
        });
        await bgControls.start({
          background:
            "linear-gradient(135deg, #f0f9ff, #d1fae5, #f5f3ff, #e0f2fe)",
          transition: { duration: 8 },
        });
      }
    };
    animate();
  }, [bgControls]);

  // ============================================================
  // RENDER UI
  // ============================================================
  return (
    <motion.div animate={bgControls} className="min-h-screen w-full text-slate-700">
      {/* HEADER */}
      <header className="flex justify-between items-center px-16 py-8">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-sky-600 via-emerald-500 to-violet-500 bg-clip-text text-transparent">
            <Sparkles className="inline text-yellow-400 mb-1" /> SIDALEKAS Dashboard
          </h1>
          <p className="text-slate-600 font-medium mt-1">
            Dinas Sosial Kabupaten Indramayu
          </p>
        </div>

        <div className="flex items-center gap-2 text-slate-600 text-lg">
          <Clock className="text-sky-500" size={22} />
          {time.toLocaleTimeString("id-ID")}
        </div>
      </header>

      {/* PANEL STATISTIK */}
      <section className="flex justify-center gap-10 flex-wrap mt-6">
        {[
          {
            title: "LKS Aktif (Valid)",
            value: stats.lks_aktif,
            icon: Building2,
            color: "from-sky-400 to-blue-300",
          },
          {
            title: "LKS Diproses",
            value: stats.lks_diproses,
            icon: Clock,
            color: "from-yellow-400 to-amber-300",
          },
          {
            title: "LKS Nonaktif",
            value: stats.lks_nonaktif,
            icon: Building2,
            color: "from-red-400 to-rose-300",
          },
          {
            title: "Klien Aktif",
            value: stats.klien_aktif,
            icon: Users,
            color: "from-emerald-400 to-teal-300",
          },
          {
            title: "Klien Nonaktif",
            value: stats.klien_nonaktif,
            icon: Users,
            color: "from-orange-400 to-red-300",
          },
          {
            title: "Total Petugas",
            value: stats.total_petugas,
            icon: ShieldCheck,
            color: "from-indigo-400 to-sky-300",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className={`bg-gradient-to-br ${card.color} p-[2px] rounded-[2rem] w-64`}
          >
            <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 text-center">
              <card.icon size={30} className="text-sky-600 mb-3 mx-auto" />
              <p className="text-slate-600 font-medium">{card.title}</p>
              <h2 className="text-4xl font-bold text-sky-600">{card.value}</h2>
            </div>
          </motion.div>
        ))}
      </section>

      {/* CHART + BAR */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-12 mt-12">
        {/* TREND */}
        <motion.div className="bg-white/80 rounded-[2rem] p-8 shadow-xl">
          <h3 className="flex items-center gap-2 text-slate-700 font-semibold mb-6">
            <Activity className="text-sky-500" /> Tren Pertumbuhan Klien
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#a7f3d0" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="bulan" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="klien"
                stroke="#0ea5e9"
                fill="url(#areaFill)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* BAR CHART */}
        <motion.div className="bg-white/80 rounded-[2rem] p-8 shadow-xl">
          <h3 className="flex items-center gap-2 text-slate-700 font-semibold mb-6">
            <BarChart3 className="text-emerald-500" /> Sebaran LKS per Kecamatan
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={kecamatanData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="nama" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="jumlah" fill="url(#barGradient)" radius={[12, 12, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.4} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </section>

      {/* MAP */}
      <motion.section className="mx-12 mt-16 bg-white/90 rounded-[2rem] p-8 shadow-xl">
        <h3 className="flex items-center gap-2 text-slate-700 font-semibold mb-4">
          <MapPin className="text-rose-500" /> Peta Sebaran LKS Kabupaten Indramayu
        </h3>

        <div className="h-[420px] rounded-2xl overflow-hidden">
          <MapContainer center={[-6.33, 108.33]} zoom={10} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <AutoZoom locations={locations} />

            {locations.map((loc, i) => (
              <Marker key={i} position={[loc.lat, loc.lng]}>
                <Popup>
                  <b>{loc.name}</b>
                  <br />
                  LKS Aktif: {Math.floor(Math.random() * 12) + 3}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="mt-14 py-8 text-center text-slate-600">
        © {new Date().getFullYear()} Dinas Sosial Kabupaten Indramayu
      </footer>
    </motion.div>
  );
};

export default DashboardAdmin;
