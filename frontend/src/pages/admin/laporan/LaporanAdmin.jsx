import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import {
  Loader2,
  FileDown,
  FileSpreadsheet,
  BarChart3,
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
import AdminLayout from "../../../components/AdminLayout";

export default function LaporanAdmin() {
  const [periode, setPeriode] = useState("bulan");
  const [tahun, setTahun] = useState(null);
  const [bulan, setBulan] = useState(null);
  const [kecamatan, setKecamatan] = useState("");

  const [tahunList, setTahunList] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

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
    if (!tahun) return toast.warning("Silakan pilih tahun terlebih dahulu.");

    setLoading(true);

    let params = { periode, tahun };
    if (periode !== "tahun") params.bulan = bulan;

    try {
      const res = await api.get("/admin/laporan", { params });
      setData(res.data.data || []);
      setTahunList(res.data.tahun_list || []);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat laporan admin.");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // EXPORT PDF/EXCEL
  // ================================
  const exportAll = async (type) => {
    const endpoint =
      type === "pdf"
        ? "/admin/laporan/export/pdf"
        : "/admin/laporan/export/excel";

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
        type === "pdf" ? "laporan-admin.pdf" : "laporan-admin.xlsx"
      );

      document.body.appendChild(link);
      link.click();

      toast.success(`Laporan ${type.toUpperCase()} berhasil diunduh.`);
    } catch (err) {
      console.error(err);
      toast.error(`Gagal mengekspor laporan ${type.toUpperCase()}.`);
    }
  };

  // ================================
  // SET DEFAULT BULAN & TAHUN
  // ================================
  useEffect(() => {
    const now = new Date();
    setBulan(now.getMonth() + 1);
    setTahun(now.getFullYear());
  }, []);

  useEffect(() => {
    if (bulan && tahun) loadLaporan();
  }, [bulan, tahun]);

  // ================================
  // FILTER DATA
  // ================================
  const filteredData = kecamatan
    ? data.filter((d) => d.kecamatan === kecamatan)
    : data;

  // ================================
  // CHART WRAPPER FIXED
  // ================================
  const ChartWrapper = ({ children, title, dataAvailable }) => (
  <div className="rounded-2xl p-6 shadow-md border border-slate-200 bg-white mb-10">

    <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>

    <div
      className="relative bg-white rounded-xl border border-slate-100 shadow-inner p-4"
      style={{
        width: "100%",
        minHeight: "350px",
      }}
    >
      {dataAvailable ? (
        <ResponsiveContainer width="100%" height={300}>
          {children}
        </ResponsiveContainer>
      ) : (
        <div className="w-full h-[300px] flex items-center justify-center text-slate-400 italic">
          Belum ada data
        </div>
      )}
    </div>

  </div>
);

  // ================================
  // RENDER UTAMA
  // ================================
  return (
    <AdminLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold text-slate-800 mb-8">
          Laporan Administrasi Kabupaten
        </h1>

        {/* ========== FILTER ========== */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 mb-8">
          <div className="grid md:grid-cols-5 gap-4">

            {/* Periode */}
            <div>
              <label className="text-sm font-medium">Periode</label>
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
              <label className="text-sm font-medium">Tahun</label>
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm"
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

            {/* Bulan/Triwulan */}
            {periode !== "tahun" && (
              <div>
                <label className="text-sm font-medium">
                  {periode === "bulan" ? "Bulan" : "Triwulan"}
                </label>
                <select
                  className="w-full border rounded-lg px-3 py-2 text-sm"
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

            {/* Kecamatan */}
            <div>
              <label className="text-sm font-medium">Kecamatan</label>
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={kecamatan}
                onChange={(e) => setKecamatan(e.target.value)}
              >
                <option value="">Semua Kecamatan</option>
                {data.map((d, i) => (
                  <option key={i} value={d.kecamatan}>
                    {d.kecamatan}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={loadLaporan}
                disabled={loading}
                className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center justify-center"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Tampilkan"}
              </button>
            </div>
          </div>
        </div>

        {/* ========== TABEL LKS ========== */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <BarChart3 /> Rekapitulasi LKS per Kecamatan
            </h2>

            <div className="flex gap-2">
              <button
                onClick={() => exportAll("pdf")}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <FileDown size={16} /> PDF
              </button>

              <button
                onClick={() => exportAll("excel")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <FileSpreadsheet size={16} /> Excel
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="border px-3 py-2 w-10">No</th>
                  <th className="border px-3 py-2">Kecamatan</th>
                  <th className="border px-3 py-2">LKS Valid</th>
                  <th className="border px-3 py-2">LKS Tidak Valid</th>
                  <th className="border px-3 py-2">LKS Proses</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((r, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                    >
                      <td className="border px-3 py-2 text-center">{i + 1}</td>
                      <td className="border px-3 py-2">{r.kecamatan}</td>
                      <td className="border px-3 py-2 text-center">{r.lks_valid}</td>
                      <td className="border px-3 py-2 text-center">
                        {r.lks_tidak_valid}
                      </td>
                      <td className="border px-3 py-2 text-center">{r.lks_proses}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-slate-400 italic">
                      Belum ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========== GRAFIK LKS ========== */}
        <ChartWrapper
          title="Grafik LKS per Kecamatan"
          dataAvailable={filteredData.length > 0}
        >
          <BarChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="kecamatan" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="lks_valid" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="lks_tidak_valid" fill="#ef4444" radius={[8, 8, 0, 0]} />
            <Bar dataKey="lks_proses" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartWrapper>

        {/* ========== GRAFIK KLIEN ========== */}
        <ChartWrapper
          title="Grafik Klien per Kecamatan"
          dataAvailable={filteredData.length > 0}
        >
          <BarChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="kecamatan" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="klien_aktif" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            <Bar dataKey="klien_tidak_aktif" fill="#f59e0b" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartWrapper>
      </div>
    </AdminLayout>
  );
}
