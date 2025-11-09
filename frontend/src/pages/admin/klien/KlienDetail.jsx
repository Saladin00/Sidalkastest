import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../utils/api";

export default function KlienDetail() {
  const { id } = useParams();
  const [klien, setKlien] = useState(null);

  useEffect(() => {
    api.get(`/klien/${id}`).then((res) => setKlien(res.data.data));
  }, [id]);

  if (!klien) return <p className="p-6">Memuat data...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-2">{klien.nama}</h1>
      <p><strong>NIK:</strong> {klien.nik}</p>
      <p><strong>Alamat:</strong> {klien.alamat}</p>
      <p><strong>Kecamatan:</strong> {klien.kecamatan}</p>
      <p><strong>Kelurahan:</strong> {klien.kelurahan}</p>
      <p><strong>Status Pembinaan:</strong> {klien.status_pembinaan}</p>
      <p><strong>Status Bantuan:</strong> {klien.status_bantuan}</p>
      <p><strong>LKS:</strong> {klien.lks?.nama}</p>

      <button
        className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
        onClick={() => (window.location.href = "/admin/klien")}
      >
        Kembali
      </button>
    </div>
  );
}
