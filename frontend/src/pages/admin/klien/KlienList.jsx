import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { Search, Plus, Eye, Edit2, Trash2 } from "lucide-react";

export default function KlienList() {
  const navigate = useNavigate();

  const [klien, setKlien] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const extractList = (res) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.data)) return res.data.data;
    if (Array.isArray(res.data?.data?.data)) return res.data.data.data;
    return [];
  };

  useEffect(() => {
    api.get("/kecamatan").then((res) => setDaftarKecamatan(extractList(res)));
    fetchLKS();
  }, []);

  const fetchLKS = async (kecamatanId = "") => {
    try {
      const res = kecamatanId
        ? await api.get(`/lks/by-kecamatan/${kecamatanId}`)
        : await api.get(`/lks`);

      setDaftarLKS(extractList(res));
    } catch (err) {
      console.error("Gagal ambil LKS:", err);
      setDaftarLKS([]);
    }
  };

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

  useEffect(() => {
    fetchKlien();
  }, [filters]);

  useEffect(() => {
    if (filters.kecamatan_id) {
      fetchLKS(filters.kecamatan_id);
    } else {
      fetchLKS();
    }
    setFilters((f) => ({ ...f, lks_id: "" }));
  }, [filters.kecamatan_id]);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data klien ini?")) return;

    try {
      const token = sessionStorage.getItem("token");
      await api.delete(`/klien/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Klien berhasil dihapus");
      fetchKlien();
    } catch (err) {
      alert("Gagal menghapus klien");
    }
  };

  const handleResetFilters = () => {
    setFilters({
      status_bantuan: "",
      jenis_kebutuhan: "",
      kecamatan_id: "",
      lks_id: "",
    });
  };

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
      (!filters.kecamatan_id ||
        item.kecamatan_id == filters.kecamatan_id) &&
      (!filters.lks_id || item.lks_id == filters.lks_id) &&
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

  const pageData = uniqueFiltered.slice(0, perPage);


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
        <div className="flex flex-wrap gap-2">
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

          <select
            className="h-8 px-3 text-xs border rounded-full"
            value={filters.kecamatan_id}
            onChange={(e) =>
              setFilters({ ...filters, kecamatan_id: e.target.value })
            }
          >
            <option value="">Kecamatan</option>
            {daftarKecamatan.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama}
              </option>
            ))}
          </select>

          <select
            className="h-8 px-3 text-xs border rounded-full"
            value={filters.lks_id}
            onChange={(e) =>
              setFilters({ ...filters, lks_id: e.target.value })
            }
          >
            <option value="">LKS</option>
            {daftarLKS.map((lks) => (
              <option key={lks.id} value={lks.id}>
                {lks.nama}
              </option>
            ))}
          </select>

          <button
            className="h-8 px-3 text-xs bg-white border rounded-full"
            onClick={handleResetFilters}
          >
            Reset
          </button>
        </div>

        {/* SEARCH */}
        <div className="flex items-center gap-3">
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
            onClick={() => navigate("/admin/klien/tambah")}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md shadow flex gap-2 items-center text-sm"
          >
            <Plus size={16} /> Tambah
          </button>
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Memuat data...</p>
      ) : pageData.length === 0 ? (
        <p>Tidak ada data ditemukan</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white shadow rounded-xl">
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
                    <td className="border px-3 py-2">
                      {item.kecamatan?.nama}
                    </td>
                    <td className="border px-3 py-2">
                      {item.jenis_kebutuhan}
                    </td>
                    <td className="border px-3 py-2">{item.status_bantuan}</td>
                    <td className="border px-3 py-2">{item.lks?.nama}</td>

                    <td className="border px-3 py-2">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() =>
                            navigate(`/admin/klien/detail/${item.id}`)
                          }
                          className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded"
                        >
                          <Eye size={14} />
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/admin/klien/edit/${item.id}`)
                          }
                          className="px-3 py-1 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs rounded"
                        >
                          <Edit2 size={14} />
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-3 py-1 bg-red-50 border border-red-200 text-red-700 text-xs rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* SHOW PER PAGE CONTROL SAJA */}
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
            <option value="80">80</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="300">300</option>
            <option value="300">500</option>
            <option value="300">1000</option>
          </select>
          <span className="text-sm ml-2">data</span>
        </div>
        </>
      )}
    </div>
  );
}
