import React, { useMemo, useRef, useState } from "react";
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

// 📌 Leaflet Map
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 📌 ApexCharts
import Chart from "react-apexcharts";

// =========================
//  DATA 31 KECAMATAN
// =========================
const kecamatanIndramayu = [
  { id: 1, nama: "Indramayu", jumlah: 24, lat: -6.325, lng: 108.325 },
  { id: 2, nama: "Sindang", jumlah: 18, lat: -6.340, lng: 108.350 },
  { id: 3, nama: "Jatibarang", jumlah: 15, lat: -6.480, lng: 108.300 },
  { id: 4, nama: "Karangampel", jumlah: 17, lat: -6.450, lng: 108.450 },
  { id: 5, nama: "Haurgeulis", jumlah: 9, lat: -6.420, lng: 108.120 },
  { id: 6, nama: "Losarang", jumlah: 13, lat: -6.380, lng: 108.150 },
  { id: 7, nama: "Kandanghaur", jumlah: 11, lat: -6.360, lng: 108.100 },
  { id: 8, nama: "Lohbener", jumlah: 16, lat: -6.360, lng: 108.280 },
  { id: 9, nama: "Patrol", jumlah: 10, lat: -6.360, lng: 108.430 },
  { id: 10, nama: "Gantar", jumlah: 8, lat: -6.520, lng: 108.100 },
  { id: 11, nama: "Krangkeng", jumlah: 12, lat: -6.480, lng: 108.510 },
  { id: 12, nama: "Kedokan Bunder", jumlah: 7, lat: -6.430, lng: 108.510 },
  { id: 13, nama: "Lelea", jumlah: 9, lat: -6.470, lng: 108.230 },
  { id: 14, nama: "Sliyeg", jumlah: 14, lat: -6.440, lng: 108.340 },
  { id: 15, nama: "Juntinyuat", jumlah: 18, lat: -6.420, lng: 108.390 },
  { id: 16, nama: "Widasari", jumlah: 10, lat: -6.440, lng: 108.270 },
  { id: 17, nama: "Cantigi", jumlah: 6, lat: -6.310, lng: 108.390 },
  { id: 18, nama: "Balongan", jumlah: 19, lat: -6.330, lng: 108.360 },
  { id: 19, nama: "Pasekan", jumlah: 7, lat: -6.300, lng: 108.340 },
  { id: 20, nama: "Sukagumiwang", jumlah: 9, lat: -6.470, lng: 108.260 },
  { id: 21, nama: "Kertasemaya", jumlah: 13, lat: -6.470, lng: 108.290 },
  { id: 22, nama: "Tukdana", jumlah: 11, lat: -6.450, lng: 108.250 },
  { id: 23, nama: "Arahan", jumlah: 7, lat: -6.410, lng: 108.370 },
  { id: 24, nama: "Bongas", jumlah: 8, lat: -6.380, lng: 108.080 },
  { id: 25, nama: "Cikedung", jumlah: 6, lat: -6.520, lng: 108.220 },
  { id: 26, nama: "Gabuswetan", jumlah: 9, lat: -6.420, lng: 108.190 },
  { id: 27, nama: "Kroya", jumlah: 8, lat: -6.530, lng: 108.150 },
  { id: 28, nama: "Anjatan", jumlah: 12, lat: -6.360, lng: 108.210 },
  { id: 29, nama: "Sukra", jumlah: 7, lat: -6.360, lng: 108.260 },
  { id: 30, nama: "Terisi", jumlah: 6, lat: -6.540, lng: 108.270 },
  { id: 31, nama: "Bangodua", jumlah: 5, lat: -6.460, lng: 108.320 },
];

// generator desa dummy
const buildDesaDummy = (list) => {
  const desa = {};
  list.forEach((kec) => {
    desa[kec.id] = Array.from({ length: 4 }).map((_, i) => ({
      nama: `Desa ${kec.nama} ${i + 1}`,
      lat: kec.lat + (Math.random() - 0.5) * 0.02,
      lng: kec.lng + (Math.random() - 0.5) * 0.02,
      jumlah: 1 + Math.floor(Math.random() * 5),
    }));
  });
  return desa;
};

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

const ZoomWatcher = ({ onZoomChange }) => {
  useMapEvents({
    zoomend: (e) => onZoomChange(e.target.getZoom()),
  });
  return null;
};

