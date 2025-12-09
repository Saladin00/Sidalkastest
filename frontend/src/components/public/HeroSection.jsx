// src/components/public/HeroSection.jsx
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center py-28 px-6 bg-gradient-to-b from-cyan-600 to-sky-700 text-white">
      <motion.img
        src="/logo.png"
        alt="Logo Dinsos"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-28 h-28 mb-6"
      />

      <motion.h1
        className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        SIDALEKAS
      </motion.h1>

      <p className="text-lg text-cyan-100 max-w-xl">
        Sistem Informasi Data Lembaga Kesejahteraan Sosial Kabupaten Indramayu
      </p>

      <motion.a
        href="#daftar-lks"
        whileHover={{ scale: 1.05 }}
        className="mt-8 inline-flex items-center gap-2 bg-white text-sky-700 font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-sky-50 transition"
      >
        Lihat Daftar LKS <ArrowRight size={18} />
      </motion.a>
    </section>
  );
}
