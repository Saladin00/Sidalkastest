import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ⬅️ Tambahkan ini
import { getVerifikasiDetail, updateStatusVerifikasi } from "@/services/verifikasiApi";
import VerificationBadge from "@/components/shared/VerificationBadge";
import VerifikasiLog from "@/components/verifikasi/VerifikasiLog";

export default function VerifikasiReview({ id }) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("valid");
  const [catatanAdmin, setCatatanAdmin] = useState("");
  const navigate = useNavigate(); // ⬅️ Hook navigasi

  useEffect(() => { load(); }, [id]);
  async function load() { setData(await getVerifikasiDetail(id)); }

  async function save() {
    try {
      await updateStatusVerifikasi(id, { status, catatan_admin: catatanAdmin });
      alert("✅ Status berhasil diperbarui!");
      navigate("/admin/verifikasi"); // ⬅️ Kembali ke daftar setelah sukses
    } catch (err) {
      console.error(err);
      alert("❌ Gagal menyimpan status. Periksa koneksi atau server!");
    }
  }

  if (!data) return <div>Loading…</div>;

  const storage = import.meta.env.VITE_STORAGE_URL;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">Review Verifikasi</h1>
        <VerificationBadge status={data.status} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="border rounded p-3">
          <div className="font-medium mb-2">Data LKS</div>
          <div>{data.lks?.nama}</div>
          <div className="text-sm text-gray-500">{data.lks?.alamat}</div>
        </div>
        <div className="border rounded p-3">
          <div className="font-medium mb-2">Hasil Petugas</div>
          <pre className="whitespace-pre-wrap text-sm">{data.penilaian || "-"}</pre>
          <div className="mt-2 text-sm text-gray-600">{data.catatan || "-"}</div>
        </div>
      </div>

      {Array.isArray(data.foto_bukti) && data.foto_bukti.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {data.foto_bukti.map((p, i) => (
            <img
  key={i}
  src={`${storage}/${p.replace(/^storage\//, '')}`}
  alt={`Foto ${i + 1}`}
  className="w-40 h-40 object-cover border rounded"
/>

          ))}
        </div>
      )}

      <div className="border rounded p-3 space-y-2">
        <select
          className="border p-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="valid">Valid</option>
          <option value="tidak_valid">Tidak Valid</option>
          <option value="menunggu">Menunggu</option>
        </select>

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Catatan admin (opsional)"
          value={catatanAdmin}
          onChange={(e) => setCatatanAdmin(e.target.value)}
        />

        <button
          onClick={save}
          className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Simpan Status
        </button>
      </div>
      <VerifikasiLog verifikasiId={data.id} />
    </div>
  );
}