export default function PublicLanding() {
  const [selectedKecamatan, setSelectedKecamatan] = useState(null);
  const mapRef = useRef(null);

  const desaPerKecamatan = useMemo(() => buildDesaDummy(kecamatanIndramayu), []);

  const totalLks = kecamatanIndramayu.reduce((a, b) => a + b.jumlah, 0);

  const chartColors = [
    "#1d4ed8", "#0ea5e9", "#22c55e", "#6366f1", "#f97316", "#eab308",
    "#ec4899", "#14b8a6", "#0f766e", "#4f46e5", "#f97373", "#a855f7",
    "#10b981", "#3b82f6", "#fb923c", "#facc15", "#e11d48", "#0ea5e9",
    "#22c55e", "#6366f1", "#f97316", "#eab308", "#ec4899", "#14b8a6",
    "#0f766e", "#4f46e5", "#f97373", "#a855f7", "#10b981", "#3b82f6",
    "#fb923c",
  ];

  const chartSeries = kecamatanIndramayu.map((k) => k.jumlah);

  const chartOptions = {
    chart: { type: "donut", toolbar: { show: false } },
    labels: kecamatanIndramayu.map((k) => k.nama),
    colors: chartColors,
    stroke: { width: 2, colors: ["#fff"] },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
          labels: {
            show: true,
            total: { show: true, label: "Total LKS", formatter: () => totalLks },
          },
        },
      },
    },
  };

  const handleKecamatanClick = (kec) => {
    setSelectedKecamatan(kec);
    mapRef.current?.flyTo([kec.lat, kec.lng], 12);
  };

  return (
    <div className="bg-gradient-to-br from-[#e0f7fa] via-[#f2fbfc] to-[#e0f2f1] text-slate-700 min-h-screen flex flex-col">
      
      <NavbarPublic />

      {/* HERO */}
      <section className="relative flex flex-col-reverse md:flex-row items-center justify-between pt-28 md:pt-32 pb-16 px-6 md:px-16 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="max-w-xl">
          <h1 className="text-3xl md:text-5xl font-extrabold text-sky-800">
            Sistem Informasi Data Lembaga Kesejahteraan Sosial
          </h1>
          <p className="text-gray-600 mt-4">
            Platform resmi pendataan dan publikasi lembaga kesejahteraan di Kabupaten Indramayu.
          </p>

          <div className="flex gap-4 mt-6">
            <Link
              to="/login"
              className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold shadow-md flex items-center gap-2"
            >
              Masuk <ArrowRightCircle size={18} />
            </Link>

            <Link
              to="/register"
              className="px-6 py-3 bg-white hover:bg-sky-50 border border-sky-300 rounded-lg font-semibold"
            >
              Daftar LKS
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1 }} className="flex justify-center md:justify-end mb-10 md:mb-0">
          <img src="/logo.png" className="w-60 md:w-72 drop-shadow-lg" />
        </motion.div>
      </section>

      {/* STATISTIK */}
      <StatsSection totalLks={totalLks} />

      {/* ============================
          SECTION PETA (LKS)
      ============================ */}
      <section id="lks" className="py-20 px-6 md:px-12 bg-gradient-to-br from-sky-50 via-white to-cyan-50">
        <div className="max-w-6xl mx-auto mb-8">
          <h2 className="text-3xl font-bold text-sky-800">Sebaran Wilayah LKS</h2>
          <p className="text-gray-600">Persebaran titik lembaga sosial pada seluruh kecamatan.</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
          
          {/* MAP */}
          <div className="bg-white rounded-3xl shadow-lg border overflow-hidden">
            <MapContainer
              center={[-6.42, 108.30]}
              zoom={10}
              style={{ height: "420px", width: "100%" }}
              whenCreated={(map) => (mapRef.current = map)}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Marker kecamatan */}
              {kecamatanIndramayu.map((k, idx) => (
                <Marker
                  key={k.id}
                  position={[k.lat, k.lng]}
                  icon={generateMarkerIcon(chartColors[idx])}
                  eventHandlers={{ click: () => handleKecamatanClick(k) }}
                >
                  <Popup>
                    <b>{k.nama}</b><br />
                    {k.jumlah} LKS<br />
                    <button
                      onClick={() => handleKecamatanClick(k)}
                      className="text-blue-600 underline text-xs"
                    >
                      Lihat desa
                    </button>
                  </Popup>
                </Marker>
              ))}

              {/* Marker desa */}
              {selectedKecamatan &&
                desaPerKecamatan[selectedKecamatan.id].map((d, i) => (
                  <Marker key={i} position={[d.lat, d.lng]} icon={generateMarkerIcon("#3b82f6")}>
                    <Popup>
                      <b>{d.nama}</b><br />
                      {d.jumlah} LKS<br />
                      <span className="text-xs text-gray-500">Kec. {selectedKecamatan.nama}</span>
                    </Popup>
                  </Marker>
                ))}
            </MapContainer>
          </div>

          {/* SIDE INFO */}
          <div className="bg-white rounded-3xl shadow-lg border p-5 flex flex-col">
            <p className="text-xs text-sky-600 uppercase font-semibold">Ringkasan</p>
            <h3 className="text-xl font-bold text-slate-900 mt-1">Rekap Sebaran LKS</h3>
            <p className="text-sm text-slate-600 mt-2">
              Informasi resmi persebaran lembaga kesejahteraan sosial per kecamatan.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-sky-50 p-3 rounded-xl">
                <p className="text-[11px] text-sky-600 uppercase">Total Kecamatan</p>
                <p className="text-xl font-bold text-sky-800">{kecamatanIndramayu.length}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl">
                <p className="text-[11px] text-sky-600 uppercase">Total LKS</p>
                <p className="text-xl font-bold text-sky-800">{totalLks}</p>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 mt-4 border-t pt-3">
              Klik titik kecamatan untuk melihat sebaran desa.
            </p>
          </div>
        </div>
      </section>

      {/* ===================================
          GRAFIK DONUT
      =================================== */}
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
                  {kecamatanIndramayu.map((k, idx) => (
                    <div key={k.id} className="flex items-center gap-1.5">
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: chartColors[idx] }}
                      />
                      <span>{k.nama}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* tabel */}
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
                    {kecamatanIndramayu.map((k, idx) => {
                      const persen = ((k.jumlah / totalLks) * 100).toFixed(1);
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

      {/* KONTAK SECTION MODEL B */}
<section id="kontak" className="bg-sky-700 text-white py-20 px-6 md:px-12 text-center">
  <h2 className="text-3xl md:text-4xl font-bold mb-4">
    Hubungi Dinas Sosial Kabupaten Indramayu
  </h2>

  <p className="text-cyan-100 max-w-2xl mx-auto mb-10">
    Untuk informasi layanan, pendaftaran lembaga, dan bantuan sosial,
    hubungi kami melalui kontak resmi berikut:
  </p>

  <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

    {/* Alamat */}
    <div className="bg-sky-800/40 border border-sky-500/30 rounded-2xl p-6 shadow-lg backdrop-blur">
      <MapPin size={32} className="text-yellow-300 mx-auto mb-3" />
      <h3 className="font-bold text-lg mb-1">Alamat</h3>
      <p className="text-cyan-100 text-sm">
        Jl. Letnan Joni No. 1, Indramayu, Jawa Barat
      </p>
    </div>

    {/* Kontak */}
    <div className="bg-sky-800/40 border border-sky-500/30 rounded-2xl p-6 shadow-lg backdrop-blur">
      <ShieldCheck size={32} className="text-yellow-300 mx-auto mb-3" />
      <h3 className="font-bold text-lg mb-1">Kontak</h3>
      <p className="text-cyan-100 text-sm">0812-3456-7890</p>
    </div>

    {/* Email */}
    <div className="bg-sky-800/40 border border-sky-500/30 rounded-2xl p-6 shadow-lg backdrop-blur">
      <Users size={32} className="text-yellow-300 mx-auto mb-3" />
      <h3 className="font-bold text-lg mb-1">Email</h3>
      <p className="text-cyan-100 text-sm">dinsos@indramayukab.go.id</p>
    </div>
  </div>
</section>


      <footer className="bg-sky-900 text-white py-6 text-center border-t border-sky-800 shadow-inner">
  <div className="text-sm tracking-wide">
    © {new Date().getFullYear()} · 
    <span className="font-semibold text-yellow-300"> SIDALEKAS</span>
  </div>
  <p className="text-xs text-sky-200 mt-1">
    Dinas Sosial Kabupaten Indramayu
  </p>
</footer>
    </div>
  );
}

// --------------------------------------
// STATISTIK — dipisah
// --------------------------------------
function StatsSection({ totalLks }) {
  return (
    <section className="bg-white shadow-inner py-16 px-6 md:px-12 rounded-t-[3rem]">
      <h2 className="text-3xl font-bold text-center text-sky-800 mb-10">
        Statistik Sosial Kabupaten Indramayu
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[
          { title: "Total LKS Terdaftar", value: totalLks, icon: Building2 },
          { title: "Total Klien Terdata", value: 487, icon: Users },
          { title: "Total Petugas Lapangan", value: 92, icon: ShieldCheck },
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
