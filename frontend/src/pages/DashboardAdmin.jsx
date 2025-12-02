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

// 🔁 AutoZoom Map Animation
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
  // 🧠 Data state
  const [time, setTime] = useState(new Date());
  const [stats, setStats] = useState({ lks: 124, klien: 1345, verifikasi: 12 });

  const [chartData, setChartData] = useState([
    { bulan: "Jan", klien: 420 },
    { bulan: "Feb", klien: 470 },
    { bulan: "Mar", klien: 530 },
    { bulan: "Apr", klien: 590 },
    { bulan: "Mei", klien: 640 },
    { bulan: "Jun", klien: 700 },
  ]);

  const [kecamatanData, setKecamatanData] = useState([
    { nama: "Indramayu", jumlah: 12 },
    { nama: "Lohbener", jumlah: 10 },
    { nama: "Sindang", jumlah: 8 },
    { nama: "Jatibarang", jumlah: 6 },
    { nama: "Kertasemaya", jumlah: 5 },
    { nama: "Karangampel", jumlah: 7 },
    { nama: "Anjatan", jumlah: 9 },
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

  // 🕒 Realtime clock
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // 📈 Simulasi update data setiap 3 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prev) =>
        prev.map((d) => ({
          ...d,
          klien: Math.max(300, d.klien + (Math.random() * 20 - 10)),
        }))
      );
      setStats((prev) => ({
        ...prev,
        klien: prev.klien + Math.floor(Math.random() * 6 - 3),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 🌈 Background gradient animation
  const bgControls = useAnimation();
  useEffect(() => {
    const loop = async () => {
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
    loop();
  }, [bgControls]);

  // 🎨 Render UI
  return (
    <motion.div
      animate={bgControls}
      className="min-h-screen w-full overflow-hidden text-slate-700"
    >
      {/* HEADER */}
      <header className="flex justify-between items-center px-16 py-8">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-sky-600 via-emerald-500 to-violet-500 bg-clip-text text-transparent drop-shadow-sm">
            <Sparkles className="inline text-yellow-400 mb-1" /> SIDALEKAS Dashboard
          </h1>
          <p className="text-slate-600 font-medium mt-1">
            Dinas Sosial Kabupaten Indramayu
          </p>
        </div>
        <div className="flex items-center gap-2 text-slate-600 text-lg">
          <Clock className="text-sky-500" size={22} />
          {time.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </div>
      </header>

      {/* PANEL STATISTIK */}
      <section className="flex justify-center gap-14 mt-6">
        {[
          {
            title: "LKS Aktif",
            value: stats.lks,
            icon: Building2,
            color: "from-sky-400 to-blue-300",
          },
          {
            title: "Total Klien",
            value: stats.klien,
            icon: Users,
            color: "from-emerald-400 to-teal-300",
          },
          {
            title: "Verifikasi Tertunda",
            value: stats.verifikasi,
            icon: ShieldCheck,
            color: "from-amber-400 to-orange-300",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
            className={`relative bg-gradient-to-br ${card.color} text-white p-[2px] rounded-[2rem] shadow-xl w-72`}
          >
            <div className="bg-white/70 backdrop-blur-2xl rounded-[2rem] p-6 flex flex-col items-center">
              <card.icon size={30} className="text-sky-600 mb-2" />
              <p className="text-slate-600 font-medium">{card.title}</p>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-sky-500 to-emerald-400 bg-clip-text text-transparent">
                {card.value}
              </h2>
            </div>
          </motion.div>
        ))}
      </section>
      {/* ==================== TREND CHART ==================== */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-12 mt-12">
        {/* TREN PERTUMBUHAN */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] shadow-2xl p-8 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-emerald-50 opacity-70" />
          <div className="relative z-10">
            <h3 className="flex items-center gap-2 text-slate-700 text-lg font-semibold mb-6">
              <Activity className="text-sky-500" /> Tren Pertumbuhan Klien (Realtime)
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#a7f3d0" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="bulan" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255,255,255,0.9)",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="klien"
                  stroke="#0ea5e9"
                  fill="url(#areaFill)"
                  strokeWidth={4}
                  dot={{ r: 6, fill: "#38bdf8", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* SEBARAN LKS PER KECAMATAN */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] shadow-2xl p-8 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-sky-50 opacity-70" />
          <div className="relative z-10">
            <h3 className="flex items-center gap-2 text-slate-700 text-lg font-semibold mb-6">
              <BarChart3 className="text-emerald-500" /> Sebaran LKS per Kecamatan
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={kecamatanData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="nama" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
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
          </div>
        </motion.div>
      </section>

      {/* ==================== MAP ==================== */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="bg-white/90 backdrop-blur-2xl border border-slate-200 rounded-[2rem] shadow-2xl mx-12 mt-16 p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-50 via-emerald-50 to-white opacity-80" />
        <div className="relative z-10">
          <h3 className="flex items-center gap-2 text-slate-700 text-lg font-semibold mb-4">
            <MapPin className="text-rose-500" /> Peta Sebaran LKS Kabupaten Indramayu
          </h3>
          <div className="h-[420px] rounded-2xl overflow-hidden shadow-inner border border-slate-200">
            <MapContainer
              center={[-6.33, 108.33]}
              zoom={10}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
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
        </div>
      </motion.section>

      {/* ==================== FOOTER ==================== */}
      <footer className="relative mt-20 py-10 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-200/50 via-emerald-200/40 to-violet-200/50 blur-[100px] opacity-70 animate-pulse" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="relative z-10"
        >
          <h4 className="text-slate-700 font-semibold text-lg">
            Kabupaten Indramayu · Dinas Sosial
          </h4>
          <p className="text-slate-500 mt-2">
            © {new Date().getFullYear()}{" "}
          
          </p>
        
        </motion.div>
      </footer>
    </motion.div>
  );
};

export default DashboardAdmin;
