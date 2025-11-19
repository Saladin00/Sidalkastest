import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { Search, Eye, RotateCw } from "lucide-react";

export default function OperatorKlienList() {
  const navigate = useNavigate();

  const [klien, setKlien] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    status_bantuan: "",
    jenis_kebutuhan: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const extractList = (res) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.data)) return res.data.data;
    if (Array.isArray(res.data?.data?.data)) return res.data.data.data;
    return [];
  };

  useEffect(() => {
    fetchKlien();
  }, []);

  const fetchKlien = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await api.get("/klien", {
        params: filters,
        headers: { Authorization: `Bearer ${token}` },
      });
      setKlien(extractList(res));
    } catch (err) {
      console.error("Gagal ambil klien:", err);
      setKlien([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      status_bantuan: "",
      jenis_kebutuhan: "",
    });
    setSearchTerm("");
    fetchKlien();
  };

  // Filter pencarian & filter dropdown
  const searchFiltered = klien.filter((item) => {
    const q = searchTerm.toLowerCase();
    if (!q) return true;
    return (
      item?.nik?.toLowerCase().includes(q) ||
      item?.nama?.toLowerCase().includes(q) ||
      item?.alamat?.toLowerCase().includes(q) ||
      item?.kelurahan?.toLowerCase().includes(q) ||
      item?.kecamatan?.nama?.toLowerCase().includes(q) ||
      item?.lks?.nama?.toLowerCase().includes(q)
    );
  });

  const fullyFiltered = searchFiltered.filter((item) => {
    return (
      (!filters.status_bantuan ||
        item.status_bantuan === filters.status_bantuan) &&
      (!filters.jenis_kebutuhan ||
        item.jenis_kebutuhan === filters.jenis_kebutuhan)
    );
  });

  const uniqueFiltered = Array.from(
    new Map(fullyFiltered.map((i) => [i.id, i])).values()
  );

  const totalPages = Math.max(1, Math.ceil(uniqueFiltered.length / perPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * perPage;
  const pageData = uniqueFiltered.slice(startIndex, startIndex + perPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
        <div className="flex flex-wrap gap-2">
          {/* Status Bantuan */}
          <select
            className="h-8 px-3 text-xs border rounded-full"
            value={filters.status_bantuan}
            onChange={(e) =>
              setFilters({ ...filters, status_bantuan: e.target.value })
            }
          >
            <option value="">Status Bantuan</option>
            <option value="PKH">PKH</option>
            <option value="BPNT">BPNT</option>
            <option value="BLT">BLT</option>
          </select>

          {/* Jenis Kebutuhan */}
          <select
            className="h-8 px-3 text-xs border rounded-full"
            value={filters.jenis_kebutuhan}
            onChange={(e) =>
              setFilters({ ...filters, jenis_kebutuhan: e.target.value })
            }
          >
            <option value="">Jenis Kebutuhan</option>
            <option value="anak">Anak</option>
            <option value="disabilitas">Disabilitas</option>
            <option value="lansia">Lansia</option>
            <option value="fakir_miskin">Fakir Miskin</option>
          </select>

          {/* Reset */}
          <button
            className="h-8 px-3 text-xs bg-white border rounded-full"
            onClick={handleResetFilters}
          >
            Reset
          </button>
        </div>

        {/* SEARCH */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Cari klien..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 pl-7 pr-3 text-sm border rounded-full"
            />
          </div>
          <button
            onClick={fetchKlien}
            className="flex items-center gap-1 text-sm border rounded-md px-3 py-1.5 bg-white hover:bg-gray-100"
          >
            <RotateCw size={14} />
            Muat Ulang
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white shadow rounded-xl">
        {loading ? (
          <div className="py-10 text-center text-gray-500">
            Memuat data klien...
          </div>
        ) : pageData.length === 0 ? (
          <div className="py-10 text-center text-gray-400 italic">
            Tidak ada data ditemukan.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2 border">No</th>
                <th className="px-3 py-2 border">NIK</th>
                <th className="px-3 py-2 border">Nama</th>
                <th className="px-3 py-2 border">Alamat</th>
                <th className="px-3 py-2 border">Kelurahan</th>
                <th className="px-3 py-2 border">Kecamatan</th>
                <th className="px-3 py-2 border">Kebutuhan</th>
                <th className="px-3 py-2 border">Bantuan</th>
                <th className="px-3 py-2 border">LKS</th>
                <th className="px-3 py-2 border text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="border px-3 py-2 text-center">
                    {startIndex + index + 1}
                  </td>
                  <td className="border px-3 py-2">{item.nik}</td>
                  <td className="border px-3 py-2">{item.nama}</td>
                  <td className="border px-3 py-2">{item.alamat}</td>
                  <td className="border px-3 py-2">{item.kelurahan}</td>
                  <td className="border px-3 py-2">{item.kecamatan?.nama}</td>
                  <td className="border px-3 py-2">{item.jenis_kebutuhan}</td>
                  <td className="border px-3 py-2">{item.status_bantuan}</td>
                  <td className="border px-3 py-2">{item.lks?.nama}</td>
                  <td className="border px-3 py-2 text-center">
                    <button
                      onClick={() =>
                        navigate(`/operator/klien/detail/${item.id}`)
                      }
                      className="flex items-center justify-center gap-1 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded hover:bg-blue-100 transition-all"
                    >
                      <Eye size={14} /> Lihat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* SHOW PER PAGE */}
      <div className="flex items-center mt-4">
        <label className="text-sm mr-2">Tampilkan</label>
        <select
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="40">40</option>
          <option value="60">60</option>
          <option value="100">100</option>
        </select>
        <span className="text-sm ml-2">data per halaman</span>
      </div>
    </div>
  );
}
