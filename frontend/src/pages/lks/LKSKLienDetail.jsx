import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../utils/api";
import { ArrowLeft, Loader2 } from "lucide-react";

const LKSKlienDetail = () => {
  const { id } = useParams();
  const [klien, setKlien] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDetail = async () => {
    try {
      const res = await api.get(`/klien/${id}`);
      setKlien(res.data.data);
    } catch (err) {
      alert("Gagal memuat detail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [id]);

  if (loading)
    return (
      <div className="p-5 flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (!klien)
    return <div className="text-center p-10 text-gray-500">Tidak ditemukan</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
      <Link to="/lks/klien" className="text-sky-600 flex items-center mb-4">
        <ArrowLeft size={16} className="mr-1" /> Kembali
      </Link>

      <h2 className="text-xl font-semibold text-slate-700 mb-5">
        Detail Klien: {klien.nama}
      </h2>

      <table className="text-sm w-full border">
        <tbody>
          <tr>
            <td className="font-medium p-3">NIK</td>
            <td className="p-3">{klien.nik}</td>
          </tr>
          <tr>
            <td className="font-medium p-3">Nama</td>
            <td className="p-3">{klien.nama}</td>
          </tr>
          <tr>
            <td className="font-medium p-3">Alamat</td>
            <td className="p-3">{klien.alamat || "-"}</td>
          </tr>
          <tr>
            <td className="font-medium p-3">Kelurahan</td>
            <td className="p-3">{klien.kelurahan || "-"}</td>
          </tr>
          <tr>
            <td className="font-medium p-3">Kecamatan</td>
            <td className="p-3">{klien.kecamatan?.nama || "-"}</td>
          </tr>
          <tr>
            <td className="font-medium p-3">Jenis Kebutuhan</td>
            <td className="p-3">{klien.jenis_kebutuhan || "-"}</td>
          </tr>
          <tr>
            <td className="font-medium p-3">Status Bantuan</td>
            <td className="p-3">{klien.status_bantuan || "-"}</td>
          </tr>
          <tr>
            <td className="font-medium p-3">Status Pembinaan</td>
            <td className="p-3">{klien.status_pembinaan || "-"}</td>
          </tr>
        </tbody>
      </table>

      {/** dokumen jika ada */}
      {klien.dokumen && klien.dokumen.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-medium mb-2">Dokumen Pendukung</h3>
          <ul className="list-disc pl-5">
            {klien.dokumen.map((doc, idx) => (
              <li key={idx}>
                <a href={doc.url || doc} target="_blank" className="text-sky-600 underline">
                  {doc.name || `Dokumen ${idx + 1}`}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LKSKlienDetail;
