import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../../components/AdminLayout";
import API from "../../../utils/api";
import DokumenUpload from "../../../components/lks/DokumenUpload"; // 📎 upload dokumen
import LaporanKunjungan from "../../../components/lks/Laporankunjungan"; // 🧾 laporan kunjungan

const LKSDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Ambil detail LKS (termasuk dokumen)
  const fetchDetail = async () => {
    try {
      const res = await API.get(`/lks/${id}`);
      setData(res.data);
    } catch (error) {
      console.error("Gagal memuat detail LKS:", error);
      alert("Gagal memuat detail LKS!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading)
    return (
      <AdminLayout>
        <div className="p-6 text-gray-600">Memuat data LKS...</div>
      </AdminLayout>
    );

  if (!data)
    return (
      <AdminLayout>
        <div className="p-6 text-red-500">Data LKS tidak ditemukan.</div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="bg-white shadow p-6 rounded-lg border border-gray-200">
        {/* 🔹 HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">📄 Detail Profil LKS</h2>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/admin/lks/edit/${id}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => navigate("/admin/lks")}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              ⬅️ Kembali
            </button>
          </div>
        </div>

        {/* 🔹 DETAIL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
          <div>
            <p><strong>Nama:</strong> {data.nama}</p>
            <p><strong>Jenis Layanan:</strong> {data.jenis_layanan}</p>
            <p><strong>Kecamatan:</strong> {data.kecamatan}</p>
            <p><strong>Status:</strong> {data.status}</p>
            <p><strong>Legalitas:</strong> {data.legalitas || "-"}</p>
            <p><strong>Akreditasi:</strong> {data.akreditasi || "-"}</p>
          </div>

          <div>
            <p><strong>Pengurus:</strong> {data.pengurus || "-"}</p>
            <p><strong>Sarana:</strong> {data.sarana || "-"}</p>
            <p><strong>Alamat:</strong> {data.alamat || "-"}</p>
            <p><strong>Koordinat:</strong> {data.koordinat || "-"}</p>
          </div>
        </div>

        {/* 🔹 DESKRIPSI */}
        {data.deskripsi && (
          <div className="mt-8">
            <h3 className="font-semibold text-gray-800 mb-2">📝 Deskripsi / Keterangan</h3>
            <p className="text-gray-700 leading-relaxed">{data.deskripsi}</p>
          </div>
        )}

        {/* 🔹 TOMBOL CETAK PDF */}
        <div className="mt-6 flex justify-end gap-2">
          <a
            href={`http://localhost:8000/api/lks/${id}/cetak-pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
          >
            🖨️ Cetak Profil PDF
          </a>
        </div>

        {/* 🔹 DOKUMEN UPLOAD SECTION */}
        <div className="mt-10 border-t pt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📎 Dokumen Pendukung
          </h3>

          <DokumenUpload
            lksId={data.id}
            onSuccess={() => {
              console.log("Dokumen berhasil diunggah — refresh data");
              fetchDetail();
            }}
          />

          {/* 📄 Daftar dokumen */}
          {data.dokumen && data.dokumen.length > 0 ? (
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              {data.dokumen.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    📄 <strong>{doc.nama}</strong>{" "}
                    <a
                      href={`${import.meta.env.VITE_API_BASE_URL}/storage/${doc.path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      (Lihat File)
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">Belum ada dokumen yang diunggah.</p>
          )}
        </div>

        {/* 🔹 LAPORAN KUNJUNGAN SECTION */}
        <div className="mt-10 border-t pt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🧾 Laporan Kunjungan
          </h3>
          <LaporanKunjungan lksId={data.id} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default LKSDetail;
