// src/pages/operator/verifikasi/OperatorVerifikasiDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Send, User } from "lucide-react";
import api from "../../../utils/api";

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
      setData(res.data?.data);
    } catch (err) {
      console.error("❌ Gagal ambil detail:", err);
      alert("Gagal memuat detail verifikasi.");
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
      alert("Gagal memuat daftar petugas.");
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
      alert("Pilih petugas terlebih dahulu!");
      return;
    }

    if (!window.confirm("Kirim data verifikasi ini ke petugas survei?")) return;

    try {
      setSending(true);

      await api.post(`/operator/verifikasi/${id}/kirim-ke-petugas`, {
        petugas_id: selectedPetugas,
      });

      alert("✅ Data berhasil dikirim ke petugas survei!");
      navigate("/operator/verifikasi");
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Gagal mengirim ke petugas survei.");
    } finally {
      setSending(false);
    }
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
    <>
      <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl p-10">
        {/* Header */}
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">
          Detail Verifikasi LKS
        </h2>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 mb-8">
          <table className="w-full text-sm">
            <tbody>
              {[
                ["Nama LKS", data.lks?.nama],
                ["Jenis Layanan", data.lks?.jenis_layanan],
                ["Petugas Verifikasi", data.petugas?.name || "-"],
                [
                  "Tanggal Verifikasi",
                  data.tanggal_verifikasi
                    ? new Date(data.tanggal_verifikasi).toLocaleString("id-ID")
                    : "-",
                ],
                [
                  "Status",
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      data.status === "valid"
                        ? "bg-green-100 text-green-700"
                        : data.status === "tidak_valid"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {data.status?.toUpperCase()}
                  </span>,
                ],
                ["Catatan", data.catatan || "-"],
              ].map(([label, value], i) => (
                <tr
                  key={i}
                  className="border-b border-slate-200 hover:bg-slate-50"
                >
                  <td className="p-4 font-medium text-slate-600 w-60">
                    {label}
                  </td>
                  <td className="p-4">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Foto Bukti */}
        <div className="mb-8">
          <h3 className="text-base font-semibold text-slate-800 mb-3">
            Foto / Dokumen Bukti
          </h3>

          {Array.isArray(data.foto_bukti) && data.foto_bukti.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {data.foto_bukti.map((foto, idx) => (
                <a
                  key={idx}
                  href={foto.url || foto}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    alt="bukti"
                    src={foto.url || foto}
                    className="w-full h-36 object-cover rounded-lg shadow"
                  />
                </a>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 italic">Tidak ada foto bukti.</p>
          )}
        </div>

        {/* Action Buttons */}
        {data.status === "menunggu" && (
          <div className="flex justify-between items-center mt-10 border-t pt-6">
            <button
              onClick={() => navigate(-1)}
              className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-md flex items-center gap-2"
            >
              <ArrowLeft size={16} /> Kembali
            </button>

            <button
              onClick={openModal}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md flex items-center gap-2"
            >
              <Send size={16} /> Kirim ke Petugas
            </button>
          </div>
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
    </>
  );
};

export default OperatorVerifikasiDetail;
