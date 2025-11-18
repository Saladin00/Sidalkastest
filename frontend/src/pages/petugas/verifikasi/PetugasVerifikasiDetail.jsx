// src/pages/petugas/verifikasi/PetugasVerifikasiDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, FileImage } from "lucide-react";
import api from "../../../utils/api";

const PetugasVerifikasiDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await api.get(`/petugas/verifikasi/${id}`);
      setData(res.data?.data);
    } catch (err) {
      console.error("❌ Gagal ambil detail verifikasi:", err);
      alert("Gagal memuat data verifikasi.");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-20 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Memuat detail...
      </div>
    );

  if (!data)
    return (
      <div className="text-center text-gray-500 py-20">
        Data verifikasi tidak ditemukan.
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md p-6 border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Detail Verifikasi
        </h2>
        <Link
          to="/petugas/verifikasi"
          className="text-slate-600 hover:text-sky-600 text-sm"
        >
          <ArrowLeft size={16} className="inline mr-1" /> Kembali
        </Link>
      </div>

      <table className="text-sm w-full border border-slate-200 rounded-md mb-5">
        <tbody>
          <tr>
            <td className="p-3 font-medium w-40 border-b">Nama LKS</td>
            <td className="p-3 border-b">{data.lks?.nama || "-"}</td>
          </tr>
          <tr>
            <td className="p-3 font-medium border-b">Tanggal Verifikasi</td>
            <td className="p-3 border-b">
              {data.tanggal_verifikasi
                ? new Date(data.tanggal_verifikasi).toLocaleString("id-ID")
                : "-"}
            </td>
          </tr>
          <tr>
            <td className="p-3 font-medium border-b">Status</td>
            <td className="p-3 border-b">{data.status?.toUpperCase()}</td>
          </tr>
          <tr>
            <td className="p-3 font-medium border-b">Penilaian</td>
            <td className="p-3 border-b">{data.penilaian || "-"}</td>
          </tr>
          <tr>
            <td className="p-3 font-medium">Catatan</td>
            <td className="p-3">{data.catatan || "-"}</td>
          </tr>
        </tbody>
      </table>

      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">
          Foto Bukti Lapangan
        </h3>
        {data.foto_bukti?.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {data.foto_bukti.map((foto, i) => (
              <a
                key={i}
                href={foto.url || foto}
                target="_blank"
                rel="noopener noreferrer"
                className="block border rounded-md overflow-hidden"
              >
                <img
                  src={foto.url || foto}
                  alt={`Foto ${i + 1}`}
                  className="object-cover w-full h-32"
                />
              </a>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm italic">
            Tidak ada foto bukti.
          </p>
        )}
      </div>
    </div>
  );
};

export default PetugasVerifikasiDetail;
