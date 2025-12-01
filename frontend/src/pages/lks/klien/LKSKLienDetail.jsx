import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { ArrowLeft, Loader2, User } from "lucide-react";
import { showInfo, showSuccess, showError } from "../../../utils/toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const KlienDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [klien, setKlien] = useState(null);
  const [notified, setNotified] = useState(false); // mencegah duplikat toast

  useEffect(() => {
    const fetchKlien = async () => {
      try {
        setLoading(true);
        if (!notified) {
          showInfo("Memuat detail klien...");
          setNotified(true);
        }

        const res = await api.get(`/klien/${id}`);
        setKlien(res.data.data || res.data);
        showSuccess("Data klien berhasil dimuat!");
      } catch (err) {
        console.error("❌ Gagal memuat data klien:", err);
        showError("Gagal memuat data klien!");
      } finally {
        setLoading(false);
      }
    };
    fetchKlien();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-16 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Memuat detail klien...
      </div>
    );

  if (!klien)
    return (
      <div className="text-center py-10 text-gray-500 italic">
        Data klien tidak ditemukan.
      </div>
    );

  const renderStatusBadge = (status) => {
    const isActive = status?.toLowerCase() === "aktif";
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          isActive
            ? "bg-emerald-100 text-emerald-700"
            : "bg-rose-100 text-rose-700"
        }`}
      >
        {status || "-"}
      </span>
    );
  };

  const infoList = [
    { label: "NIK", value: klien.nik },
    { label: "Nama", value: klien.nama },
    { label: "Alamat", value: klien.alamat },
    { label: "Kelurahan", value: klien.kelurahan },
    { label: "Kecamatan", value: klien.kecamatan?.nama },
    { label: "Jenis Kebutuhan", value: klien.jenis_kebutuhan },
    { label: "Status Bantuan", value: klien.status_bantuan },
    {
      label: "Status Pembinaan",
      value: renderStatusBadge(klien.status_pembinaan),
    },
  ];

  return (
    <div className="relative max-w-5xl mx-auto my-10 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Background Accent */}
      <div className="absolute -top-20 right-10 w-96 h-96 bg-sky-100/50 rounded-full blur-3xl -z-10"></div>

      {/* HEADER */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white p-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full shadow-lg">
            <User size={42} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wide">
              Detail Klien: {klien.nama}
            </h1>
            <p className="text-sm text-blue-100 mt-1">
              Data hasil input oleh LKS terkait.
            </p>
          </div>
        </div>
      </div>

      {/* DETAIL SECTION */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {infoList.map((item, i) => (
            <div
              key={i}
              className="p-5 rounded-xl border border-gray-100 bg-gray-50 shadow-sm hover:shadow-md hover:bg-sky-50 transition-all duration-200"
            >
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                {i + 1}. {item.label}
              </p>
              <p className="text-gray-800 font-semibold text-sm">
                {item.value || (
                  <span className="text-gray-400 italic">Belum diisi</span>
                )}
              </p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Info Tambahan */}
        <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-5 rounded-xl shadow-inner border border-blue-100">
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold text-sky-700">Catatan:</span>{" "}
            Pastikan data klien selalu diperbarui secara berkala agar validitas
            dan kelayakan bantuan tetap terjaga. Data ini digunakan sebagai
            acuan verifikasi oleh petugas sosial.
          </p>
        </div>

        {/* Tombol kembali */}
        <div className="flex justify-start mt-10">
          <button
            onClick={() => navigate("/lks/klien")}
            className="flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium shadow-md transition-all"
          >
            <ArrowLeft size={16} />
            Kembali
          </button>
        </div>
      </div>

      {/* TOAST CONTAINER */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar
        newestOnTop
        theme="light"
      />
    </div>
  );
};

export default KlienDetail;
