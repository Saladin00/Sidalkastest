import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVerifikasi } from "@/services/verifikasiApi";
import VerificationBadge from "@/components/shared/VerificationBadge";
import { Eye, Search } from "lucide-react";

export default function VerifikasiList() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function load() {
    try {
      setLoading(true);
      const res = await getVerifikasi(status ? { status } : {});
      setData(res);
    } catch (e) {
      console.error(e);
      alert("Gagal memuat data verifikasi!");
    } finally {
      setLoading(false);
    }
  }

  const rows = data?.data || [];

  // filter search di frontend
  const filteredRows = rows.filter((v) => {
    const q = searchTerm.toLowerCase();
    if (!q) return true;

    const lks = v.lks?.nama?.toLowerCase() || "";
    const petugas = v.petugas?.name?.toLowerCase() || "";
    const statusText = v.status?.toLowerCase() || "";

    return (
      lks.includes(q) ||
      petugas.includes(q) ||
      statusText.includes(q)
    );
  });

  const handleReset = () => {
    setStatus("");
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-4">
        {/* HEADER */}
        <h1 className="text-2xl font-semibold text-gray-900">
          Verifikasi (Admin)
        </h1>

        {/* FILTER BAR (kiri) */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {/* Filter status pill */}
          <select
            className="h-9 rounded-full border border-gray-300 bg-white px-3 pr-8 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Status: Semua</option>
            <option value="menunggu">Status: Menunggu</option>
            <option value="valid">Status: Valid</option>
            <option value="tidak_valid">Status: Tidak Valid</option>
          </select>

          {/* Reset */}
          <button
            type="button"
            onClick={handleReset}
            className="h-9 rounded-full border border-gray-300 bg-white px-4 text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Reset
          </button>

          {/* Search */}
          <div className="relative w-full max-w-xs md:max-w-sm">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Cari LKS / petugas / status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-gray-300 bg-white py-1.5 pl-7 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
        </div>

        {/* CARD TABEL */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="px-4 py-6 text-sm text-gray-600">
              Memuat data verifikasi...
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-500">
              Tidak ada data verifikasi.
            </div>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-800">
                  <th className="w-12 px-4 py-2.5 border border-slate-200/70 text-left">
                    No
                  </th>
                  <th className="px-4 py-2.5 border border-slate-200/70 text-left">
                    LKS
                  </th>
                  <th className="px-4 py-2.5 border border-slate-200/70 text-left">
                    Petugas
                  </th>
                  <th className="px-4 py-2.5 border border-slate-200/70 text-left">
                    Tanggal
                  </th>
                  <th className="px-4 py-2.5 border border-slate-200/70 text-left">
                    Status
                  </th>
                  <th className="px-4 py-2.5 border border-slate-200/70 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((v, index) => (
                  <tr
                    key={v.id}
                    className="border-b border-slate-200/70 last:border-b-0 hover:bg-slate-50"
                  >
                    <td className="px-4 py-2.5 border border-slate-200/70 text-center">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2.5 border border-slate-200/70">
                      {v.lks?.nama || `LKS #${v.lks_id}`}
                    </td>
                    <td className="px-4 py-2.5 border border-slate-200/70">
                      {v.petugas?.name || "-"}
                    </td>
                    <td className="px-4 py-2.5 border border-slate-200/70 whitespace-nowrap">
                      {new Date(
                        v.tanggal_verifikasi || v.created_at
                      ).toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 border border-slate-200/70">
                      <VerificationBadge status={v.status} />
                    </td>
                    <td className="px-4 py-2.5 border border-slate-200/70">
                      <div className="flex justify-end">
                        <button
                          onClick={() =>
                            navigate(`/admin/verifikasi/${v.id}`)
                          }
                          className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                        >
                          <Eye size={14} />
                          Review
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
