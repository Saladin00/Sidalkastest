// src/pages/admin/lks/LKSFormWizard.jsx
import React, { useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import TabProfilUmum from "./tabs/TabProfilUmum";
// Import tab lain nanti saat dibuat

const LKSFormWizard = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    jenis_layanan: "",
    akta_pendirian: "",
    izin_operasional: "",
    kontak_pengurus: "",
    status: "Aktif",
    // Data tab lainnya nanti disatukan di sini
  });

  const tabs = [
    {
      label: "Profil Umum",
      component: (
        <TabProfilUmum data={formData} setData={setFormData} />
      ),
    },
    // Tab lainnya nanti dimasukkan di sini
  ];

  const handleNext = () => {
    if (currentTab < tabs.length - 1) setCurrentTab(currentTab + 1);
  };
  const handlePrev = () => {
    if (currentTab > 0) setCurrentTab(currentTab - 1);
  };

  return (
    <AdminLayout>
      <div className="bg-white p-6 shadow rounded-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          📝 Formulir Data LKS
        </h2>

        {/* Tabs Navigation */}
        <div className="flex gap-4 mb-6 overflow-x-auto">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentTab(idx)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition duration-150 ${
                idx === currentTab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Component */}
        <div>{tabs[currentTab].component}</div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrev}
            disabled={currentTab === 0}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            ⬅️ Sebelumnya
          </button>
          <button
            onClick={handleNext}
            disabled={currentTab === tabs.length - 1}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Selanjutnya ➡️
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default LKSFormWizard;
