import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  Users,
  ShieldCheck,
  Building2,
  Sparkles,
  MapPin,
  Clock,
  BarChart3,
  ChevronLeft,
  ChevronRight,
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
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 🎯 Warna marker berdasarkan status
const iconColors = {
  valid: "#10b981",
  diproses: "#facc15",
  nonaktif: "#ef4444",
  default: "#3b82f6",
};
function getMarkerIcon(status = "default") {
  const color = iconColors[status] || iconColors.default;
  return new L.DivIcon({
    html: `<div style="
      background:${color};
      width:14px;height:14px;
      border-radius:50%;
      border:2px solid white;
      box-shadow:0 0 8px rgba(0,0,0,0.4);
    "></div>`,
    className: "",
  });
}

// 🔄 AutoZoom efek halus antar lokasi
function AutoZoom({ locations }) {
  const map = useMap();
  const indexRef = useRef(0);
  useEffect(() => {
    if (!locations || locations.length === 0) return;
    const interval = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % locations.length;
      const loc = locations[indexRef.current];
      if (loc.lat && loc.lng)
        map.flyTo([loc.lat, loc.lng], 11, { duration: 2.2 });
    }, 7000);
    return () => clearInterval(interval);
  }, [map, locations]);
  return null;
}

export default function DashboardAdmin() {
  const [time, setTime] = useState(new Date());
  const [stats, setStats] = useState({});
  const [kecamatanData, setKecamatanData] = useState([]);
  const [locations, setLocations] = useState([]);

  // Fetch data backend
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8000/api/dashboard", {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        setStats({
          lks_aktif: data.total_lks?.aktif ?? 0,
          lks_diproses: data.total_lks?.diproses ?? 0,
          lks_nonaktif: data.total_lks?.nonaktif ?? 0,
          klien_aktif: data.total_klien?.aktif ?? 0,
          klien_nonaktif: data.total_klien?.nonaktif ?? 0,
          total_petugas: data.total_petugas ?? 0,
        });
        setKecamatanData(
          (data.per_kecamatan ?? []).map((k) => ({
            nama: k.nama ?? "-",
            jumlah:
              (k.aktif ?? 0) + (k.diproses ?? 0) + (k.nonaktif ?? 0),
          }))
        );
        setLocations(data.lokasi_lks ?? []);
      })
      .catch(console.error);
  }, []);

  // Jam realtime
  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  // Scroll chart horizontal
  const scrollChart = (direction) => {
    const chartContainer = document.getElementById("chart-scroll");
    if (chartContainer) {
      const scrollAmount = direction === "left" ? -300 : 300;
      chartContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f9fafc] via-[#eef6ff] to-[#f1f5f9] text-slate-700 flex flex-col">
      {/* HEADER */}
      <header className="flex justify-between items-center px-10 py-5 bg-white shadow-sm border-b sticky top-0 z-50 rounded-b-2xl">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Sparkles className="text-sky-500" size={22} />
            <h1 className="text-xl md:text-2xl font-bold text-slate-800">
              SIDALEKAS Dashboard
            </h1>
          </div>
          <p className="text-sm text-gray-500 ml-7">
            Sistem Informasi Data Lembaga Kesejahteraan Sosial – Kabupaten Indramayu
          </p>
        </div>
        <div className="flex items-center gap-2 text-slate-600 text-sm font-semibold">
          <Clock className="text-sky-500" size={18} />
          <span>{time.toLocaleTimeString("id-ID")}</span>
        </div>
      </header>

      {/* STATS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5 px-10 py-8">
        {[
          { title: "LKS Aktif", value: stats.lks_aktif, icon: Building2, color: "from-sky-400 to-blue-500" },
          { title: "Diproses", value: stats.lks_diproses, icon: Clock, color: "from-yellow-400 to-amber-500" },
          { title: "Nonaktif", value: stats.lks_nonaktif, icon: Building2, color: "from-rose-400 to-red-500" },
          { title: "Klien Aktif", value: stats.klien_aktif, icon: Users, color: "from-green-400 to-emerald-500" },
          { title: "Klien Nonaktif", value: stats.klien_nonaktif, icon: Users, color: "from-orange-400 to-red-400" },
          { title: "Petugas", value: stats.total_petugas, icon: ShieldCheck, color: "from-indigo-400 to-sky-400" },
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

      {/* SEBARAN LKS */}
      <section className="px-10 pb-10">
        <motion.div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 relative">
          <div className="flex justify-between items-center mb-3">
            <h3 className="flex items-center gap-2 text-slate-700 font-semibold text-lg">
              <BarChart3 className="text-sky-500" /> Sebaran LKS per Kecamatan
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => scrollChart("left")}
                className="p-2 rounded-lg bg-slate-100 hover:bg-sky-100 transition"
              >
                <ChevronLeft className="text-sky-600" size={18} />
              </button>
              <button
                onClick={() => scrollChart("right")}
                className="p-2 rounded-lg bg-slate-100 hover:bg-sky-100 transition"
              >
                <ChevronRight className="text-sky-600" size={18} />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Statistik jumlah LKS berdasarkan kecamatan di Kabupaten Indramayu.
          </p>

          <div id="chart-scroll" className="overflow-x-auto scrollbar-thin scrollbar-thumb-sky-300 scrollbar-track-gray-100 rounded-lg">
            <div className="min-w-[1200px]">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={kecamatanData} barGap={6}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="nama" interval={0} angle={-25} textAnchor="end" height={90} tick={{ fontSize: 12, fill: "#475569" }} />
                  <YAxis tick={{ fill: "#475569" }} />
                  <Tooltip
                    cursor={{ fill: "rgba(14,165,233,0.05)" }}
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Bar
                    dataKey="jumlah"
                    radius={[10, 10, 0, 0]}
                    fill="url(#colorGradient)"
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </section>

      {/* MAP */}
      <section className="px-10 pb-10">
        <motion.div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 relative">
          <h3 className="flex items-center gap-2 text-slate-700 font-semibold text-lg mb-5 border-b pb-2">
            <MapPin className="text-rose-500" /> Peta Sebaran Titik LKS Kabupaten Indramayu
          </h3>
          <div className="h-[450px] rounded-lg overflow-hidden">
            <MapContainer center={[-6.33, 108.33]} zoom={10} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <AutoZoom locations={locations} />
              {locations.map(
                (loc, i) =>
                  loc.lat &&
                  loc.lng && (
                    <Marker key={i} position={[loc.lat, loc.lng]} icon={getMarkerIcon(loc.status)}>
                      <Popup>
                        <b>{loc.nama}</b>
                        <br />Status: {loc.status}
                      </Popup>
                    </Marker>
                  )
              )}
            </MapContainer>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 text-center text-gray-500 text-sm border-t bg-white">
        © {new Date().getFullYear()} Dinas Sosial Kabupaten Indramayu · SIDALEKAS
      </footer>
    </div>
  );
}
