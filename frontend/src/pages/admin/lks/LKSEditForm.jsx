import React, { useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import TabPengurus from "./tabs/TabPenggurus";
import TabLegalitas from "./tabs/TabLegalitas";
import TabDokumen from "./tabs/TabDokumen";
import TabSarana from "./tabs/TabSarana";
import TabLokasi from "./tabs/TabLokasi";
import TabProfilUmum from "./tabs/TabProfilUmum";
import TabMonitoring from "./tabs/TabMonitoring";
import API from "../../../utils/api";
import { useNavigate } from "react-router-dom";

const LKSForm = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({
    nama: "",
    alamat: "",
    jenis_layanan: "",
    akta_pendirian: "",
    izin_operasional: "",
    kontak_pengurus: "",
    status: "Aktif",
    legalitas: "",
    nomor_akta: "",
    status_akreditasi: "",
    nomor_sertifikat: "",
    tanggal_akreditasi: "",
    sarana: JSON.stringify([]),
    kapasitas: "",
    pengurus: JSON.stringify([]),
    latitude: "",
    longitude: "",
    kunjungan: JSON.stringify([]),
  });

  const tabTitles = [
    "Profil Umum",
    "Legalitas & Akreditasi",
    "Dokumen",
    "Pengurus",
    "Sarana",
    "Lokasi",
    "Monitoring"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/lks", form);
      alert("Data LKS berhasil disimpan!");
      navigate("/admin/lks");
    } catch (err) {
      console.error("Gagal simpan:", err);
      alert("Gagal menyimpan data.");
    }
  };

  const renderTab = () => {
    switch (tab) {
      case 0:
        return <TabProfilUmum form={form} setForm={setForm} />;
      case 1:
        return <TabLegalitas form={form} setForm={setForm} />;
      case 2:
        return <TabDokumen form={form} setForm={setForm} />;
      case 3:
        return <TabPengurus form={form} setForm={setForm} />;
      case 4:
        return <TabSarana form={form} setForm={setForm} />;
      case 5:
        return <TabLokasi form={form} setForm={setForm} />;
      case 6:
        return <TabMonitoring form={form} setForm={setForm} />;
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-2 border-b mb-4 overflow-x-auto">
          {tabTitles.map((title, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setTab(index)}
              className={`px-4 py-2 border-b-2 text-sm font-semibold transition-colors duration-200 ${
                tab === index
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-blue-600"
              }`}
            >
              {title}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white p-6 rounded shadow border border-gray-200">
          {renderTab()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => setTab((prev) => Math.max(prev - 1, 0))}
            disabled={tab === 0}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            ⬅ Sebelumnya
          </button>

          {tab < tabTitles.length - 1 ? (
            <button
              type="button"
              onClick={() => setTab((prev) => Math.min(prev + 1, tabTitles.length - 1))}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Selanjutnya ➡
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              💾 Simpan Data
            </button>
          )}
        </div>
      </form>
    </AdminLayout>
  );
};

export default LKSForm;
