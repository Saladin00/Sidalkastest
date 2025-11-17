import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/api";

export default function KlienDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [klien, setKlien] = useState(null);

  useEffect(() => {
    api
      .get(`/klien/${id}`)
      .then((res) => setKlien(res.data.data))
      .catch(() => navigate("/admin/klien"));
  }, [id]);

  if (!klien) return <p className="p-6">Memuat...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-2">Detail Klien</h1>

      <p><strong>NIK:</strong> {klien.nik}</p>
      <p><strong>Nama:</strong> {klien.nama}</p>
      <p><strong>Alamat:</strong> {klien.alamat}</p>
      <p><strong>Kelurahan:</strong> {klien.kelurahan}</p>
      <p><strong>Kecamatan:</strong> {klien.kecamatan?.nama}</p>
      <p><strong>LKS:</strong> {klien.lks?.nama}</p>
      <p><strong>Kebutuhan:</strong> {klien.jenis_kebutuhan}</p>
      <p><strong>Bantuan:</strong> {klien.status_bantuan}</p>

      <button
        className="mt-4 px-4 py-2 bg-gray-600 text-white rounded"
        onClick={() => navigate("/admin/klien")}
      >
        Kembali
      </button>
    </div>
  );
}
