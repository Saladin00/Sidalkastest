import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import api from "../../../utils/api";

const OperatorKlienDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [klien, setKlien] = useState(null);
  const [loading, setLoading] = useState(false);

  // ==========================
  // Ambil detail klien
  // ==========================
  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem("token");
        const res = await api.get(`/klien/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setKlien(res.data.data);
      } catch (error) {
        console.error("❌ Gagal mengambil detail klien:", error);
        alert("Gagal memuat detail klien");
        navigate("/operator/klien");
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-500">
        <Loader2 size={24} className="animate-spin mr-2" />
        Memuat detail klien...
      </div>
    );
  }

  if (!klien) {
    return (
      <div className="text-center py-10 text-gray-400">
        Data klien tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl border border-slate-200 p-6">
      {/* Tombol Kembali */}
      <button
        onClick={() => navigate("/operator/klien")}
        className="flex items-center gap-1 text-slate-600 hover:text-slate-900 mb-5"
      >
        <ArrowLeft size={16} /> Kembali ke daftar
      </button>

      {/* Judul */}
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        Detail Klien: {klien.nama}
      </h2>

      {/* Informasi utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
        <div>
          <p className="text-gray-500">NIK</p>
          <p className="font-semibold">{klien.nik || "-"}</p>
        </div>

        <div>
          <p className="text-gray-500">Nama Lengkap</p>
          <p className="font-semibold">{klien.nama || "-"}</p>
        </div>

        <div>
          <p className="text-gray-500">Kelurahan</p>
          <p className="font-semibold">{klien.kelurahan || "-"}</p>
        </div>

        <div>
          <p className="text-gray-500">Alamat</p>
          <p className="font-semibold">{klien.alamat || "-"}</p>
        </div>

        <div>
          <p className="text-gray-500">Jenis Kebutuhan</p>
          <p className="font-semibold">{klien.jenis_kebutuhan || "-"}</p>
        </div>

        <div>
          <p className="text-gray-500">Status Bantuan</p>
          <p className="font-semibold">{klien.status_bantuan || "-"}</p>
        </div>

        <div>
          <p className="text-gray-500">Status Pembinaan</p>
          <p
            className={`font-semibold px-3 py-1 rounded-full text-xs inline-block ${
              klien.status_pembinaan === "aktif"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {klien.status_pembinaan || "-"}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Kecamatan</p>
          <p className="font-semibold">{klien.kecamatan?.nama || "-"}</p>
        </div>

        <div>
          <p className="text-gray-500">LKS Penanggung Jawab</p>
          <p className="font-semibold">{klien.lks?.nama || "-"}</p>
        </div>
      </div>

      {/* Informasi tambahan */}
      <div className="mt-8 border-t pt-4 text-sm">
        <p className="text-gray-500 mb-1">Diperbarui Terakhir</p>
        <p className="font-semibold text-slate-700">
          {klien.updated_at
            ? new Date(klien.updated_at).toLocaleString("id-ID")
            : "-"}
        </p>
      </div>
    </div>
  );
};

export default OperatorKlienDetail;
