import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, MapPin, Loader2 } from "lucide-react";
import api from "../../../utils/api";

const OperatorLKSDetail = () => {
  const { id } = useParams();
  const [lks, setLks] = useState(null);
  const [loading, setLoading] = useState(true);

  const getLKSDetail = async () => {
    try {
      const res = await api.get(`/lks/${id}`);
      setLks(res.data.data);
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

      {/* Isi detail */}
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-slate-700 font-semibold mb-2">
            Informasi Umum
          </h3>
          <table className="text-sm w-full border border-slate-200 rounded-lg">
            <tbody>
              <tr className="border-b">
                <td className="p-3 font-medium text-slate-600 w-48">
                  Nama LKS
                </td>
                <td className="p-3 text-slate-800">{lks.nama}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium text-slate-600">
                  Jenis Layanan
                </td>
                <td className="p-3 text-slate-800">
                  {lks.jenis_layanan || "-"}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium text-slate-600">Kecamatan</td>
                <td className="p-3 text-slate-800">
                  {lks.kecamatan?.nama || "-"}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium text-slate-600">Alamat</td>
                <td className="p-3 text-slate-800">{lks.alamat || "-"}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium text-slate-600">Status</td>
                <td className="p-3 text-slate-800">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      lks.verifikasi_terbaru?.status === "valid"
                        ? "bg-green-100 text-green-700"
                        : lks.verifikasi_terbaru?.status === "tidak_valid"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {lks.verifikasi_terbaru?.status?.toUpperCase() || "PENDING"}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h3 className="text-slate-700 font-semibold mb-2 flex items-center">
            <MapPin size={16} className="mr-2 text-sky-500" /> Lokasi & Kontak
          </h3>
          <p className="text-sm text-slate-700">
            <strong>Kelurahan:</strong> {lks.kelurahan || "-"}
            <br />
            <strong>Kontak:</strong> {lks.kontak_pengurus || "-"}
            <br />
            <strong>Koordinat:</strong> {lks.koordinat || "-"}
          </p>
        </div>

        <div>
          <h3 className="text-slate-700 font-semibold mb-2 flex items-center">
            <FileText size={16} className="mr-2 text-sky-500" /> Dokumen Legalitas
          </h3>
          <ul className="list-disc list-inside text-sm text-slate-700">
            <li>NPWP: {lks.npwp || "-"}</li>
            <li>Akta Pendirian: {lks.akta_pendirian || "-"}</li>
            <li>Izin Operasional: {lks.izin_operasional || "-"}</li>
            <li>Legalitas: {lks.legalitas || "-"}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OperatorLKSDetail;
