import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { Loader2, AlertCircle, CheckCircle, Clock, Eye } from "lucide-react";

const LKSVerifikasiStatus = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadStatus = async () => {
    setLoading(true);
    try {
      const res = await api.get("/lks/verifikasi");
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      const latest = list.length > 0 ? list[0] : null;
      setData(latest);
    } catch (err) {
      console.error("❌ Gagal memuat status verifikasi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center text-gray-500 py-6">
        <Loader2 size={18} className="animate-spin mr-2" /> Memuat status
        verifikasi...
      </div>
    );

  if (!data)
    return (
      <div className="text-center py-10 text-gray-500 italic">
        Belum ada data verifikasi untuk akun Anda.
      </div>
    );

  const { id, status, catatan } = data;

  const renderIcon = () => {
    switch (status) {
      case "valid":
        return <CheckCircle className="text-green-600" size={18} />;
      case "tidak_valid":
        return <AlertCircle className="text-red-600" size={18} />;
      default:
        return <Clock className="text-yellow-500" size={18} />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white border border-slate-200 shadow rounded-lg p-5">
      <h2 className="text-base font-semibold text-slate-800 mb-3">
        Status Verifikasi LKS
      </h2>

      <div className="flex items-center gap-2 text-sm mb-2">
        {renderIcon()}
        <span
          className={`font-medium ${
            status === "valid"
              ? "text-green-700"
              : status === "tidak_valid"
              ? "text-red-700"
              : "text-yellow-700"
          }`}
        >
          {status === "valid"
            ? "Terverifikasi (Valid)"
            : status === "tidak_valid"
            ? "Tidak Valid"
            : "Menunggu Verifikasi"}
        </span>
      </div>

      {catatan && (
        <p className="text-sm text-slate-600 mt-2 border-t border-slate-100 pt-2">
          <strong>Catatan Admin:</strong> {catatan}
        </p>
      )}

      {/* Tombol Lihat Detail */}
      <div className="mt-5 flex justify-end">
        <button
          onClick={() => navigate(`/lks/verifikasi/detail/${id}`)}
          className="flex items-center gap-2 text-sm text-sky-600 hover:text-sky-800 font-medium border border-sky-200 px-3 py-1.5 rounded-md hover:bg-sky-50 transition"
        >
          <Eye size={16} /> Lihat Detail Verifikasi
        </button>
      </div>
    </div>
  );
};

export default LKSVerifikasiStatus;
