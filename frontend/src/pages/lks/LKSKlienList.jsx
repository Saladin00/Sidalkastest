import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { Plus, Eye, Pencil, Trash2, Loader2, RotateCcw } from "lucide-react";

const LKSKlienList = () => {
  const [loading, setLoading] = useState(true);
  const [klien, setKlien] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    jenis_kebutuhan: "",
    status_bantuan: "",
  });
  const [perPage, setPerPage] = useState(10);

  // 🔁 Load data klien (gabungan versi terbaik)
  const loadKlien = async (customFilters = filters) => {
    try {
      setLoading(true);
      const lksId = sessionStorage.getItem("lks_id");

      const params = {
        search: search || undefined,
        lks_id: lksId,
        jenis_kebutuhan: customFilters.jenis_kebutuhan || undefined,
        status_bantuan: customFilters.status_bantuan || undefined,
      };

      const res = await api.get("/klien", { params });

      console.log("📦 RESP API:", res.data);

      // ✅ Aman dari berbagai struktur response
      const data =
        res?.data?.data?.data ||
        res?.data?.data ||
        res?.data ||
        [];

      if (!Array.isArray(data)) {
        console.warn("⚠️ Data klien bukan array:", data);
        setKlien([]);
        return;
      }

      setKlien(data);
    } catch (err) {
      console.error("❌ Gagal memuat daftar klien:", err);
      alert("Gagal memuat data klien");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKlien();
  }, []);

  // 🔁 Ubah filter dan refresh data
  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    loadKlien(updatedFilters);
  };

  const handleReset = () => {
    const reset = { jenis_kebutuhan: "", status_bantuan: "" };
    setSearch("");
    setFilters(reset);
    loadKlien(reset);
  };

  // 🗑️ Hapus klien
  const handleDelete = async (id, nama) => {
    const konfirmasi = window.confirm(
      `Apakah Anda yakin ingin menghapus data klien "${nama}"?`
    );
    if (!konfirmasi) return;

    try {
      setLoading(true);
      await api.delete(`/klien/${id}`);
      alert(`✅ Klien "${nama}" berhasil dihapus.`);
      await loadKlien();
    } catch (err) {
      console.error("❌ Gagal menghapus klien:", err);
      alert("Terjadi kesalahan saat menghapus data klien.");
    } finally {
      setLoading(false);
    }
  };

  // 🏷️ Badge status aktif/nonaktif
  const renderStatusBadge = (status) => {
    const isActive = status?.toLowerCase() === "aktif";
    const colorClass = isActive
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : "bg-rose-100 text-rose-700 border-rose-200";
    return (
      <span
        className={`px-2.5 py-1 text-xs font-medium rounded-full border ${colorClass}`}
      >
        {status || "-"}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center p-5 border-b bg-gradient-to-r from-sky-50 to-white gap-3">
        <h2 className="text-xl font-semibold text-gray-800">Data Klien LKS</h2>
        <Link
          to="/lks/klien/tambah"
          className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
        >
          <Plus size={16} /> Tambah Klien
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center p-4 border-b bg-white">
        <select
          value={filters.status_bantuan}
          onChange={(e) => handleFilterChange("status_bantuan", e.target.value)}
          className="border border-gray-300 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
        >
          <option value="">Status Bantuan</option>
          <option value="BLT">BLT</option>
          <option value="BPNT">BPNT</option>
          <option value="PKH">PKH</option>
          <option value="lainnya">Lainnya</option>
        </select>

        <select
          value={filters.jenis_kebutuhan}
          onChange={(e) =>
            handleFilterChange("jenis_kebutuhan", e.target.value)
          }
          className="border border-gray-300 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none"
        >
          <option value="">Jenis Kebutuhan</option>
          <option value="anak">Anak</option>
          <option value="lansia">Lansia</option>
          <option value="disabilitas">Disabilitas</option>
          <option value="fakir_miskin">Fakir Miskin</option>
        </select>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          <RotateCcw size={16} /> Reset
        </button>

        <div className="flex items-center gap-2 ml-auto">
          <input
            type="text"
            placeholder="Cari klien..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => loadKlien()}
            className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            Cari
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-16 text-gray-500">
            <Loader2 className="animate-spin mr-2" /> Memuat data klien...
          </div>
        ) : (
          <table className="min-w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold border-b border-gray-200">
              <tr>
                {[
                  "No",
                  "NIK",
                  "Nama",
                  "Alamat",
                  "Kelurahan",
                  "Kecamatan",
                  "Kebutuhan",
                  "Bantuan",
                  "Status Pembinaan",
                  "Aksi",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 border border-gray-200 text-center"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
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
                klien.slice(0, perPage).map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-sky-50 transition-all duration-200"
                  >
                    <td className="px-4 py-3 border border-gray-200 text-center">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      {item.nik}
                    </td>
                    <td className="px-4 py-3 border border-gray-200 font-semibold text-gray-800">
                      {item.nama}
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      {item.alamat}
                    </td>
                    <td className="px-4 py-3 border border-gray-200 text-center">
                      {item.kelurahan?.nama || item.kelurahan || "-"}
                    </td>
                    <td className="px-4 py-3 border border-gray-200 text-center">
                      {item.kecamatan?.nama || "-"}
                    </td>
                    <td className="px-4 py-3 border border-gray-200 text-center">
                      {item.jenis_kebutuhan || "-"}
                    </td>
                    <td className="px-4 py-3 border border-gray-200 text-center">
                      {item.status_bantuan || "-"}
                    </td>
                    <td className="px-4 py-3 border border-gray-200 text-center">
                      {renderStatusBadge(item.status_pembinaan)}
                    </td>
                    <td className="px-4 py-3 border border-gray-200 text-center">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/lks/klien/detail/${item.id}`}
                          className="p-1.5 rounded-md bg-sky-100 text-sky-600 hover:bg-sky-200 transition flex items-center gap-1"
                        >
                          <Eye size={16} />
                          <span className="hidden sm:inline text-xs font-medium">
                            Lihat
                          </span>
                        </Link>
                        <Link
                          to={`/lks/klien/edit/${item.id}`}
                          className="p-1.5 rounded-md bg-amber-100 text-amber-600 hover:bg-amber-200 transition flex items-center gap-1"
                        >
                          <Pencil size={16} />
                          <span className="hidden sm:inline text-xs font-medium">
                            Edit
                          </span>
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id, item.nama)}
                          className="p-1.5 rounded-md bg-rose-100 text-rose-600 hover:bg-rose-200 transition flex items-center gap-1"
                        >
                          <Trash2 size={16} />
                          <span className="hidden sm:inline text-xs font-medium">
                            Hapus
                          </span>
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

      {/* Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-5 py-4 border-t text-sm bg-gray-50">
        <div className="flex items-center gap-2">
          <label htmlFor="perPage" className="text-gray-600">
            Tampilkan
          </label>
          <select
            id="perPage"
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <span className="text-gray-600">data</span>
        </div>
        <span className="text-gray-500">
          Total {klien.length} klien terdaftar
        </span>
      </div>
    </div>
  );
};

export default LKSKlienList;
