import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import api from "../../../utils/api";

const OperatorVerifikasiDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadData = async () => {
    try {
      const res = await api.get(`/operator/verifikasi/${id}`);
      setData(res.data?.data);
    } catch (err) {
      console.error("❌ Gagal ambil detail:", err);
      alert("Gagal memuat detail verifikasi.");
    } finally {
      setLoading(false);
    }
  };

  const handleKirimKePetugas = async () => {
    if (!window.confirm("Apakah Anda yakin ingin mengirim ke petugas survei?"))
      return;

    try {
      setSending(true);
      await api.post(`/operator/verifikasi/${id}/kirim-ke-petugas`);
      alert("✅ Pengajuan berhasil dikirim ke petugas survei!");
      navigate("/operator/verifikasi");
    } catch (err) {
      console.error("❌ Gagal kirim ke petugas:", err);
      alert("Terjadi kesalahan saat mengirim ke petugas survei.");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-20 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Memuat detail verifikasi...
      </div>
    );

  if (!data)
    return (
      <div className="text-center text-gray-400 py-20">
        Data verifikasi tidak ditemukan.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-md shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Detail Verifikasi LKS
        </h2>
        <Link
          to="/operator/verifikasi"
          className="text-slate-600 hover:text-sky-600 text-sm"
        >
          <ArrowLeft size={16} className="inline mr-1" /> Kembali
        </Link>
      </div>

      {/* Informasi Verifikasi */}
      <table className="w-full text-sm border border-slate-200 rounded-lg mb-5">
        <tbody>
          <tr>
            <td className="p-3 font-medium w-40 border-b">Nama LKS</td>
            <td className="p-3 border-b">{data.lks?.nama || "-"}</td>
          </tr>
          <tr>
            <td className="p-3 font-medium border-b">Jenis Layanan</td>
            <td className="p-3 border-b">{data.lks?.jenis_layanan || "-"}</td>
          </tr>
          <tr>
            <td className="p-3 font-medium border-b">Petugas Verifikasi</td>
            <td className="p-3 border-b">{data.petugas?.name || "-"}</td>
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
            <td className="p-3 border-b">
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  data.status === "valid"
                    ? "bg-green-100 text-green-700"
                    : data.status === "tidak_valid"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {data.status?.toUpperCase()}
              </span>
            </td>
          </tr>
          <tr>
            <td className="p-3 font-medium border-b">Catatan</td>
            <td className="p-3 border-b">{data.catatan || "-"}</td>
          </tr>
        </tbody>
      </table>

      {/* Foto Bukti */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">
          Dokumen / Foto Bukti
        </h3>
        {(() => {
          let fotoBukti = [];

          // kalau foto_bukti string (misal: "[\"a.png\"]"), ubah ke array dulu
          if (typeof data.foto_bukti === "string") {
            try {
              fotoBukti = JSON.parse(data.foto_bukti);
            } catch (e) {
              console.error("⚠️ Gagal parse foto_bukti:", e);
            }
          } else if (Array.isArray(data.foto_bukti)) {
            fotoBukti = data.foto_bukti;
          }

          return fotoBukti.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {fotoBukti.map((foto, i) => (
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
              Tidak ada dokumen pendukung.
            </p>
          );
        })()}
      </div>

      {/* Tombol Aksi */}
      {data.status === "menunggu" && (
        <div className="flex justify-end gap-3 mt-6 border-t pt-5">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm px-4 py-2 rounded-md"
          >
            <ArrowLeft size={14} /> Kembali
          </button>
          <button
            onClick={handleKirimKePetugas}
            disabled={sending}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm px-4 py-2 rounded-md transition"
          >
            {sending ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Mengirim...
              </>
            ) : (
              <>
                <Send size={16} /> Kirim ke Petugas
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default OperatorVerifikasiDetail;
