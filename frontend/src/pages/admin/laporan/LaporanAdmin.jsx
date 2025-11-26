import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import { Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export default function LaporanAdmin() {
  const navigate = useNavigate();

  const [periode, setPeriode] = useState("bulan");
  const [tahun, setTahun] = useState(null);
  const [tahunList, setTahunList] = useState([]);
  const [bulan, setBulan] = useState(null);
  const [kecamatan, setKecamatan] = useState("");

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const bulanList = [
    { label: "Januari", value: 1 },
    { label: "Februari", value: 2 },
    { label: "Maret", value: 3 },
    { label: "April", value: 4 },
    { label: "Mei", value: 5 },
    { label: "Juni", value: 6 },
    { label: "Juli", value: 7 },
    { label: "Agustus", value: 8 },
    { label: "September", value: 9 },
    { label: "Oktober", value: 10 },
    { label: "November", value: 11 },
    { label: "Desember", value: 12 },
  ];

  // ================================
  // LOAD LAPORAN
  // ================================
  const loadLaporan = async () => {
    if (!tahun) return;

    setLoading(true);

    let params = { periode, tahun };
    if (periode !== "tahun") params.bulan = bulan;

    try {
      const res = await api.get("/admin/laporan", { params });
      setData(res.data.data || []);
      setTahunList(res.data.tahun_list || []);
    } catch (err) {
      console.error(err);
      alert("Gagal memuat laporan");
    }

    setLoading(false);
  };

  // SET DEFAULT BULAN + TAHUN
  useEffect(() => {
    const now = new Date();
    setBulan(now.getMonth() + 1);
    setTahun(now.getFullYear());
  }, []);

  useEffect(() => {
    if (bulan && tahun) loadLaporan();
  }, [bulan, tahun]);

  // ================================
  // FILTER DATA KECAMATAN
  // ================================
  const filteredData = kecamatan
    ? data.filter((d) => d.kecamatan === kecamatan)
    : data;

  // ================================
  // EXPORT FUNCTION
  // ================================
  const buildQuery = () =>
    new URLSearchParams({
      periode,
      tahun,
      bulan: periode === "tahun" ? "" : bulan,
      kecamatan,
    }).toString();

  const exportPDF = () => {
    window.open(`${API}/admin/laporan/export/pdf?${buildQuery()}`, "_blank");
  };

  const exportExcel = () => {
    window.open(`${API}/admin/laporan/export/excel?${buildQuery()}`, "_blank");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-sky-700">
          Laporan Administrasi Kabupaten
        </h1>

        <div className="flex gap-3">
          <button
            onClick={exportPDF}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded shadow"
          >
            Export PDF
          </button>

          <button
            onClick={exportExcel}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow"
          >
            Export Excel
          </button>

          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
          >
            Kembali
          </button>
        </div>
      </div>

      {/* FILTER */}
      <div className="bg-white p-5 rounded-lg shadow mb-6">
        <div className="grid md:grid-cols-5 gap-4">
          {/* PERIODE */}
          <div>
            <label className="text-sm font-medium text-slate-700">Periode</label>
            <select
              className="w-full border rounded px-3 py-2 text-sm"
              value={periode}
              onChange={(e) => {
                setPeriode(e.target.value);
                setBulan(null);
              }}
            >
              <option value="bulan">Bulanan</option>
              <option value="triwulan">Triwulan</option>
              <option value="tahun">Tahunan</option>
            </select>
          </div>

          {/* TAHUN */}
          <div>
            <label className="text-sm font-medium text-slate-700">Tahun</label>
            <select
              className="w-full border rounded px-3 py-2 text-sm"
              value={tahun || ""}
              onChange={(e) => setTahun(Number(e.target.value))}
            >
              <option value="">Pilih Tahun</option>
              {tahunList.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* BULAN / TRIWULAN */}
          {periode !== "tahun" && (
            <div>
              <label className="text-sm font-medium text-slate-700">
                {periode === "bulan" ? "Bulan" : "Triwulan"}
              </label>

              <select
                className="border px-3 py-2 rounded-md w-full"
                value={bulan || ""}
                onChange={(e) => setBulan(Number(e.target.value))}
              >
                <option value="">
                  {periode === "bulan" ? "Pilih Bulan" : "Pilih Triwulan"}
                </option>

                {periode === "bulan"
                  ? bulanList.map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))
                  : [1, 2, 3, 4].map((tw) => (
                      <option key={tw} value={tw}>
                        Triwulan {tw}
                      </option>
                    ))}
              </select>
            </div>
          )}

          {/* KECAMATAN */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Kecamatan
            </label>
            <select
              className="w-full border rounded px-3 py-2 text-sm"
              value={kecamatan}
              onChange={(e) => setKecamatan(e.target.value)}
            >
              <option value="">Semua Kecamatan</option>
              {data.map((k, i) => (
                <option key={i} value={k.kecamatan}>
                  {k.kecamatan}
                </option>
              ))}
            </select>
          </div>

          {/* TOMBOL TAMPILKAN */}
          <div className="flex items-end gap-2">
            <button
              onClick={loadLaporan}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white rounded px-4 py-2 flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Tampilkan"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ===================== */}
      {/* TABEL LKS */}
      {/* ===================== */}
      <div className="bg-white shadow rounded-lg p-5 mb-10">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Rekapitulasi LKS per Kecamatan
        </h2>

        {filteredData.length === 0 ? (
          <p className="text-center text-slate-500 italic">Tidak ada data.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead className="bg-slate-100">
                <tr>
                  <th className="border px-3 py-2">Kecamatan</th>
                  <th className="border px-3 py-2">LKS Valid</th>
                  <th className="border px-3 py-2">LKS Tidak Valid</th>
                  <th className="border px-3 py-2">LKS Proses</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="border px-3 py-2">{row.kecamatan}</td>
                    <td className="border px-3 py-2 text-center">{row.lks_valid}</td>
                    <td className="border px-3 py-2 text-center">{row.lks_tidak_valid}</td>
                    <td className="border px-3 py-2 text-center">{row.lks_proses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredData.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Grafik LKS per Kecamatan
            </h3>

            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="kecamatan" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="lks_valid" fill="#10b981" />
                <Bar dataKey="lks_tidak_valid" fill="#ef4444" />
                <Bar dataKey="lks_proses" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* ===================== */}
      {/* TABEL KLIEN */}
      {/* ===================== */}
      <div className="bg-white shadow rounded-lg p-5">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Rekapitulasi Klien per Kecamatan
        </h2>

        {filteredData.length === 0 ? (
          <p className="text-center text-slate-500 italic">Tidak ada data.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead className="bg-slate-100">
                <tr>
                  <th className="border px-3 py-2">Kecamatan</th>
                  <th className="border px-3 py-2">Klien Aktif</th>
                  <th className="border px-3 py-2">Klien Tidak Aktif</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="border px-3 py-2">{row.kecamatan}</td>
                    <td className="border px-3 py-2 text-center">{row.klien_aktif}</td>
                    <td className="border px-3 py-2 text-center">{row.klien_tidak_aktif}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredData.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Grafik Klien per Kecamatan
            </h3>

            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="kecamatan" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="klien_aktif" fill="#06b6d4" />
                <Bar dataKey="klien_tidak_aktif" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
