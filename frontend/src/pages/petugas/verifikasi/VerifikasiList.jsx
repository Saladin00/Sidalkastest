import { useEffect, useState } from "react";
import { getVerifikasi } from "@/services/verifikasiApi";
import VerificationBadge from "@/components/shared/VerificationBadge";

export default function VerifikasiList() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => { load(); }, [status]);
  async function load() { setData(await getVerifikasi(status? { status } : {})); }

  if (!data) return <div>Loading…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">Daftar Verifikasi (Petugas)</h1>
        <select className="border p-2 rounded ml-auto" value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="">Semua</option>
          <option value="menunggu">Menunggu</option>
          <option value="valid">Valid</option>
          <option value="tidak_valid">Tidak Valid</option>
        </select>
      </div>

      <div className="border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">LKS</th>
              <th className="p-2 text-left">Tanggal</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {data.data.map(v => (
              <tr key={v.id} className="border-t">
                <td className="p-2">{v.lks?.nama || `LKS #${v.lks_id}`}</td>
                <td className="p-2">{new Date(v.tanggal_verifikasi || v.created_at).toLocaleString()}</td>
                <td className="p-2"><VerificationBadge status={v.status}/></td>
                <td className="p-2 text-right">
                  <a className="text-blue-600 hover:underline" href={`/petugas/verifikasi/${v.id}`}>Detail</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
