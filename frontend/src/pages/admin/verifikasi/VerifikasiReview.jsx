import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getVerifikasiDetail,
  updateStatusVerifikasi,
} from "@/services/verifikasiApi";
import VerificationBadge from "@/components/shared/VerificationBadge";
import VerifikasiLog from "@/components/verifikasi/VerifikasiLog";
import { ArrowLeft, Save } from "lucide-react";

export default function VerifikasiReview() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("valid");
  const [catatanAdmin, setCatatanAdmin] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    load();
  }, [id]);

  async function load() {
    try {
      const result = await getVerifikasiDetail(id);
      setData(result);
      setStatus(result.status || "menunggu");
    } catch (err) {
      console.error("Gagal memuat data verifikasi:", err);
      alert("Gagal memuat data verifikasi!");
    }
  }

  async function save() {
    try {
      setSaving(true);
      await updateStatusVerifikasi(id, {
        status,
        catatan_admin: catatanAdmin,
      });
      alert("✅ Status berhasil diperbarui!");
      navigate("/admin/verifikasi");
    } catch (err) {
      console.error(err);
      alert("❌ Gagal menyimpan status. Periksa koneksi atau server!");
    } finally {
      setSaving(false);
    }
  }

  const storage =
    import.meta.env.VITE_STORAGE_URL || import.meta.env.VITE_API_URL;

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6">
        <div className="mx-auto max-w-5xl rounded-xl border border-slate-200 bg-white px-6 py-8 text-sm text-gray-600 shadow-sm">
          Memuat data verifikasi…
        </div>
      </div>
    );
  }

  const fotoList = Array.isArray(data.foto_bukti) ? data.foto_bukti : [];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-100"
            >
              <ArrowLeft size={14} />
              Kembali
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-gray-900">
                Review Verifikasi
              </h1>
              <VerificationBadge status={data.status} />
            </div>
          </div>
        </div>

        {/* INFO ATAS: DATA LKS + HASIL PETUGAS */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Data LKS */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Data LKS
            </div>
            <div className="space-y-1">
              <div className="text-base font-semibold text-gray-900">
                {data.lks?.nama || "-"}
              </div>
              <div className="text-sm text-gray-600">
                {data.lks?.alamat || "-"}
              </div>
              {data.lks?.jenis_layanan && (
                <div className="mt-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  {data.lks.jenis_layanan}
                </div>
              )}
            </div>
          </div>

          {/* Hasil Petugas */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Hasil Petugas
            </div>
            <div className="space-y-2 text-sm text-gray-800">
              <p className="whitespace-pre-wrap">
                {data.penilaian || "Menunggu proses verifikasi."}
              </p>
              {data.catatan && (
                <p className="text-gray-600">{data.catatan}</p>
              )}
            </div>
          </div>
        </div>

        {/* FOTO BUKTI */}
        {fotoList.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Dokumentasi / Foto Bukti
            </div>
            <div className="flex flex-wrap gap-3">
              {fotoList.map((p, i) => (
                <a
                  key={i}
                  href={`${storage}/storage/${p.replace(/^storage\//, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group block"
                >
                  <img
                    src={`${storage}/storage/${p.replace(/^storage\//, "")}`}
                    alt={`Foto ${i + 1}`}
                    className="h-28 w-28 rounded-lg border border-slate-200 object-cover transition group-hover:ring-2 group-hover:ring-emerald-500"
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* FORM STATUS ADMIN */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="text-sm font-semibold text-gray-900">
            Keputusan Admin
          </div>

          <div className="grid gap-4 md:grid-cols-[220px,1fr]">
            {/* Select status */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Status Verifikasi
              </label>
              <select
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="valid">Valid</option>
                <option value="tidak_valid">Tidak Valid</option>
                <option value="menunggu">Menunggu</option>
              </select>
            </div>

            {/* Catatan admin */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Catatan Admin <span className="text-gray-400">(opsional)</span>
              </label>
              <textarea
                className="min-h-[90px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Tulis catatan jika diperlukan, misalnya alasan status tidak valid."
                value={catatanAdmin}
                onChange={(e) => setCatatanAdmin(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => navigate("/admin/verifikasi")}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Save size={16} />
              {saving ? "Menyimpan..." : "Simpan Status"}
            </button>
          </div>
        </div>

        {/* LOG AKTIVITAS */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-3 text-sm font-semibold text-gray-900">
            Log Aktivitas
          </div>
          <div className="p-5">
            <VerifikasiLog verifikasiId={data.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
