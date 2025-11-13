import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, MapPin, Loader2 } from "lucide-react";
import api from "../../../utils/api";

// 🔧 Helper untuk memastikan dokumen selalu array
const parseDokumen = (dok) => {
  if (!dok) return [];
  if (Array.isArray(dok)) return dok;
  try {
    const parsed = JSON.parse(dok);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const OperatorLKSDetail = () => {
  const { id } = useParams();
  const [lks, setLks] = useState(null);
  const [loading, setLoading] = useState(true);

  const getLKSDetail = async () => {
    try {
      const res = await api.get(`/lks/${id}`);
      const detail = res.data.data ?? res.data;

      // 🔧 Normalisasi dokumen
      detail.dokumen = parseDokumen(detail.dokumen);
      setLks(detail);
    } catch (err) {
      console.error("Gagal memuat detail LKS:", err);
      alert("Terjadi kesalahan saat memuat data LKS.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLKSDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-500">
        <Loader2 className="animate-spin mr-2" />
        Memuat detail LKS...
      </div>
    );
  }

  if (!lks) {
    return (
      <div className="text-center py-20 text-gray-400">
        Data LKS tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg border border-slate-200">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
        <h2 className="text-lg font-semibold text-slate-800">
          Detail LKS: {lks.nama}
        </h2>
        <Link
          to="/operator/lks"
          className="flex items-center text-slate-600 hover:text-sky-600 text-sm"
        >
          <ArrowLeft size={16} className="mr-1" /> Kembali
        </Link>
      </div>

      <div className="p-6 space-y-6">

        {/* Informasi Umum */}
        <div>
          <h3 className="text-slate-700 font-semibold mb-2">Informasi Umum</h3>
          <table className="text-sm w-full border border-slate-200 rounded-lg">
            <tbody>
              <tr className="border-b">
                <td className="p-3 font-medium text-slate-600 w-48">Nama LKS</td>
                <td className="p-3 text-slate-800">{lks.nama}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium text-slate-600">Jenis Layanan</td>
                <td className="p-3 text-slate-800">{lks.jenis_layanan || "-"}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium text-slate-600">Status</td>
                <td className="p-3 text-slate-800">{lks.status || "-"}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium text-slate-600">Alamat</td>
                <td className="p-3 text-slate-800">{lks.alamat || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Lokasi & Kontak */}
        <div>
          <h3 className="text-slate-700 font-semibold mb-2 flex items-center">
            <MapPin size={16} className="mr-2 text-sky-500" />
            Lokasi & Kontak
          </h3>

          <table className="text-sm w-full border border-slate-200 rounded-lg">
            <tbody>
              <tr className="border-b">
                <td className="p-3 font-medium w-48">Kecamatan</td>
                <td className="p-3">{lks.kecamatan?.nama || "-"}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Kelurahan</td>
                <td className="p-3">{lks.kelurahan || "-"}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Kontak Pengurus</td>
                <td className="p-3">{lks.kontak_pengurus || "-"}</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Koordinat</td>
                <td className="p-3">{lks.koordinat || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Legalitas */}
        <div>
          <h3 className="text-slate-700 font-semibold mb-2 flex items-center">
            <FileText size={16} className="mr-2 text-sky-500" /> Dokumen Legalitas
          </h3>
          <table className="text-sm w-full border border-slate-200 rounded-lg">
            <tbody>
              <tr className="border-b">
                <td className="p-3 font-medium w-48">NPWP</td>
                <td className="p-3">{lks.npwp || "-"}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Akta Pendirian</td>
                <td className="p-3">{lks.akta_pendirian || "-"}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">No Akta</td>
                <td className="p-3">{lks.no_akta || "-"}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Izin Operasional</td>
                <td className="p-3">{lks.izin_operasional || "-"}</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Legalitas</td>
                <td className="p-3">{lks.legalitas || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Dokumen */}
        <div>
          <h3 className="text-slate-700 font-semibold mb-2 flex items-center">
            <FileText size={16} className="mr-2 text-sky-500" /> Dokumen Pendukung
          </h3>

          {lks.dokumen.length === 0 ? (
            <p className="text-sm text-slate-500">Tidak ada dokumen.</p>
          ) : (
            <ul className="list-disc pl-5 text-sm text-slate-700">
              {lks.dokumen.map((doc, index) => (
                <li key={index}>
                  <a
                    href={doc.url || doc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 hover:underline"
                  >
                    {doc.name || `Dokumen ${index + 1}`}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
};

export default OperatorLKSDetail;
