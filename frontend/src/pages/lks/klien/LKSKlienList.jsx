import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/api";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Loader2,
  RotateCcw,
  Search,
} from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LKSKlienList = () => {
  const [loading, setLoading] = useState(false);
  const [klien, setKlien] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    jenis_bantuan: "",
    kelompok_umur: "",
  });
  const [perPage, setPerPage] = useState(10);

  const extractList = (res) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.data)) return res.data.data;
    if (Array.isArray(res.data?.data?.data)) return res.data.data.data;
    return [];
  };

  const loadKlien = async (customFilters = filters, customSearch = search) => {
    try {
      setLoading(true);

      const lksId = sessionStorage.getItem("lks_id");

      const params = {
        lks_id: lksId,
        search: customSearch?.trim() || undefined,
        jenis_bantuan: customFilters.jenis_bantuan || undefined,
        kelompok_umur: customFilters.kelompok_umur || undefined,
      };

      const res = await api.get("/klien", { params });
      setKlien(extractList(res));
    } catch (err) {
      console.error("❌ Gagal ambil data klien:", err);
      toast.error("Gagal memuat data klien.", { autoClose: 2000 });
      setKlien([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKlien();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      loadKlien(filters, search);
    }, 500);
    return () => clearTimeout(delay);
  }, [search, filters]);

  const handleReset = () => {
    const reset = { jenis_bantuan: "", kelompok_umur: "" };
    setFilters(reset);
    setSearch("");
    loadKlien(reset, "");
    toast.info("Filter dan pencarian telah direset.", { autoClose: 2000 });
  };

  const handleDelete = async (id, nama) => {
    const result = await Swal.fire({
      title: "Hapus Klien?",
      text: `Data klien "${nama}" akan dihapus.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e02424",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      await api.delete(`/klien/${id}`);
      toast.success(`Klien "${nama}" berhasil dihapus!`);
      loadKlien(filters, search);
    } catch (err) {
      console.error("❌ Gagal hapus:", err);
      toast.error("Gagal menghapus data klien!");
    } finally {
      setLoading(false);
    }
  };

  const renderStatusBadge = (status) => {
    const isActive = status?.toLowerCase() === "aktif";
    let cls = isActive
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : "bg-rose-100 text-rose-700 border-rose-200";
    return (
      <span className={`px-2.5 py-1 text-xs rounded-full border ${cls}`}>
        {status || "-"}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border-b bg-gradient-to-r from-sky-50 to-white gap-4">

        <div className="flex flex-wrap gap-3">
          {/* FILTER JENIS BANTUAN */}
          <select
            value={filters.jenis_bantuan}
            onChange={(e) =>
              setFilters({ ...filters, jenis_bantuan: e.target.value })
            }
            className="border border-gray-300 text-sm rounded-lg px-3 py-2"
          >
            <option value="">Jenis Bantuan</option>
            <option value="PKH">PKH</option>
            <option value="BPNT">BPNT</option>
            <option value="BLT">BLT</option>
            <option value="lainnya">Lainnya</option>
          </select>

          {/* FILTER KELOMPOK UMUR */}
          <select
            value={filters.kelompok_umur}
            onChange={(e) =>
              setFilters({ ...filters, kelompok_umur: e.target.value })
            }
            className="border border-gray-300 text-sm rounded-lg px-3 py-2"
          >
            <option value="">Kelompok Umur</option>
            <option value="balita">Balita</option>
            <option value="anak">Anak</option>
            <option value="remaja">Remaja</option>
            <option value="dewasa">Dewasa</option>
            <option value="lansia">Lansia</option>
          </select>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm"
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>

        {/* SEARCH + TAMBAH */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              placeholder="Cari klien..."
              className="border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Link
            to="/lks/klien/tambah"
            className="flex items-center gap-2 bg-sky-700 hover:bg-sky-800 text-white px-4 py-2 rounded-lg text-sm"
          >
            <Plus size={16} /> Tambah Klien
          </Link>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-16 text-gray-500">
            <Loader2 className="animate-spin mr-2" /> Memuat data klien...
          </div>
        ) : (
          <table className="min-w-full text-sm border border-gray-300">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                {[
                  "No",
                  "NIK",
                  "Nama",
                  "Jenis Kelamin",
                  "Alamat",
                  "Kelurahan",
                  "Kecamatan",
                  "Jenis Bantuan",
                  "Kelompok Umur",
                  "Status Pembinaan",
                  "Aksi",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 border text-center">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {klien.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center py-6 text-gray-500 italic border">
                    Tidak ada data klien.
                  </td>
                </tr>
              ) : (
                klien.slice(0, perPage).map((item, index) => (
                  <tr key={item.id} className="hover:bg-sky-50 transition">
                    <td className="px-4 py-3 text-center border">{index + 1}</td>
                    <td className="px-4 py-3 border">{item.nik}</td>
                    <td className="px-4 py-3 border font-semibold text-gray-800">
                      {item.nama}
                    </td>

                    <td className="px-4 py-3 border text-center">
                      {item.jenis_kelamin || "-"}
                    </td>

                    <td className="px-4 py-3 border">{item.alamat}</td>
                    <td className="px-4 py-3 text-center border">
                      {item.kelurahan || "-"}
                    </td>
                    <td className="px-4 py-3 text-center border">
                      {item.kecamatan?.nama || "-"}
                    </td>

                    <td className="px-4 py-3 text-center border">
                      {item.jenis_bantuan || "-"}
                    </td>

                    <td className="px-4 py-3 text-center border">
                      {item.kelompok_umur || "-"}
                    </td>

                    <td className="px-4 py-3 text-center border">
                      {renderStatusBadge(item.status_pembinaan)}
                    </td>

                    <td className="px-4 py-3 text-center border">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/lks/klien/detail/${item.id}`}
                          className="p-1.5 rounded-md bg-sky-100 text-sky-600 hover:bg-sky-200 flex items-center gap-1"
                        >
                          <Eye size={16} />
                          <span className="hidden sm:inline text-xs">Lihat</span>
                        </Link>

                        <Link
                          to={`/lks/klien/edit/${item.id}`}
                          className="p-1.5 rounded-md bg-amber-100 text-amber-600 hover:bg-amber-200 flex items-center gap-1"
                        >
                          <Pencil size={16} />
                          <span className="hidden sm:inline text-xs">Edit</span>
                        </Link>

                        <button
                          onClick={() => handleDelete(item.id, item.nama)}
                          className="p-1.5 rounded-md bg-rose-100 text-rose-600 hover:bg-rose-200 flex items-center gap-1"
                        >
                          <Trash2 size={16} />
                          <span className="hidden sm:inline text-xs">Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* FOOTER */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-5 py-4 border-t text-sm bg-gray-50">
        <div className="flex items-center gap-2">
          <label>Tampilkan</label>
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="border rounded-lg px-2 py-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <span>data per halaman</span>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2500} hideProgressBar />
    </div>
  );
};

export default LKSKlienList;
