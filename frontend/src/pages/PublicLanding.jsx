import React, { useEffect, useRef, useState } from "react";
import NavbarPublic from "../components/public/NavbarPublic";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  Users,
  Building2,
  ShieldCheck,
  MapPin,
  ArrowRightCircle,
  BarChart3,
} from "lucide-react";

import CountUp from "react-countup";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import Chart from "react-apexcharts";

export default function PublicLanding() {
  const mapRef = useRef(null);

  // =========================
  // 🔥 STATE PUBLIC DASHBOARD
  // =========================
  const [perKecamatan, setPerKecamatan] = useState([]);
  const [lokasiLks, setLokasiLks] = useState([]);
  const [totalLks, setTotalLks] = useState(0);

  // FIX: kamu lupa ini dideklarasi sebelum fetch 😁
  const [totalKlien, setTotalKlien] = useState(0);
  const [totalPetugas, setTotalPetugas] = useState(0);

  const [loading, setLoading] = useState(true);

  // =========================
  // 🔥 LOAD DATA API PUBLIC (FIXED)
  // =========================
  useEffect(() => {
    fetch("/api/public/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setPerKecamatan(data.per_kecamatan || []);
        setLokasiLks(data.lokasi_lks || []);
        setTotalLks(data.total_lks || 0);
        setTotalKlien(data.total_klien || 0);
        setTotalPetugas(data.total_petugas || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error("PUBLIC DASHBOARD ERROR:", err);
        setLoading(false);
      });
  }, []); // FIXED: fetch hanya sekali

  // =============================
  // 🎨 DONUT CHART CONFIG
  // =============================
  const chartColors = [
    "#1d4ed8",
    "#0ea5e9",
    "#22c55e",
    "#6366f1",
    "#f97316",
    "#eab308",
    "#ec4899",
    "#14b8a6",
    "#0f766e",
    "#4f46e5",
    "#f97373",
    "#a855f7",
    "#10b981",
    "#3b82f6",
    "#fb923c",
    "#facc15",
    "#e11d48",
  ];

  const chartSeries = perKecamatan.map((k) => k.jumlah);

  const chartOptions = {
    chart: { type: "donut", toolbar: { show: false } },
    labels: perKecamatan.map((k) => k.nama),
    colors: chartColors,
    stroke: { width: 2, colors: ["#fff"] },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total LKS",
              formatter: () => totalLks,
            },
          },
        },
      },
    },
  };

  // =============================
  // 🎯 ICON GENERATOR
  // =============================
  const generateMarkerIcon = (color) =>
    new L.DivIcon({
      html: `
        <div style="
          width:28px;
          height:28px;
          background:${color};
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow:0 2px 6px rgba(0,0,0,0.35);
          position:relative;
        ">
          <div style="
            width:12px;
            height:12px;
            background:white;
            border-radius:50%;
            position:absolute;
            top:8px;
            left:8px;
          "></div>
        </div>
      `,
      iconSize: [28, 28],
      className: "",
    });

  return (
    <div className="bg-gradient-to-br from-[#e0f7fa] via-[#f2fbfc] to-[#e0f2f1] text-slate-700 min-h-screen flex flex-col">
      
      <NavbarPublic />

      {/* =====================================
                HERO SECTION (TIDAK DIUBAH)
      ===================================== */}
      <section className="relative flex flex-col-reverse md:flex-row items-center justify-between pt-28 md:pt-32 pb-16 px-6 md:px-16 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="max-w-xl">
          <h1 className="text-3xl md:text-5xl font-extrabold text-sky-800">
            Sistem Informasi Data Lembaga Kesejahteraan Sosial
          </h1>
          <p className="text-gray-600 mt-4">
            Platform resmi pendataan dan publikasi lembaga kesejahteraan di Kabupaten Indramayu.
          </p>

          <div className="flex gap-4 mt-6">
            <Link to="/login" className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold shadow-md flex items-center gap-2">
              Masuk <ArrowRightCircle size={18} />
            </Link>

            <Link to="/register" className="px-6 py-3 bg-white hover:bg-sky-50 border border-sky-300 rounded-lg font-semibold">
              Daftar LKS
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1 }} className="flex justify-center md:justify-end mb-10 md:mb-0">
          <img src="/logo.png" className="w-60 md:w-72 drop-shadow-lg" />
        </motion.div>
      </section>

      {/* =========================
            STATISTIK SECTION
      ========================= */}
      <StatsSection totalLks={totalLks} totalKlien={totalKlien} totalPetugas={totalPetugas} />

      {/* =====================================
                    MAP (TIDAK DIUBAH)
      ===================================== */}
      <section id="lks" className="py-20 px-6 md:px-12 bg-gradient-to-br from-sky-50 via-white to-cyan-50">
        <div className="max-w-6xl mx-auto mb-8">
          <h2 className="text-3xl font-bold text-sky-800">Sebaran Wilayah LKS</h2>
          <p className="text-gray-600">Persebaran titik lembaga sosial pada seluruh kecamatan.</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">

          {/* MAP */}
          <div className="bg-white rounded-3xl shadow-lg border overflow-hidden">
            <MapContainer
              center={[-6.42, 108.3]}
              zoom={10}
              style={{ height: "420px", width: "100%" }}
              whenCreated={(map) => (mapRef.current = map)}
            >
              <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {lokasiLks.filter((l) => l.lat && l.lng).map((l, idx) => (
                <Marker
                  key={idx}
                  position={[l.lat, l.lng]}
                  icon={generateMarkerIcon("#3b82f6")}
                >
                  <Popup>
                    <b>{l.nama}</b>
                    <br />
                    Status: {l.status}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* RINGKASAN */}
          <div className="bg-white rounded-3xl shadow-lg border p-5 flex flex-col">
            <p className="text-xs text-sky-600 uppercase font-semibold">Ringkasan</p>
            <h3 className="text-xl font-bold text-slate-900 mt-1">Rekap Sebaran LKS</h3>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-sky-50 p-3 rounded-xl">
                <p className="text-[11px] text-sky-600 uppercase">Total Kecamatan</p>
                <p className="text-xl font-bold text-sky-800">{perKecamatan.length}</p>
              </div>

              <div className="bg-blue-50 p-3 rounded-xl">
                <p className="text-[11px] text-sky-600 uppercase">Total LKS</p>
                <p className="text-xl font-bold text-sky-800">{totalLks}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
               DONUT CHART (TIDAK DIUBAH)
      ===================================== */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">

          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 bg-sky-100 rounded-full flex items-center justify-center">
              <BarChart3 className="text-sky-700" size={18} />
            </div>
            <div>
              <p className="text-xs text-sky-600 uppercase font-semibold">Grafik Sebaran</p>
              <h2 className="text-2xl font-bold text-sky-800">Sebaran LKS per Kecamatan</h2>
            </div>
          </div>

          <div className="bg-white border rounded-3xl shadow-xl p-6">
            <div className="flex flex-col md:flex-row gap-6">

              <div className="w-full md:w-[55%]">
                <Chart options={chartOptions} series={chartSeries} type="donut" height={340} />

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-xs mt-4">
                  {perKecamatan.map((k, idx) => (
                    <div key={k.id} className="flex items-center gap-1.5">
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: chartColors[idx % chartColors.length] }}
                      />
                      <span>{k.nama}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* TABEL */}
              <div className="w-full md:w-[45%] max-h-[340px] overflow-y-auto border rounded-xl">
                <table className="w-full text-xs">
                  <thead className="bg-sky-50 sticky top-0">
                    <tr className="text-left text-[11px] text-slate-600">
                      <th className="px-3 py-2">Kecamatan</th>
                      <th className="px-3 py-2 text-right">LKS</th>
                      <th className="px-3 py-2 text-right">Persen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {perKecamatan.map((k, idx) => {
                      const persen = totalLks > 0 ? ((k.jumlah / totalLks) * 100).toFixed(1) : 0;
                      return (
                        <tr key={k.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                          <td className="px-3 py-1.5">{k.nama}</td>
                          <td className="px-3 py-1.5 text-right font-semibold">{k.jumlah}</td>
                          <td className="px-3 py-1.5 text-right">{persen}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* FOOTER TIDAK DIUBAH */}
      <section id="kontak" className="bg-sky-700 text-white py-20 px-6 md:px-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Hubungi Dinas Sosial Kabupaten Indramayu</h2>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-sky-800/40 border border-sky-500/30 rounded-2xl p-6 shadow-lg">
            <MapPin size={32} className="text-yellow-300 mx-auto mb-3" />
            <p className="text-cyan-100 text-sm">Jl. Letnan Joni No. 1, Indramayu</p>
          </div>

          <div className="bg-sky-800/40 border border-sky-500/30 rounded-2xl p-6 shadow-lg">
            <ShieldCheck size={32} className="text-yellow-300 mx-auto mb-3" />
            <p className="text-cyan-100 text-sm">0812-3456-7890</p>
          </div>

          <div className="bg-sky-800/40 border border-sky-500/30 rounded-2xl p-6 shadow-lg">
            <Users size={32} className="text-yellow-300 mx-auto mb-3" />
            <p className="text-cyan-100 text-sm">dinsos@indramayukab.go.id</p>
          </div>
        </div>
      </section>

      <footer className="bg-sky-900 text-white py-6 text-center border-t border-sky-800 shadow-inner">
        <div className="text-sm tracking-wide">
          © {new Date().getFullYear()} · 
          <span className="font-semibold text-yellow-300"> SIDALEKAS</span>
        </div>
      </footer>
    </div>
  );
}

// ===========================
// 📌 Statistik Section
// ===========================
function StatsSection({ totalLks, totalKlien, totalPetugas }) {
  return (
    <section className="bg-white shadow-inner py-16 px-6 md:px-12 rounded-t-[3rem]">
      <h2 className="text-3xl font-bold text-center text-sky-800 mb-10">
        Statistik Sosial Kabupaten Indramayu
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[
          { title: "Total LKS Terdaftar", value: totalLks, icon: Building2 },
          { title: "Total Klien Terdata", value: totalKlien, icon: Users },
          { title: "Total Petugas Lapangan", value: totalPetugas, icon: ShieldCheck },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4 }}
            className="bg-gradient-to-br from-sky-400 to-sky-600 p-[2px] rounded-2xl shadow-lg"
          >
            <div className="bg-white rounded-2xl p-6 flex flex-col items-center">
              <item.icon className="text-sky-600 mb-3" size={36} />
              <h3 className="text-xl font-bold">
                <CountUp end={item.value} duration={1.5} separator="." />
              </h3>
              <p className="text-sm text-slate-600">{item.title}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
