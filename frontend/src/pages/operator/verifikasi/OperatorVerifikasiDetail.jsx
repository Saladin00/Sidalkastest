// src/pages/operator/verifikasi/OperatorVerifikasiDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Send, User, FileImage } from "lucide-react";
import api from "../../../utils/api";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "sweetalert2/dist/sweetalert2.min.css";

const OperatorVerifikasiDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal pilih petugas
  const [showModal, setShowModal] = useState(false);
  const [petugasList, setPetugasList] = useState([]);
  const [selectedPetugas, setSelectedPetugas] = useState("");
  const [sending, setSending] = useState(false);

  // Load detail verifikasi
  const loadData = async () => {
    try {
      const res = await api.get(`/operator/verifikasi/${id}`);
      const result = res.data?.data || null;

      if (typeof result.foto_bukti === "string") {
        try {
          result.foto_bukti = JSON.parse(result.foto_bukti);
        } catch {
          result.foto_bukti = [];
        }
      }
      if (!Array.isArray(result.foto_bukti)) result.foto_bukti = [];

      setData(result);
    } catch (err) {
      console.error("❌ Gagal ambil detail:", err);
      toast.error("Gagal memuat detail verifikasi.", { autoClose: 2500 });
    } finally {
      setLoading(false);
    }
  };

  // Ambil list petugas
  const loadPetugas = async () => {
    try {
      const res = await api.get(`/operator/verifikasi/petugas/list`);
      setPetugasList(res.data?.data || []);
    } catch (err) {
      console.error("❌ Gagal ambil daftar petugas:", err);
      toast.error("Gagal memuat daftar petugas.");
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const openModal = async () => {
    await loadPetugas();
    setShowModal(true);
  };

  const handleKirimKePetugas = async () => {
    if (!selectedPetugas) {
      toast.warning("Pilih petugas terlebih dahulu!");
      return;
    }

    const result = await Swal.fire({
      title: "Kirim ke Petugas?",
      text: "Data ini akan dikirim ke petugas survei.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Kirim",
      cancelButtonText: "Batal",
      confirmButtonColor: "#059669",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) return;

    try {
      setSending(true);
      await api.post(`/operator/verifikasi/${id}/kirim-ke-petugas`, {
        petugas_id: selectedPetugas,
      });

      toast.success("Berhasil dikirim ke petugas survei!");
      setTimeout(() => navigate("/operator/verifikasi"), 1500);
    } catch (err) {
      console.error("❌ Error:", err);
      toast.error("Gagal mengirim ke petugas survei.");
    } finally {
      setSending(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "menunggu":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "proses_survei":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      case "valid":
        return "bg-green-100 text-green-700 border border-green-300";
      case "tidak_valid":
        return "bg-red-100 text-red-700 border border-red-300";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-300";
    }
  };

  const getNamaFile = (url, index) => {
    const ext = url.split(".").pop()?.toLowerCase() || "";
    const isImage = ["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(ext);
    return isImage ? `Foto ${index + 1}` : `Dokumen ${index + 1}`;
  };

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
    <div className="max-w-5xl mx-auto bg-white border border-slate-100 rounded-2xl shadow-xl p-10 transition-all">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-sky-900 tracking-tight">
          Detail Verifikasi LKS
        </h2>
      </div>

      {/* Informasi Verifikasi */}
      <div className="overflow-hidden rounded-xl border border-slate-100 shadow-sm mb-8">
        <table className="w-full text-[15px] text-slate-700">
          <tbody>
            {[
              ["Nama LKS", data.lks?.nama],
              ["Jenis Layanan", data.lks?.jenis_layanan],
              ["Petugas Verifikasi", data.petugas?.name],
              [
                "Tanggal Verifikasi",
                data.tanggal_verifikasi
                  ? new Date(data.tanggal_verifikasi).toLocaleString("id-ID")
                  : "-",
              ],
              [
                "Status",
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusStyle(
                    data.status
                  )}`}
                >
                  {data.status?.toUpperCase()}
                </span>,
              ],
              ["Catatan", data.catatan || "-"],
            ].map(([label, value], i) => (
              <tr
                key={i}
                className="hover:bg-slate-50 transition-colors border-b border-slate-100"
              >
                <td className="p-4 pl-8 font-medium text-slate-600 w-56 align-top">
                  {label}
                </td>
                <td className="p-4 pr-8 text-slate-800">{value || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dokumen / Foto Bukti */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-slate-700 mb-4">
          Dokumen / Foto Bukti
        </h3>

        {data.foto_bukti.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {data.foto_bukti.map((foto, i) => {
              const url = foto.url || foto;
              const namaFile = getNamaFile(url, i);

              return (
                <div
                  key={i}
                  className="border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.02] transition-all bg-white"
                >
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={url}
                      alt={namaFile}
                      className="object-cover w-full h-40"
                    />
                  </a>
                  <div className="p-2 border-t text-center bg-slate-50 text-xs text-slate-600 font-medium truncate">
                    {namaFile}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-500 text-sm italic flex items-center gap-2">
            <FileImage size={16} /> Tidak ada dokumen pendukung.
          </p>
        )}
      </div>

      {/* Tombol Aksi */}
      <div className="flex justify-between items-center mt-10 border-t pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm px-6 py-2.5 rounded-md shadow transition"
        >
          <ArrowLeft size={16} /> Kembali
        </button>

        {data.status === "menunggu" && (
          <button
            onClick={openModal}
            disabled={sending}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-6 py-2.5 rounded-md shadow transition"
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
        )}
      </div>

      {/* Modal Pilih Petugas */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">
              Pilih Petugas Survei
            </h3>

            <select
              value={selectedPetugas}
              onChange={(e) => setSelectedPetugas(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 mb-4"
            >
              <option value="">-- Pilih Petugas --</option>
              {petugasList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md border"
              >
                Batal
              </button>

              <button
                disabled={sending}
                onClick={handleKirimKePetugas}
                className="px-5 py-2 bg-emerald-600 text-white rounded-md flex items-center gap-2"
              >
                {sending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Mengirim...
                  </>
                ) : (
                  <>
                    <User size={16} /> Kirim
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2500} hideProgressBar />
    </div>
  );
};

export default OperatorVerifikasiDetail;
