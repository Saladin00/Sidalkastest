import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import { Loader2 } from "lucide-react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

export default function LaporanOperator() {
  const navigate = useNavigate();

  const [periode, setPeriode] = useState("bulan");
  const [tahun, setTahun] = useState(null);
  const [bulan, setBulan] = useState(null);

  const [tahunList, setTahunList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const bulanList = [
    { value: 1, label: "Januari" },
    { value: 2, label: "Februari" },
    { value: 3, label: "Maret" },
    { value: 4, label: "April" },
    { value: 5, label: "Mei" },
    { value: 6, label: "Juni" },
    { value: 7, label: "Juli" },
    { value: 8, label: "Agustus" },
    { value: 9, label: "September" },
    { value: 10, label: "Oktober" },
    { value: 11, label: "November" },
    { value: 12, label: "Desember" },
  ];

  const loadLaporan = async () => {
    if (!tahun || !bulan) return;

    setLoading(true);
    try {
      const res = await api.get("/operator/laporan", {
        params: { periode, tahun, bulan },
      });

      setData(res.data);
      setTahunList(res.data.tahun_list || []);
    } catch (err) {
      alert("Gagal memuat laporan operator");
      console.error(err);
    }
    setLoading(false);
  };

  // 🔥 AUTO SET DEFAULT BULAN + TAHUN SAAT MASUK HALAMAN
  useEffect(() => {
    const now = new Date();
    setBulan(now.getMonth() + 1);
    setTahun(now.getFullYear());
  }, []);

  // 🔥 AUTO LOAD LAPORAN SAAT DEFAULT TERISI
  useEffect(() => {
    if (tahun && bulan) loadLaporan();
  }, [tahun, bulan]);

  const COLORS_LKS = ["#10b981", "#ef4444", "#3b82f6"];
  const COLORS_KLIEN = ["#10b981", "#9ca3af"];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-emerald-700">
          Laporan Kecamatan (Operator)
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
        >
          Kembali
        </button>
      </div>

      {/* FILTER */}
      <div className="bg-white p-5 rounded-lg shadow mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          
          {/* Periode */}
          <div>
            <label className="text-sm font-medium">Periode</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={periode}
              onChange={(e) => setPeriode(e.target.value)}
            >
              <option value="bulan">Bulanan</option>
              <option value="triwulan">Triwulan</option>
              <option value="tahun">Tahunan</option>
            </select>
          </div>

          {/* Tahun */}
          <div>
            <label className="text-sm font-medium">Tahun</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={tahun || ""}
              onChange={(e) => setTahun(Number(e.target.value))}
            >
              <option value="">Pilih Tahun</option>
              {tahunList.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Bulan */}
          {periode !== "tahun" && (
            <div>
              <label className="text-sm font-medium">
                {periode === "bulan" ? "Bulan" : "Triwulan (1–4)"}
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
                  : [1,2,3,4].map((tw) => (
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
              onClick={loadLaporan}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Terapkan"}
            </button>
          </div>

        </div>
      </div>

      {/* ======================= */}
      {/*        DATA             */}
      {/* ======================= */}
      {data && (
        <div className="bg-white p-6 rounded-lg shadow space-y-10">

          {/* ============================
              LKS SECTION
          ============================= */}
          <h2 className="text-xl font-semibold text-slate-700">
            Rekap Status LKS
          </h2>

          <table className="w-full text-sm border mb-6">
            <tbody>
              <tr>
                <td className="border px-3 py-2">LKS Valid</td>
                <td className="border px-3 py-2 text-right">
                  {data.data.lks_valid}
                </td>
              </tr>
              <tr>
                <td className="border px-3 py-2">LKS Tidak Valid</td>
                <td className="border px-3 py-2 text-right">
                  {data.data.lks_tidak_valid}
                </td>
              </tr>
              <tr>
                <td className="border px-3 py-2">LKS Proses</td>
                <td className="border px-3 py-2 text-right">
                  {data.data.lks_proses}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Chart LKS */}
          <h3 className="text-lg font-semibold text-slate-700 mb-3">
            Grafik Status LKS
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "Valid", value: data.data.lks_valid },
                  { name: "Tidak Valid", value: data.data.lks_tidak_valid },
                  { name: "Proses", value: data.data.lks_proses },
                ]}
                dataKey="value"
                outerRadius={110}
                label
              >
                {COLORS_LKS.map((c, i) => (
                  <Cell key={i} fill={c} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* ============================
              KLIEN SECTION
          ============================= */}
          <h2 className="text-xl font-semibold text-slate-700 mt-10">
            Rekap Status Klien
          </h2>

          <table className="w-full text-sm border">
            <tbody>
              <tr>
                <td className="border px-3 py-2">Klien Aktif</td>
                <td className="border px-3 py-2 text-right">
                  {data.data.klien_aktif}
                </td>
              </tr>
              <tr>
                <td className="border px-3 py-2">Klien Tidak Aktif</td>
                <td className="border px-3 py-2 text-right">
                  {data.data.klien_tidak_aktif}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Chart Klien */}
          <h3 className="text-lg font-semibold text-slate-700 mb-3 mt-5">
            Grafik Status Klien
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "Aktif", value: data.data.klien_aktif },
                  { name: "Tidak Aktif", value: data.data.klien_tidak_aktif },
                ]}
                dataKey="value"
                outerRadius={110}
                label
              >
                <Cell fill="#10b981" />
                <Cell fill="#9ca3af" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

        </div>
      )}
    </div>
  );
}
