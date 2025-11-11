import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVerifikasiById, getVerifikasiLogs } from "@/services/verifikasiApi";
import VerificationBadge from "@/components/shared/VerificationBadge";

export default function VerifikasiDetail() {
  const { id } = useParams(); // ID Verifikasi
  const navigate = useNavigate();

  const [verifikasi, setVerifikasi] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const detail = await getVerifikasiById(id);
        setVerifikasi(detail);

        // Ambil logs (riwayat aktivitas)
        const logData = await getVerifikasiLogs(id);
        setLogs(logData);
      } catch (err) {
        console.error(err);
        alert("Gagal memuat detail verifikasi!");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) return <div className="p-4">Memuat data...</div>;
  if (!verifikasi) return <div className="p-4 text-gray-500">Data tidak ditemukan.</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-blue-700">
          Detail Verifikasi #{verifikasi.id}
        </h1>
        <VerificationBadge status={verifikasi.status} />
      </div>

      {/* Info LKS */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">LKS:</p>
        <p className="font-semibold text-gray-800">
          {verifikasi.lks?.nama || `LKS #${verifikasi.lks_id}`}
        </p>
      </div>

      {/* Info Petugas & Tanggal */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Petugas:</p>
          <p className="font-medium text-gray-800">
            {verifikasi.petugas?.name || "Tidak diketahui"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Tanggal Verifikasi:</p>
          <p className="font-medium text-gray-800">
            {new Date(verifikasi.tanggal_verifikasi).toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Penilaian */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">Penilaian:</p>
        <div className="border rounded p-3 bg-gray-50">
          {verifikasi.penilaian || <em>Tidak ada penilaian</em>}
        </div>
      </div>

      {/* Catatan */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">Catatan:</p>
        <div className="border rounded p-3 bg-gray-50 whitespace-pre-wrap">
          {verifikasi.catatan || <em>Tidak ada catatan</em>}
        </div>
      </div>

      {/* Foto Bukti */}
      {verifikasi.foto_bukti?.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Foto Bukti Lapangan:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {verifikasi.foto_bukti.map((path, i) => (
              <a
                key={i}
                href={`${import.meta.env.VITE_API_URL}/storage/${path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block border rounded overflow-hidden"
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}/storage/${path}`}
                  alt={`Foto ${i + 1}`}
                  className="w-full h-40 object-cover hover:opacity-90"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Log Aktivitas */}
      <div className="mt-6">
        <p className="text-sm font-semibold text-gray-700 mb-2">
          Riwayat Aktivitas:
        </p>
        {logs.length === 0 ? (
          <p className="text-gray-500 text-sm">Belum ada log aktivitas.</p>
        ) : (
          <ul className="border rounded divide-y">
            {logs.map((log) => (
              <li key={log.id} className="p-2 text-sm">
                <p>
                  <span className="font-semibold">{log.user?.name}</span>{" "}
                  melakukan <b>{log.aksi}</b>
                </p>
                <p className="text-gray-500">{log.keterangan}</p>
                <p className="text-xs text-gray-400">
                  {new Date(log.created_at).toLocaleString("id-ID")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 text-right">
        <button
          onClick={() => navigate("/petugas/verifikasi")}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
        >
          ← Kembali ke Daftar
        </button>
      </div>
    </div>
  );
}
