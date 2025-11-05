import { useState } from "react";
import { createVerifikasi } from "@/services/verifikasiApi";
import PhotoUploader from "@/components/shared/PhotoUploader";

export default function VerifikasiForm({ lksId }) {
  const [penilaian, setPenilaian] = useState("");
  const [catatan, setCatatan] = useState("");
  const [files, setFiles] = useState([]);

  async function submit(e) {
    e.preventDefault();
    const f = new FormData();
    f.append("lks_id", lksId);
    if (penilaian) f.append("penilaian", penilaian);
    if (catatan) f.append("catatan", catatan);
    files.forEach((file, i) => f.append(`foto_bukti[${i}]`, file));
    await createVerifikasi(f);
    alert("Verifikasi terkirim.");
    window.history.back();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="text-sm bg-gray-50 p-3 rounded">LKS ID: <b>{lksId}</b></div>
      <textarea className="w-full border p-2 rounded" placeholder="Penilaian kelayakan…"
                value={penilaian} onChange={e=>setPenilaian(e.target.value)} />
      <textarea className="w-full border p-2 rounded" placeholder="Catatan petugas…"
                value={catatan} onChange={e=>setCatatan(e.target.value)} />
      <PhotoUploader onFiles={setFiles} />
      <button className="px-4 py-2 rounded bg-blue-600 text-white">Kirim Hasil</button>
    </form>
  );
}
