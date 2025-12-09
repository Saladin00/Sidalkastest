// src/components/public/LksListSection.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function LksListSection() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/lks")
      .then((res) => {
        const validLKS = res.data.filter(
          (l) => l.status_verifikasi === "valid"
        );
        setData(validLKS);
      })
      .catch((err) => console.error("Gagal ambil LKS:", err));
  }, []);

  const filtered = data.filter((l) =>
    l.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section id="daftar-lks" className="py-16 px-6 md:px-12 bg-white">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-800 mb-8">
        Daftar LKS Terverifikasi
      </h2>

      <div className="max-w-xl mx-auto mb-8 flex items-center gap-2 border rounded-xl px-3 py-2 bg-slate-50 shadow-sm">
        <Search className="text-sky-500" size={18} />
        <input
          type="text"
          placeholder="Cari LKS berdasarkan nama..."
          className="flex-1 bg-transparent outline-none text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filtered.map((lks, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            className="bg-white border border-slate-200 shadow-md rounded-xl p-5"
          >
            <h3 className="font-bold text-lg text-slate-800 mb-1">
              {lks.nama}
            </h3>
            <p className="text-sm text-slate-600">
              Kecamatan: {lks.kecamatan?.nama ?? "-"}
            </p>
            <p className="text-sm text-slate-600 mt-1">
              Alamat: {lks.alamat ?? "-"}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
