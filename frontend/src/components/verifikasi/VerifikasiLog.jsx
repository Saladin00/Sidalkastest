// src/components/verifikasi/VerifikasiLog.jsx
import { useEffect, useState } from "react";
import { getVerifikasiLogs } from "@/services/verifikasiApi";

export default function VerifikasiLog({ verifikasiId }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await getVerifikasiLogs(verifikasiId);
        setLogs(res);
      } catch (err) {
        console.error(err);
        alert("Gagal memuat log verifikasi!");
      }
    }
    load();
  }, [verifikasiId]);

  if (!logs.length) return <div className="text-sm text-gray-500">Tidak ada log aktivitas.</div>;

  return (
    <div className="mt-6">
      <h2 className="font-semibold mb-2">Log Aktivitas</h2>
      <ul className="text-sm border rounded divide-y">
        {logs.map((log) => (
          <li key={log.id} className="p-2">
            <div className="font-medium text-blue-600">{log.user?.name || "User tidak diketahui"}</div>
            <div>{log.aksi.replace("_", " ").toUpperCase()}</div>
            <div className="text-gray-600">{log.keterangan}</div>
            <div className="text-xs text-gray-400">{new Date(log.created_at).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
