// src/pages/admin/lks/form/TabDokumen.jsx

import React from "react";

const TabDokumen = ({ files, setFiles }) => {
  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Akta Pendirian
        </label>
        <input
          type="file"
          name="akta"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Surat Izin Operasional
        </label>
        <input
          type="file"
          name="izin"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sertifikat Akreditasi
        </label>
        <input
          type="file"
          name="sertifikat"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
    </div>
  );
};

export default TabDokumen;
