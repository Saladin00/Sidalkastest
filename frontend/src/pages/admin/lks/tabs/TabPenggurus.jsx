import React from "react";

const TabPengurus = ({ form, setForm }) => {
  const pengurusList = form.pengurus ? JSON.parse(form.pengurus) : [];

  const updatePengurus = (list) => {
    setForm({ ...form, pengurus: JSON.stringify(list) });
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...pengurusList];
    updated[index][field] = value;
    updatePengurus(updated);
  };

  const addPengurus = () => {
    const updated = [...pengurusList, { nama: "", jabatan: "", kontak: "", masa: "" }];
    updatePengurus(updated);
  };

  const removePengurus = (index) => {
    const updated = pengurusList.filter((_, i) => i !== index);
    updatePengurus(updated);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-semibold mb-1">Jumlah Pengurus</label>
        <input
          type="number"
          value={pengurusList.length}
          disabled
          className="w-full px-4 py-2 border rounded shadow-sm bg-gray-100"
        />
      </div>

      <div>
        <table className="min-w-full bg-white border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Nama</th>
              <th className="p-2">Jabatan</th>
              <th className="p-2">Kontak</th>
              <th className="p-2">Masa Jabatan</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {pengurusList.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">
                  <input
                    type="text"
                    value={item.nama}
                    onChange={(e) => handleFieldChange(index, "nama", e.target.value)}
                    className="w-full border px-2 py-1 rounded"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={item.jabatan}
                    onChange={(e) => handleFieldChange(index, "jabatan", e.target.value)}
                    className="w-full border px-2 py-1 rounded"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={item.kontak}
                    onChange={(e) => handleFieldChange(index, "kontak", e.target.value)}
                    className="w-full border px-2 py-1 rounded"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={item.masa}
                    onChange={(e) => handleFieldChange(index, "masa", e.target.value)}
                    className="w-full border px-2 py-1 rounded"
                  />
                </td>
                <td className="p-2">
                  <button
                    type="button"
                    onClick={() => removePengurus(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    ✖
                  </button>
                </td>
              </tr>
            ))}
            {pengurusList.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-400">
                  Belum ada data pengurus.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <button
          type="button"
          onClick={addPengurus}
          className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          ➕ Tambah Pengurus
        </button>
      </div>
    </div>
  );
};

export default TabPengurus;
