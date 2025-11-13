import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { Plus, Eye, Pencil, Loader2 } from "lucide-react";

const LKSKlienList = () => {
  const [loading, setLoading] = useState(true);
  const [klien, setKlien] = useState([]);
  const [search, setSearch] = useState("");

  const loadKlien = async () => {
    try {
      setLoading(true);

      const res = await api.get("/klien", {
        params: { search },
      });

      setKlien(res.data.data.data || []);
    } catch (err) {
      console.error("Gagal memuat daftar klien:", err);
      alert("Gagal meload data klien");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKlien();
  }, []);

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl border border-slate-200">

      {/* Header */}
      <div className="flex justify-between items-center p-5 border-b bg-slate-50">
        <h2 className="text-lg font-semibold text-slate-800">
          Data Klien LKS
        </h2>

        <Link
          to="/lks/klien/tambah"
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md text-sm"
        >
          <Plus size={16} /> Tambah Klien
        </Link>
      </div>

      {/* Search */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Cari nama / NIK..."
          className="border rounded-md px-3 py-2 w-full text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={loadKlien}
          className="mt-3 bg-slate-900 text-white px-4 py-2 rounded-md text-sm hover:bg-black"
        >
          Cari
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-500">
            <Loader2 className="animate-spin mr-2" /> Memuat data klien...
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-slate-700 font-semibold text-xs">
              <tr>
                <th className="px-4 py-3 border-r">No</th>
                <th className="px-4 py-3 border-r">NIK</th>
                <th className="px-4 py-3 border-r">Nama</th>
                <th className="px-4 py-3 border-r">Alamat</th>
                <th className="px-4 py-3 border-r">Kelurahan</th>
                <th className="px-4 py-3 border-r">Kecamatan</th>
                <th className="px-4 py-3 border-r">Jenis Kebutuhan</th>
                <th className="px-4 py-3 border-r">Status Bantuan</th>
                <th className="px-4 py-3 border-r">Status Pembinaan</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {klien.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    Tidak ada data klien.
                  </td>
                </tr>
              ) : (
                klien.map((item, index) => (
                  <tr key={item.id} className="border-t hover:bg-slate-50">
                    <td className="px-4 py-3 text-center">{index + 1}</td>
                    <td className="px-4 py-3">{item.nik}</td>
                    <td className="px-4 py-3 font-medium">{item.nama}</td>
                    <td className="px-4 py-3">{item.alamat}</td>
                    <td className="px-4 py-3">{item.kelurahan}</td>
                    <td className="px-4 py-3">
                      {item.kecamatan?.nama || "-"}
                    </td>
                    <td className="px-4 py-3">{item.jenis_kebutuhan || "-"}</td>
                    <td className="px-4 py-3">{item.status_bantuan || "-"}</td>
                    <td className="px-4 py-3">{item.status_pembinaan || "-"}</td>

                    {/* Aksi */}
                    <td className="px-4 py-3 flex gap-2 justify-center">
                      <Link
                        to={`/lks/klien/detail/${item.id}`}
                        className="text-sky-600 hover:text-sky-800"
                      >
                        <Eye size={18} />
                      </Link>

                      <Link
                        to={`/lks/klien/edit/${item.id}`}
                        className="text-amber-600 hover:text-amber-800"
                      >
                        <Pencil size={18} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LKSKlienList;
