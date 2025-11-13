import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { Search, Plus, Eye, Edit2, Trash2 } from "lucide-react";

export default function KlienList() {
  const navigate = useNavigate();
  const [klien, setKlien] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter sesuai backend
  const [filters, setFilters] = useState({
    status_bantuan: "",
    jenis_kebutuhan: "",
    kecamatan_id: "",
    lks_id: "",
  });

  const [daftarKecamatan, setDaftarKecamatan] = useState([]);
  const [daftarLKS, setDaftarLKS] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // 🟢 Ambil daftar kecamatan dari tabel 'kecamatan'
  const fetchKecamatan = async () => {
    try {
      const res = await api.get("/kecamatan");
      setDaftarKecamatan(res.data?.data || []);
    } catch (err) {
      console.error("Gagal ambil kecamatan:", err);
      setDaftarKecamatan([]);
    }
  };

  // 🟢 Ambil daftar LKS (default atau by kecamatan)
  const fetchLKS = async (kecamatanId = "") => {
    try {
      let res;
      if (kecamatanId) {
        res = await api.get(`/lks/by-kecamatan/${kecamatanId}`);
        setDaftarLKS(res.data?.data || []);
      } else {
        res = await api.get("/lks");
        setDaftarLKS(res.data?.data || []);
      }
    } catch (err) {
      console.error("Gagal ambil LKS:", err);
      setDaftarLKS([]);
    }
  };

  // 🟢 Ambil data klien (terfilter)
  const fetchKlien = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await api.get("/klien", {
        params: filters,
        headers: { Authorization: `Bearer ${token}` },
      });

      const items = res.data?.data?.data || res.data?.data || [];
      setKlien(items);
    } catch (error) {
      console.error("Gagal mengambil data klien:", error);
      alert("Terjadi kesalahan saat memuat data klien.");
      setKlien([]);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Lifecycle
  useEffect(() => {
    fetchKecamatan();
    fetchLKS();
  }, []);

  // Kalau kecamatan berubah, ambil ulang LKS by kecamatan
  useEffect(() => {
    if (filters.kecamatan_id) {
      fetchLKS(filters.kecamatan_id);
    } else {
      fetchLKS();
    }
    // Reset lks_id tiap kali kecamatan berubah
    setFilters((f) => ({ ...f, lks_id: "" }));
  }, [filters.kecamatan_id]);

  // Ambil ulang data klien setiap kali filter berubah
  useEffect(() => {
    fetchKlien();
  }, [filters]);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data klien ini?")) return;
    try {
      const token = sessionStorage.getItem("token");
      await api.delete(`/klien/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Klien berhasil dihapus!");
      fetchKlien();
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus data klien.");
    }
  };

  const handleResetFilters = () => {
    setFilters({
      status_bantuan: "",
      jenis_kebutuhan: "",
      kecamatan_id: "",
      lks_id: "",
    });
    setCurrentPage(1);
  };

  // FRONTEND SEARCH
  const filteredKlien = klien.filter((item) => {
    const q = searchTerm.toLowerCase();
    if (!q) return true;
    return (
      item.nik?.toLowerCase().includes(q) ||
      item.nama?.toLowerCase().includes(q) ||
      item.alamat?.toLowerCase().includes(q) ||
      item.kelurahan?.toLowerCase().includes(q) ||
      item.kecamatan?.nama?.toLowerCase().includes(q) ||
      item.lks?.nama?.toLowerCase().includes(q)
    );
  });

  // PAGINATION
  const totalPages = Math.max(1, Math.ceil(filteredKlien.length / perPage));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const startIndex = (currentPageSafe - 1) * perPage;
  const paginatedKlien = filteredKlien.slice(
    startIndex,
    startIndex + perPage
  );

  const handleChangePerPage = (e) => {
    setPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* TOP BAR: filter + reset + search + tambah */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter dropdowns */}
          <select
            className="h-8 min-w-[150px] rounded-full border border-gray-300 bg-white px-3 text-xs focus:outline-none focus:ring-1 focus:ring-slate-500"
            value={filters.status_bantuan}
            onChange={(e) =>
              setFilters({ ...filters, status_bantuan: e.target.value })
            }
          >
            <option value="">Status Bantuan: Semua</option>
            <option value="PKH">PKH</option>
            <option value="BPNT">BPNT</option>
            <option value="BLT">BLT</option>
            <option value="lainnya">Lainnya</option>
          </select>

          <select
            className="h-8 min-w-[160px] rounded-full border border-gray-300 bg-white px-3 text-xs focus:outline-none focus:ring-1 focus:ring-slate-500"
            value={filters.jenis_kebutuhan}
            onChange={(e) =>
              setFilters({ ...filters, jenis_kebutuhan: e.target.value })
            }
          >
            <option value="">Jenis Kebutuhan: Semua</option>
            <option value="anak">Anak</option>
            <option value="disabilitas">Disabilitas</option>
            <option value="lansia">Lansia</option>
            <option value="fakir_miskin">Fakir Miskin</option>
          </select>

          <select
            className="h-8 min-w-[150px] rounded-full border border-gray-300 bg-white px-3 text-xs focus:outline-none focus:ring-1 focus:ring-slate-500"
            value={filters.kecamatan_id}
            onChange={(e) =>
              setFilters({ ...filters, kecamatan_id: e.target.value })
            }
          >
            <option value="">Kecamatan: Semua</option>
            {daftarKecamatan.map((kec) => (
              <option key={kec.id} value={kec.id}>
                {kec.nama}
              </option>
            ))}
          </select>

          <select
            className="h-8 min-w-[140px] rounded-full border border-gray-300 bg-white px-3 text-xs focus:outline-none focus:ring-1 focus:ring-slate-500"
            value={filters.lks_id}
            onChange={(e) =>
              setFilters({ ...filters, lks_id: e.target.value })
            }
          >
            <option value="">LKS: Semua</option>
            {daftarLKS.map((lks) => (
              <option key={lks.id} value={lks.id}>
                {lks.nama}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleResetFilters}
            className="h-8 rounded-full border border-gray-300 px-3 text-xs text-gray-700 hover:bg-gray-100"
          >
            Reset
          </button>
        </div>

        {/* Search & Tambah */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari klien..."
              className="h-9 min-w-[200px] pl-7 pr-3 border border-gray-300 rounded-full text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-slate-500 bg-white"
            />
          </div>

          <button
            onClick={() => navigate("/admin/klien/tambah")}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm"
          >
            <Plus size={16} />
            <span>Tambah Klien</span>
          </button>
        </div>
      </div>

      {/* TABLE DATA */}
      {loading ? (
        <p className="text-gray-600">Memuat data klien...</p>
      ) : filteredKlien.length === 0 ? (
        <p className="text-gray-500 italic">Tidak ada data klien ditemukan.</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white shadow-md rounded-xl ring-1 ring-slate-200/60">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800">
                  <th className="px-3 py-2.5 border border-slate-200/70 w-10 text-left">No</th>
                  <th className="px-3 py-2.5 border border-slate-200/70 text-left">NIK</th>
                  <th className="px-3 py-2.5 border border-slate-200/70 text-left">Nama</th>
                  <th className="px-3 py-2.5 border border-slate-200/70 text-left">Alamat</th>
                  <th className="px-3 py-2.5 border border-slate-200/70 text-left">Kelurahan</th>
                  <th className="px-3 py-2.5 border border-slate-200/70 text-left">Kecamatan</th>
                  <th className="px-3 py-2.5 border border-slate-200/70 text-left">Jenis Kebutuhan</th>
                  <th className="px-3 py-2.5 border border-slate-200/70 text-left">Status Bantuan</th>
                  <th className="px-3 py-2.5 border border-slate-200/70 text-left">LKS</th>
                  <th className="px-3 py-2.5 border border-slate-200/70 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedKlien.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 border-b border-slate-200/70 last:border-b-0"
                  >
                    <td className="px-3 py-2.5 border border-slate-200/70 text-center">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-3 py-2.5 border border-slate-200/70">{item.nik}</td>
                    <td className="px-3 py-2.5 border border-slate-200/70">{item.nama}</td>
                    <td className="px-3 py-2.5 border border-slate-200/70">{item.alamat}</td>
                    <td className="px-3 py-2.5 border border-slate-200/70">{item.kelurahan}</td>
                    <td className="px-3 py-2.5 border border-slate-200/70">
                      {item.kecamatan?.nama || "-"}
                    </td>
                    <td className="px-3 py-2.5 border border-slate-200/70">
                      {item.jenis_kebutuhan || "-"}
                    </td>
                    <td className="px-3 py-2.5 border border-slate-200/70">
                      {item.status_bantuan || "-"}
                    </td>
                    <td className="px-3 py-2.5 border border-slate-200/70">
                      {item.lks?.nama || "-"}
                    </td>
                    <td className="px-3 py-2.5 border border-slate-200/70">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 text-xs font-semibold hover:bg-blue-100"
                          onClick={() => navigate(`/admin/klien/detail/${item.id}`)}
                        >
                          <Eye size={14} />
                          Detail
                        </button>
                        <button
                          className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 text-xs font-semibold hover:bg-amber-100"
                          onClick={() => navigate(`/admin/klien/edit/${item.id}`)}
                        >
                          <Edit2 size={14} />
                          Edit
                        </button>
                        <button
                          className="inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 text-xs font-semibold hover:bg-rose-100"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 size={14} />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="mt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-gray-600">
            <div className="flex flex-wrap items-center gap-2">
              <span>Show</span>
              <select
                value={perPage}
                onChange={handleChangePerPage}
                className="border border-gray-300 rounded-md px-2 py-1 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-slate-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>entries </span>
            </div>

            <div className="flex items-center gap-1 self-start md:self-auto">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPageSafe === 1}
                className={`px-2 py-1.5 border rounded-md ${
                  currentPageSafe === 1
                    ? "text-gray-300 border-gray-200 cursor-not-allowed"
                    : "text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 border rounded-md ${
                    page === currentPageSafe
                      ? "bg-slate-900 text-white border-slate-900"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPageSafe === totalPages}
                className={`px-2 py-1.5 border rounded-md ${
                  currentPageSafe === totalPages
                    ? "text-gray-300 border-gray-200 cursor-not-allowed"
                    : "text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
