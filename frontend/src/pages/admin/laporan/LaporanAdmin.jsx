import React, { useState } from "react";
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

export default function LaporanAdmin() {
  const [periode, setPeriode] = useState("bulan");
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [bulan, setBulan] = useState(null);
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

  const loadLaporan = async () => {
    setLoading(true);

    // PARAMETER PERIODE
    let params = { periode, tahun };

    if (periode !== "tahun") {
      params.bulan = bulan ? Number(bulan) : null;
    }

    try {
      const res = await api.get("/admin/laporan", { params });
      setData(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Gagal memuat laporan");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-sky-700 mb-6">
        Laporan Administrasi Kabupaten
      </h1>

      {/* FILTER */}
      <div className="bg-white p-5 rounded-lg shadow mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Periode */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Periode
            </label>
            <select
              className="w-full border rounded px-3 py-2 text-sm"
              value={periode}
              onChange={(e) => {
                setPeriode(e.target.value);
                setBulan(null); // reset bulan
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
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              type="number"
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
            />
          </div>

          {/* Bulan / Triwulan */}
          {periode !== "tahun" && (
            <div>
              <label className="text-sm font-medium text-slate-700">
                {periode === "bulan" ? "Bulan" : "Triwulan"}
              </label>

              {periode === "bulan" ? (
                <select
                  className="border px-3 py-2 rounded-md w-full"
                  value={bulan || ""}
                  onChange={(e) => setBulan(Number(e.target.value))}
                >
                  <option value="">Pilih Bulan</option>
                  {bulanList.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  className="border px-3 py-2 rounded-md w-full"
                  value={bulan || ""}
                  onChange={(e) => setBulan(Number(e.target.value))}
                >
                  <option value="">Pilih Triwulan</option>
                  <option value={1}>Triwulan 1</option>
                  <option value={2}>Triwulan 2</option>
                  <option value={3}>Triwulan 3</option>
                  <option value={4}>Triwulan 4</option>
                </select>
              )}
            </div>
          )}

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

            {/* EXPORT PDF */}
            <button
              onClick={() =>
                api
                  .get("/admin/laporan/export/pdf", {
                    params: { periode, tahun, bulan },
                    responseType: "blob",
                  })
                  .then((res) => {
                    const url = window.URL.createObjectURL(
                      new Blob([res.data])
                    );
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "laporan-admin.pdf");
                    document.body.appendChild(link);
                    link.click();
                  })
              }
              className="bg-red-600 hover:bg-red-700 text-white rounded px-4 py-2"
            >
              PDF
            </button>

            {/* EXPORT EXCEL */}
            <button
              onClick={() =>
                api
                  .get("/admin/laporan/export/excel", {
                    params: { periode, tahun, bulan },
                    responseType: "blob",
                  })
                  .then((res) => {
                    const url = window.URL.createObjectURL(
                      new Blob([res.data])
                    );
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "laporan-admin.xlsx");
                    document.body.appendChild(link);
                    link.click();
                  })
              }
              className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2"
            >
              Excel
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg p-5">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Rekapitulasi Per Kecamatan
        </h2>

        {data.length === 0 ? (
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
                  <th className="border px-3 py-2">Klien Aktif</th>
                  <th className="border px-3 py-2">Klien Tidak Aktif</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="border px-3 py-2">{row.kecamatan}</td>
                    <td className="border px-3 py-2 text-center">
                      {row.lks_valid}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      {row.lks_tidak_valid}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      {row.lks_proses}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      {row.klien_aktif}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      {row.klien_tidak_aktif}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CHART */}
        {data.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Grafik LKS per Kecamatan
            </h3>

            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="kecamatan" />
                <YAxis />

                <Tooltip />

                <Bar dataKey="lks_valid" name="LKS Valid" fill="#10b981" />
                <Bar
                  dataKey="lks_tidak_valid"
                  name="LKS Tidak Valid"
                  fill="#ef4444"
                />
                <Bar dataKey="lks_proses" name="LKS Proses" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
