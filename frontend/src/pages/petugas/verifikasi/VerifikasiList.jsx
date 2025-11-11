import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVerifikasi } from "@/services/verifikasiApi";
import VerificationBadge from "@/components/shared/VerificationBadge";

export default function VerifikasiList() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, [status]);

  async function load() {
    try {
      const res = await getVerifikasi(status ? { status } : {});
      setData(res);
    } catch (e) {
      console.error(e);
      alert("Gagal memuat data verifikasi!");
    }
  }

  if (!data) return <div className="p-4">Memuat data...</div>;

  if (!data.data || data.data.length === 0) {
    return <div className="p-4 text-gray-500">Belum ada verifikasi.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">Daftar Verifikasi (Petugas)</h1>
        <select
          className="border p-2 rounded ml-auto"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
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
            {data.data.map((v) => (
              <tr key={v.id} className="border-t">
                <td className="p-2">{v.lks?.nama || `LKS #${v.lks_id}`}</td>
                <td className="p-2">
                  {new Date(
                    v.tanggal_verifikasi || v.created_at
                  ).toLocaleString()}
                </td>
                <td className="p-2">
                  <VerificationBadge status={v.status} />
                </td>
                <td className="p-2 text-right">
                  <button
                    onClick={() =>
                      navigate(`/petugas/verifikasi/lks/${v.lks_id}`)
                    }
                    className="text-blue-600 hover:underline"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
