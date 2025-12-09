// src/components/public/InfoSection.jsx
import React from "react";
import { motion } from "framer-motion";
import { HeartHandshake, UsersRound, Briefcase, Building2 } from "lucide-react";

export default function InfoSection() {
  const infos = [
    {
      icon: HeartHandshake,
      title: "Bantuan Sosial",
      desc: "Informasi program bantuan sosial bagi masyarakat yang membutuhkan, dikelola oleh Dinas Sosial Kabupaten Indramayu.",
    },
    {
      icon: UsersRound,
      title: "Pelayanan Masyarakat",
      desc: "Pelayanan pengaduan, konsultasi sosial, dan pendataan lembaga kesejahteraan sosial secara daring dan cepat.",
    },
    {
      icon: Briefcase,
      title: "Program Pemberdayaan",
      desc: "Dukungan pemerintah dalam meningkatkan kesejahteraan kelompok rentan dan penyandang masalah sosial.",
    },
    {
      icon: Building2,
      title: "Kemitraan Lembaga",
      desc: "Kolaborasi antar-LKS dan Dinas Sosial untuk meningkatkan kualitas layanan sosial di daerah.",
    },
  ];

  return (
    <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-cyan-50 to-white" id="layanan">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-800 mb-12">
        Informasi Layanan Sosial & Bantuan
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {infos.map((info, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="bg-white shadow-lg rounded-2xl p-6 border border-slate-100 text-center hover:shadow-xl transition"
          >
            <info.icon className="text-sky-500 mx-auto mb-4" size={36} />
            <h3 className="font-semibold text-lg mb-2 text-slate-800">
              {info.title}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">{info.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
