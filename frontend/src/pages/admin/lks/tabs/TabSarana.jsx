import React from "react";

const TabSarana = ({ form, setForm }) => {
  const fasilitasList = form.sarana ? JSON.parse(form.sarana) : [];

  const updateFasilitas = (list) => {
    setForm({ ...form, sarana: JSON.stringify(list) });
  };

  const handleChange = (index, value) => {
    const updated = [...fasilitasList];
    updated[index].nama = value;
    updateFasilitas(updated);
  };

  const addFasilitas = () => {
    const updated = [...fasilitasList, { nama: "" }];
    updateFasilitas(updated);
  };

  const removeFasilitas = (index) => {
    const updated = fasilitasList.filter((_, i) => i !== index);
    updateFasilitas(updated);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-semibold mb-1">Kapasitas (jumlah orang)</label>
        <input
          type="number"
          name="kapasitas"
          value={form.kapasitas || ""}
          onChange={(e) => setForm({ ...form, kapasitas: e.target.value })}
          className="w-full px-4 py-2 border rounded shadow-sm"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Fasilitas</label>
        <table className="min-w-full bg-white border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Nama Fasilitas</th>
              <th className="p-2 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {fasilitasList.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">
                  <input
                    type="text"
                    value={item.nama}
                    onChange={(e) => handleChange(index, e.target.value)}
                    className="w-full border px-2 py-1 rounded"
                  />
                </td>
                <td className="p-2 text-center">
                  <button
                    type="button"
                    onClick={() => removeFasilitas(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    ✖
                  </button>
                </td>
              </tr>
            ))}
            {fasilitasList.length === 0 && (
              <tr>
                <td colSpan="2" className="text-center py-4 text-gray-400">
                  Belum ada fasilitas ditambahkan.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <button
          type="button"
          onClick={addFasilitas}
          className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          ➕ Tambah Fasilitas
        </button>
      </div>
    </div>
  );
};

export default TabSarana;
