import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Check, X } from "lucide-react";
import api from "../../../utils/api";

const PetugasVerifikasiDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [penilaian, setPenilaian] = useState("");
  const [catatan, setCatatan] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const res = await api.get(`/petugas/verifikasi/${id}`);
      setData(res.data?.data);
      setPenilaian(res.data?.data?.penilaian || "");
      setCatatan(res.data?.data?.catatan || "");
    } catch (err) {
      console.error("❌ Gagal ambil detail:", err);
      alert("Gagal memuat data verifikasi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (status) => {
    if (!window.confirm(`Kirim hasil survei dan tandai sebagai ${status}?`))
      return;
    try {
      setSubmitting(true);
      await api.put(`/petugas/verifikasi/${id}`, {
        status,
        penilaian,
        catatan,
      });
      alert("✅ Hasil survei berhasil dikirim ke admin!");
      navigate("/petugas/verifikasi");
    } catch (err) {
      console.error("❌ Gagal kirim hasil survei:", err);
      alert("Gagal mengirim hasil survei.");
    } finally {
      setSubmitting(false);
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
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6 border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Detail & Hasil Survei Verifikasi
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
        </tbody>
      </table>

      {/* Form hasil survei */}
      <div className="border-t border-slate-200 pt-4 mt-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">
          Hasil Survei Lapangan
        </h3>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Penilaian</label>
            <textarea
              rows={3}
              value={penilaian}
              onChange={(e) => setPenilaian(e.target.value)}
              className="border rounded-md px-3 py-2 w-full text-sm"
              placeholder="Tulis hasil penilaian survei..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Catatan</label>
            <textarea
              rows={3}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="border rounded-md px-3 py-2 w-full text-sm"
              placeholder="Catatan tambahan (opsional)"
            />
          </div>
        </div>

        {/* Tombol kirim hasil */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={() => handleSubmit("tidak_valid")}
            disabled={submitting}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md"
          >
            <X size={16} />
            Tandai Tidak Valid
          </button>

          <button
            onClick={() => handleSubmit("valid")}
            disabled={submitting}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md"
          >
            {submitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Check size={16} />
            )}
            Kirim ke Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetugasVerifikasiDetail;
