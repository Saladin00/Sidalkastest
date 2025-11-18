import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import api from "../../../utils/api";

const LKSVerifikasiForm = () => {
  const [catatan, setCatatan] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lksData, setLksData] = useState(null);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  // 🔹 Ambil data profil LKS login
  const loadLKSData = async () => {
    try {
      const res = await api.get("/lks/me");
      setLksData(res.data.data);
    } catch (err) {
      console.error("❌ Gagal memuat data LKS:", err);
      alert("Gagal mengambil data LKS. Pastikan profil sudah dilengkapi.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadLKSData();
  }, []);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const formData = new FormData();
    formData.append("catatan", catatan);
    files.forEach((file, i) => formData.append(`foto_bukti[${i}]`, file));

    try {
      setLoading(true);
      await api.post("/lks/verifikasi/pengajuan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Pengajuan berhasil dikirim ke operator kecamatan!");
      navigate("/lks/verifikasi");
    } catch (err) {
      console.error("❌ Gagal kirim pengajuan:", err);
      alert("Gagal mengirim pengajuan verifikasi.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Memuat data profil LKS...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-md shadow-md p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Form Pengajuan Verifikasi
        </h2>
        <Link
          to="/lks/verifikasi"
          className="text-slate-600 hover:text-sky-600 text-sm"
        >
          <ArrowLeft size={16} className="inline mr-1" /> Kembali
        </Link>
      </div>

      {/* Info table — ambil otomatis dari profil LKS */}
      <table className="w-full text-sm border border-slate-200 rounded-lg mb-5">
        <tbody>
          <tr>
            <td className="p-3 font-medium w-40 border-b">Nama LKS</td>
            <td className="p-3 border-b">{lksData?.nama || "-"}</td>
          </tr>
          <tr>
            <td className="p-3 font-medium border-b">Jenis Layanan</td>
            <td className="p-3 border-b">{lksData?.jenis_layanan || "-"}</td>
          </tr>
          <tr>
            <td className="p-3 font-medium border-b">Petugas Verifikasi</td>
            <td className="p-3 border-b">
              <span className="text-slate-500 italic">Belum ditugaskan</span>
            </td>
          </tr>
          <tr>
            <td className="p-3 font-medium border-b">Tanggal Pengajuan</td>
            <td className="p-3 border-b">
              {new Date().toLocaleString("id-ID")}
            </td>
          </tr>
          <tr>
            <td className="p-3 font-medium border-b">Status</td>
            <td className="p-3 border-b">
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                MENUNGGU
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Form catatan dan upload */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Catatan Tambahan
          </label>
          <textarea
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            rows={3}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
            placeholder="Tuliskan catatan tambahan (opsional)..."
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Dokumen / Foto Bukti
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-600 border border-slate-300 rounded-lg p-2 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-sky-600 file:text-white hover:file:bg-sky-700"
          />
          {files.length > 0 && (
            <p className="text-xs text-slate-500 mt-1">
              {files.length} file dipilih
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md text-sm transition"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Mengirim...
              </>
            ) : (
              <>
                <Upload size={16} /> Kirim Pengajuan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LKSVerifikasiForm;
