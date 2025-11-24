import React, { useState } from "react";
import api from "../../../utils/api";
import { Loader2 } from "lucide-react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function LaporanOperator() {
  const [periode, setPeriode] = useState("bulan");
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [bulan, setBulan] = useState("");
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
    setLoading(true);
    try {
      const res = await api.get("/operator/laporan", {
        params: { periode, tahun, bulan },
      });
      setData(res.data);
    } catch (err) {
      alert("Gagal memuat laporan operator");
      console.error(err);
    }
    setLoading(false);
  };

  const COLORS = ["#10b981", "#ef4444", "#3b82f6"];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-emerald-700 mb-6">
        Laporan Kecamatan (Operator)
      </h1>

      {/* FILTER */}
      <div className="bg-white p-5 rounded-lg shadow mb-6">
        <div className="grid md:grid-cols-4 gap-4">
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

          <div>
            <label className="text-sm font-medium">Tahun</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
            />
          </div>

          {periode !== "tahun" && (
            <div>
              <label className="text-sm font-medium">
                {periode === "bulan" ? "Bulan" : "Triwulan (1–4)"}
              </label>

              <select
                className="border px-3 py-2 rounded-md w-full"
                value={bulan}
                onChange={(e) => setBulan(e.target.value)}
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

          <div className="flex items-end gap-2">
            <button
              onClick={loadLaporan}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Tampilkan"}
            </button>

            {/* PDF */}
            <button
              onClick={() =>
                api
                  .get("/operator/laporan/export/pdf", {
                    params: { periode, tahun, bulan },
                    responseType: "blob",
                  })
                  .then((res) => {
                    const url = window.URL.createObjectURL(
                      new Blob([res.data])
                    );
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "laporan-operator.pdf");
                    document.body.appendChild(link);
                    link.click();
                  })
              }
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              PDF
            </button>

            {/* EXCEL */}
            <button
              onClick={() =>
                api
                  .get("/operator/laporan/export/excel", {
                    params: { periode, tahun, bulan },
                    responseType: "blob",
                  })
                  .then((res) => {
                    const url = window.URL.createObjectURL(
                      new Blob([res.data])
                    );
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "laporan-operator.xlsx");
                    document.body.appendChild(link);
                    link.click();
                  })
              }
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Excel
            </button>
          </div>
        </div>
      </div>

      {/* DATA */}
      {data && (
        <div className="bg-white p-6 rounded-lg shadow space-y-10">
          {/* ============================
              BAGIAN LKS
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
                <td className="border px-3 py-2">LKS Proses Verifikasi</td>
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
                {COLORS.map((color, idx) => (
                  <Cell key={idx} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* ============================
              BAGIAN KLIEN
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
