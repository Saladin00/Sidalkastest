import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import {
  Loader2,
  FileDown,
  FileSpreadsheet,
  BarChart3,
  Users,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

import { toast } from "react-toastify";
import OperatorLayout from "../../../components/OperatorLayout";
import useChartContainer from "../../../hooks/useChartContainer";

export default function OperatorLaporan() {
  const [periode, setPeriode] = useState("bulan");
  const [tahun, setTahun] = useState(null);
  const [bulan, setBulan] = useState(null);
  const [tahunList, setTahunList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

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

  // ==========================
  // LOAD DATA
  // ==========================
  const loadLaporan = async (auto = false) => {
    if (!tahun) {
      if (!auto) toast.warning("Silakan pilih tahun terlebih dahulu.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.get("/operator/laporan", {
        params: { periode, tahun, bulan },
      });

      const d = res.data.data || {};

      // Operator hanya punya satu kecamatan → jadikan array 1 row
      setData([
        {
          kecamatan: res.data.kecamatan || "Wilayah Anda",
          lks_valid: d.lks_valid || 0,
          lks_tidak_valid: d.lks_tidak_valid || 0,
          lks_proses: d.lks_proses || 0,
          klien_aktif: d.klien_aktif || 0,
          klien_tidak_aktif: d.klien_tidak_aktif || 0,
        },
      ]);

      setTahunList(res.data.tahun_list || []);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat laporan operator.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // EXPORT PDF / EXCEL
  // ==========================
  const exportAll = async (type) => {
    const endpoint =
      type === "pdf"
        ? "/operator/laporan/export/pdf"
        : "/operator/laporan/export/excel";

    try {
      const res = await api.get(endpoint, {
        params: { periode, tahun, bulan },
        responseType: "blob",
      });

      const blob = new Blob([res.data], {
        type:
          type === "pdf"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        type === "pdf"
          ? "laporan-operator.pdf"
          : "laporan-operator.xlsx"
      );
      document.body.appendChild(link);
      link.click();

      toast.success(`Laporan ${type.toUpperCase()} berhasil diunduh.`);
    } catch (err) {
      console.error(err);
      toast.error(`Gagal mengekspor laporan ${type.toUpperCase()}.`);
    }
  };

  // ==========================
  // INIT → bulan & tahun sekarang
  // ==========================
  useEffect(() => {
    const now = new Date();
    setBulan(now.getMonth() + 1);
    setTahun(now.getFullYear());
  }, []);

  // Load otomatis ketika bulan & tahun siap
  useEffect(() => {
    if (tahun && bulan) loadLaporan(true);
  }, [tahun, bulan]);

  const { ref, ready } = useChartContainer();

  // ==========================
  // Chart Wrapper
  // ==========================
  const ChartWrapper = ({ children, title }) => (
    <div className="relative rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-500 border border-slate-200 bg-gradient-to-br from-white via-sky-50 to-blue-50 overflow-hidden mb-8">
      <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-sky-500 via-blue-400 to-cyan-400 rounded-t-2xl opacity-80" />
      <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>

      <div
        ref={ref}
        className="relative w-full h-[400px] bg-white rounded-xl border border-slate-100 shadow-inner"
      >
        {data && ready ? (
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 italic">
            {data ? "Menyiapkan grafik..." : "Belum ada data"}
          </div>
        )}
      </div>
    </div>
  );

  // ==========================
  // UI (Render)
  // ==========================
  return (
    <OperatorLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold text-slate-800 mb-8 tracking-tight">
          Laporan Wilayah Operator
        </h1>

        {/* FILTER */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">

            {/* Periode */}
            <div>
              <label className="text-sm font-medium text-slate-700">Periode</label>
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm"
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

            {/* Tahun */}
            <div>
              <label className="text-sm font-medium text-slate-700">Tahun</label>
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={tahun || ""}
                onChange={(e) => setTahun(Number(e.target.value))}
              >
                <option value="">Pilih Tahun</option>
                {tahunList.length > 0
                  ? tahunList.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))
                  : (
                    <option value={new Date().getFullYear()}>
                      {new Date().getFullYear()}
                    </option>
                  )}
              </select>
            </div>

            {/* Bulan / Triwulan */}
            {periode !== "tahun" && (
              <div>
                <label className="text-sm font-medium text-slate-700">
                  {periode === "bulan" ? "Bulan" : "Triwulan"}
                </label>
                <select
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  value={bulan || ""}
                  onChange={(e) => setBulan(Number(e.target.value))}
                >
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

            {/* Tombol */}
            <div className="flex items-end">
              <button
                onClick={() => loadLaporan()}
                disabled={loading}
                className="w-full bg-gradient-to-r from-sky-600 to-blue-500 hover:from-sky-700 hover:to-blue-600 text-white rounded-lg px-4 py-2 flex items-center justify-center transition"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Tampilkan"}
              </button>
            </div>

          </div>
        </div>

        {/* ====== TABEL ====== */}
        {data && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-10">

            {/* Header + Action */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <Users size={20} /> Ringkasan Data Wilayah
              </h2>

              <div className="flex gap-2">
                <button
                  onClick={() => exportAll("pdf")}
                  className="bg-gradient-to-r from-rose-600 via-pink-500 to-amber-400 hover:brightness-110 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-md transition-all"
                >
                  <FileDown size={16} /> PDF
                </button>

                <button
                  onClick={() => exportAll("excel")}
                  className="bg-gradient-to-r from-emerald-600 via-teal-500 to-green-400 hover:brightness-110 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-md transition-all"
                >
                  <FileSpreadsheet size={16} /> Excel
                </button>
              </div>
            </div>

            {/* Table */}
            <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-gradient-to-r from-blue-100 via-sky-100 to-cyan-100 text-slate-700">
                <tr>
                  <th className="border px-3 py-2">Kecamatan</th>
                  <th className="border px-3 py-2">LKS Valid</th>
                  <th className="border px-3 py-2">LKS Tidak Valid</th>
                  <th className="border px-3 py-2">LKS Proses</th>
                  <th className="border px-3 py-2">Klien Aktif</th>
                  <th className="border px-3 py-2">Klien Tidak Aktif</th>
                </tr>
              </thead>

              <tbody>
                {data.map((r, i) => (
                  <tr key={i} className="hover:bg-blue-50 transition-all duration-200">
                    <td className="border px-3 py-2 font-medium text-slate-800">
                      {r.kecamatan}
                    </td>
                    <td className="border px-3 py-2 text-center text-sky-700 font-semibold">
                      {r.lks_valid}
                    </td>
                    <td className="border px-3 py-2 text-center text-pink-600 font-semibold">
                      {r.lks_tidak_valid}
                    </td>
                    <td className="border px-3 py-2 text-center text-emerald-600 font-semibold">
                      {r.lks_proses}
                    </td>
                    <td className="border px-3 py-2 text-center text-cyan-700 font-semibold">
                      {r.klien_aktif}
                    </td>
                    <td className="border px-3 py-2 text-center text-amber-600 font-semibold">
                      {r.klien_tidak_aktif}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ====== GRAFIK ====== */}
        {data && (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-slate-200 p-8">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-6">
              <BarChart3 size={20} /> Grafik Wilayah {data?.[0]?.kecamatan}
            </h2>

            {/* Grafik LKS */}
            <ChartWrapper title="Grafik LKS">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="kecamatan" tick={{ fontSize: 12, fill: "#475569" }} />
                <YAxis tick={{ fill: "#475569" }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="lks_valid" name="Valid" fill="#3b82f6" radius={[10, 10, 0, 0]} />
                <Bar dataKey="lks_tidak_valid" name="Tidak Valid" fill="#f472b6" radius={[10, 10, 0, 0]} />
                <Bar dataKey="lks_proses" name="Proses" fill="#10b981" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ChartWrapper>

            {/* Grafik Klien */}
            <ChartWrapper title="Grafik Klien">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="kecamatan" tick={{ fontSize: 12, fill: "#475569" }} />
                <YAxis tick={{ fill: "#475569" }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="klien_aktif" name="Aktif" fill="#06b6d4" radius={[10, 10, 0, 0]} />
                <Bar dataKey="klien_tidak_aktif" name="Tidak Aktif" fill="#f59e0b" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ChartWrapper>
          </div>
        )}
      </div>
    </OperatorLayout>
  );
}
